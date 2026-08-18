using APX.Application.Emailing;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
namespace APX.Infrastructure.Emailing;
public sealed class DevelopmentEmailTransport(ILogger<DevelopmentEmailTransport> logger) : IEmailTransport
{
    public Task SendAsync(EmailMessage message, CancellationToken ct) { logger.LogInformation("Development email prepared for {RecipientCount} recipient(s), subject {Subject}.", message.To.Count, message.Subject); return Task.CompletedTask; }
}
public sealed class SmtpEmailTransport(TransactionalEmailOptions options, ILogger<SmtpEmailTransport> logger) : IEmailTransport
{
    public async Task SendAsync(EmailMessage message, CancellationToken ct)
    {
        Validate(message); Exception? last = null;
        for (var attempt = 1; attempt <= Math.Clamp(options.Smtp.MaxAttempts, 1, 3); attempt++)
        {
            try { await SendOnce(message, ct); return; }
            catch (Exception ex) when (ex is SmtpCommandException or SmtpProtocolException or IOException or TimeoutException) { last = ex; logger.LogWarning("SMTP transient failure on attempt {Attempt} of {Maximum}; code {ErrorCode}.", attempt, options.Smtp.MaxAttempts, ex.GetType().Name); if (attempt < options.Smtp.MaxAttempts) await Task.Delay(TimeSpan.FromMilliseconds(250 * attempt), ct); }
        }
        throw new EmailTransportException("smtp_delivery_failed", last);
    }
    private async Task SendOnce(EmailMessage source, CancellationToken ct)
    {
        var message = new MimeMessage(); message.From.Add(new MailboxAddress(options.FromName, options.FromAddress)); foreach (var recipient in source.To) message.To.Add(new MailboxAddress(recipient.Name ?? string.Empty, recipient.Address)); if (source.ReplyTo is not null) message.ReplyTo.Add(new MailboxAddress(source.ReplyTo.Name ?? string.Empty, source.ReplyTo.Address)); message.Subject = source.Subject; message.Body = new BodyBuilder { TextBody = source.TextBody, HtmlBody = source.HtmlBody }.ToMessageBody();
        using var client = new SmtpClient { Timeout = Math.Clamp(options.Smtp.TimeoutSeconds, 5, 60) * 1000 }; var socket = options.Smtp.UseStartTls ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto; await client.ConnectAsync(options.Smtp.Host, options.Smtp.Port, socket, ct); await client.AuthenticateAsync(options.Smtp.Username, options.Smtp.Password, ct); await client.SendAsync(message, ct); await client.DisconnectAsync(true, ct);
    }
    private static void Validate(EmailMessage message) { if (message.To.Count == 0 || message.To.Any(x => !MailboxAddress.TryParse(x.Address, out _)) || (message.ReplyTo is not null && !MailboxAddress.TryParse(message.ReplyTo.Address, out _)) || message.Subject.Contains('\r') || message.Subject.Contains('\n')) throw new EmailTransportException("invalid_email_headers"); }
}
public sealed class EmailTransportException(string code, Exception? inner = null) : Exception("Transactional email delivery failed.", inner) { public string Code { get; } = code; }
