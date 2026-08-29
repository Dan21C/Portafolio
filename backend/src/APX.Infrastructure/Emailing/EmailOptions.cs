namespace APX.Infrastructure.Emailing;
public sealed record SmtpOptions(string Host, int Port, string Username, string Password, bool UseStartTls = true, int TimeoutSeconds = 15, int MaxAttempts = 3);
public sealed record ResendOptions(string ApiKey, string BaseUrl = "https://api.resend.com", int TimeoutSeconds = 15, int MaxAttempts = 3);
public sealed record TransactionalEmailOptions(string Provider, string FromAddress, string FromName, string? ReplyToAddress, IReadOnlyList<string> InternalRecipients, SmtpOptions Smtp, string? AdminBaseUrl, ResendOptions? Resend = null);
