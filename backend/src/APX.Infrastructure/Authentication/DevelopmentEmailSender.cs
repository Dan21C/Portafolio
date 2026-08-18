using APX.Application.Authentication;
using Microsoft.Extensions.Logging;

namespace APX.Infrastructure.Authentication;

public sealed record EmailSenderRuntimeOptions(bool IsDevelopment);

public sealed class DevelopmentEmailSender(EmailSenderRuntimeOptions environment, AuthOptions options, ILogger<DevelopmentEmailSender> logger) : IEmailSender
{
    public Task SendOtpAsync(Guid challengeId, string email, string code, DateTimeOffset expiresAt, CancellationToken ct)
    {
        if (!environment.IsDevelopment) throw new InvalidOperationException("A production email provider has not been configured.");
        if (options.EnableDevelopmentOtpDisclosure) logger.LogWarning("DEVELOPMENT ONLY — OTP for {MaskedEmail}: {OtpCode}; expires {ExpiresAt}", Mask(email), code, expiresAt);
        else logger.LogInformation("Development OTP generated for {MaskedEmail}; disclosure is disabled.", Mask(email));
        return Task.CompletedTask;
    }
    private static string Mask(string email) { var at = email.IndexOf('@'); return $"{email[0]}***{email[at..]}"; }
}
