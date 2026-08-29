using APX.Application.Common;
using APX.Domain.Admin;

namespace APX.Application.Authentication;

public interface IAuthRepository
{
    Task<AdminUser?> FindActiveUserByEmailAsync(string normalizedEmail, CancellationToken ct);
    Task<OtpChallenge?> GetLatestOpenChallengeAsync(Guid adminUserId, CancellationToken ct);
    Task CreateChallengeAsync(OtpChallenge challenge, CancellationToken ct);
    Task InvalidateChallengeAsync(Guid challengeId, CancellationToken ct);
    Task<OtpChallenge?> GetChallengeAsync(Guid challengeId, CancellationToken ct);
    Task<bool> SaveFailedAttemptAsync(OtpChallenge challenge, AuthRequestContext context, CancellationToken ct);
    Task CreateSessionAsync(OtpChallenge challenge, AdminSession session, int maximumActiveSessions, AuthRequestContext context, CancellationToken ct);
    Task<AdminSession?> GetActiveSessionAsync(string tokenHash, CancellationToken ct);
    Task RevokeSessionAsync(Guid sessionId, AuthRequestContext context, CancellationToken ct);
    Task<Result<Guid>> BootstrapAdminAsync(string normalizedEmail, string displayName, CancellationToken ct);
}

public interface IEmailSender { Task SendOtpAsync(Guid challengeId, string email, string code, DateTimeOffset expiresAt, CancellationToken ct); }
