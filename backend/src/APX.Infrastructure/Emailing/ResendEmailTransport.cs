using System.Net;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using APX.Application.Emailing;
using Microsoft.Extensions.Logging;

namespace APX.Infrastructure.Emailing;

public sealed class ResendEmailTransport(HttpClient client, TransactionalEmailOptions options, ILogger<ResendEmailTransport> logger) : IEmailTransport
{
    public async Task SendAsync(EmailMessage message, CancellationToken ct)
    {
        EmailMessageValidation.Validate(message);
        var resend = options.Resend ?? throw new InvalidOperationException("Resend email provider is not configured.");
        var payload = BuildPayload(message);
        var maxAttempts = Math.Clamp(resend.MaxAttempts, 1, 5);
        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            var isLastAttempt = attempt == maxAttempts;
            try
            {
                using var request = new HttpRequestMessage(HttpMethod.Post, "emails") { Content = JsonContent.Create(payload) };
                if (!string.IsNullOrWhiteSpace(message.IdempotencyKey)) request.Headers.TryAddWithoutValidation("Idempotency-Key", message.IdempotencyKey);
                using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
                if (response.IsSuccessStatusCode) return;
                if (!IsTransient(response.StatusCode) || isLastAttempt) throw new EmailTransportException(MapErrorCode(response.StatusCode));
                logger.LogWarning("Resend transient failure on attempt {Attempt} of {Maximum}; status {StatusCode}.", attempt, maxAttempts, (int)response.StatusCode);
            }
            catch (EmailTransportException) { throw; }
            catch (Exception ex) when (ex is HttpRequestException or TimeoutException || (ex is TaskCanceledException && !ct.IsCancellationRequested))
            {
                if (isLastAttempt) throw new EmailTransportException("resend_delivery_failed", ex);
                logger.LogWarning("Resend transient exception on attempt {Attempt} of {Maximum}; type {ExceptionType}.", attempt, maxAttempts, ex.GetType().Name);
            }
            await Task.Delay(TimeSpan.FromMilliseconds(250 * attempt), ct);
        }
        throw new EmailTransportException("resend_delivery_failed");
    }

    private ResendEmailRequest BuildPayload(EmailMessage message) => new()
    {
        From = FormatAddress(new EmailAddress(options.FromAddress, options.FromName)),
        To = message.To.Select(FormatAddress).ToArray(),
        Subject = message.Subject,
        Html = message.HtmlBody,
        Text = message.TextBody,
        ReplyTo = message.ReplyTo is null ? null : FormatAddress(message.ReplyTo)
    };

    private static string FormatAddress(EmailAddress address) => string.IsNullOrWhiteSpace(address.Name) ? address.Address : $"{address.Name} <{address.Address}>";

    private static bool IsTransient(HttpStatusCode status) => status is HttpStatusCode.RequestTimeout or HttpStatusCode.TooManyRequests || (int)status >= 500;

    private static string MapErrorCode(HttpStatusCode status) => status switch
    {
        HttpStatusCode.TooManyRequests => "resend_rate_limited",
        HttpStatusCode.Unauthorized or HttpStatusCode.Forbidden => "resend_auth_failed",
        HttpStatusCode.BadRequest or HttpStatusCode.UnprocessableEntity => "resend_validation_failed",
        _ => "resend_delivery_failed"
    };

    private sealed class ResendEmailRequest
    {
        [JsonPropertyName("from")] public string From { get; init; } = string.Empty;
        [JsonPropertyName("to")] public IReadOnlyList<string> To { get; init; } = [];
        [JsonPropertyName("subject")] public string Subject { get; init; } = string.Empty;
        [JsonPropertyName("html")] public string Html { get; init; } = string.Empty;
        [JsonPropertyName("text")] public string Text { get; init; } = string.Empty;
        [JsonPropertyName("reply_to")] public string? ReplyTo { get; init; }
    }
}
