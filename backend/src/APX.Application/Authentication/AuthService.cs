using System.Security.Cryptography;
using System.Text;
using APX.Application.Common;
using APX.Domain.Admin;

namespace APX.Application.Authentication;

public sealed class AuthService(IAuthRepository repository, IEmailSender emailSender, AuthOptions options)
{
    public async Task<Result<OtpChallengeDto>> RequestOtpAsync(RequestOtpDto request, AuthRequestContext context, CancellationToken ct)
    {
        if (!request.Channel.Equals("email", StringComparison.OrdinalIgnoreCase)) return Result<OtpChallengeDto>.Failure(new(ErrorType.Validation, "not_supported", "Only email OTP is currently supported."));
        var email = NormalizeEmail(request.Destination);
        if (!IsPlausibleEmail(email)) return Result<OtpChallengeDto>.Failure(Errors.Validation("Invalid OTP request.", new Dictionary<string, string[]> { ["destination"] = ["A valid email is required."] }));
        var now = DateTimeOffset.UtcNow; var genericId = Guid.NewGuid(); var expiry = now.AddMinutes(options.OtpLifetimeMinutes); var masked = MaskEmail(email);
        var user = await repository.FindActiveUserByEmailAsync(email, ct);
        if (user is null) return Result<OtpChallengeDto>.Success(new(genericId, expiry, masked));
        var latest = await repository.GetLatestOpenChallengeAsync(user.Id, ct);
        if (latest is not null && latest.CreatedAt.AddSeconds(options.OtpCooldownSeconds) > now) return Result<OtpChallengeDto>.Success(new(latest.Id, latest.ExpiresAt, masked));
        EnsurePepper(); var id = Guid.NewGuid(); var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
        var challenge = new OtpChallenge { Id = id, AdminUserId = user.Id, Channel = "email", Destination = email, CodeHash = HashOtp(id, code), ExpiresAt = expiry, MaxAttempts = options.OtpMaxAttempts, CreatedAt = now, IpAddress = context.IpAddress, UserAgent = Limit(context.UserAgent, 500) };
        await repository.CreateChallengeAsync(challenge, ct); await emailSender.SendOtpAsync(email, code, expiry, ct);
        return Result<OtpChallengeDto>.Success(new(id, expiry, masked));
    }

    public async Task<Result<CreatedAdminSession>> VerifyOtpAsync(VerifyOtpDto request, AuthRequestContext context, CancellationToken ct)
    {
        if (request.Code.Length != 6 || !request.Code.All(char.IsAsciiDigit)) return InvalidOtp();
        EnsurePepper(); var challenge = await repository.GetChallengeAsync(request.ChallengeId, ct); var now = DateTimeOffset.UtcNow;
        if (challenge is null) return Failure("otp_challenge_not_found");
        if (challenge.ConsumedAt.HasValue) return Failure("otp_consumed");
        if (challenge.LockedAt.HasValue || challenge.Attempts >= challenge.MaxAttempts) return Failure("otp_locked");
        if (challenge.ExpiresAt <= now) return Failure("otp_expired");
        if (challenge.AdminUser.Status != AdminUserStatus.Active) return Failure("otp_invalid");
        if (!CryptographicOperations.FixedTimeEquals(Convert.FromHexString(challenge.CodeHash), Convert.FromHexString(HashOtp(challenge.Id, request.Code))))
        {
            var locked = await repository.SaveFailedAttemptAsync(challenge, context, ct); return locked ? Failure("otp_locked") : InvalidOtp();
        }
        var tokenBytes = RandomNumberGenerator.GetBytes(32); var token = Base64Url(tokenBytes); var roles = challenge.AdminUser.UserRoles.Select(x => x.Role.Name).Distinct(StringComparer.OrdinalIgnoreCase).Order().ToArray(); var expires = now.AddHours(options.SessionLifetimeHours);
        var session = new AdminSession { Id = Guid.NewGuid(), AdminUserId = challenge.AdminUserId, TokenHash = HashToken(token), CreatedAt = now, ExpiresAt = expires, LastSeenAt = now, IpAddress = context.IpAddress, UserAgent = Limit(context.UserAgent, 500) };
        await repository.CreateSessionAsync(challenge, session, options.MaxSessionsPerUser, context, ct);
        return Result<CreatedAdminSession>.Success(new(token, new(true, challenge.AdminUserId, challenge.AdminUser.DisplayName, challenge.AdminUser.Email, roles, AdminPermissions.ForRoles(roles), expires)));
    }

    public async Task<AuthSessionDto?> ValidateSessionAsync(string token, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(token)) return null; var session = await repository.GetActiveSessionAsync(HashToken(token), ct); if (session is null || session.ExpiresAt <= DateTimeOffset.UtcNow || session.RevokedAt.HasValue || session.AdminUser.Status != AdminUserStatus.Active) return null;
        var roles = session.AdminUser.UserRoles.Select(x => x.Role.Name).Distinct(StringComparer.OrdinalIgnoreCase).Order().ToArray(); return new(true, session.AdminUserId, session.AdminUser.DisplayName, session.AdminUser.Email, roles, AdminPermissions.ForRoles(roles), session.ExpiresAt);
    }

    public async Task LogoutAsync(string? token, AuthRequestContext context, CancellationToken ct) { if (string.IsNullOrWhiteSpace(token)) return; var session = await repository.GetActiveSessionAsync(HashToken(token), ct); if (session is not null) await repository.RevokeSessionAsync(session.Id, context, ct); }
    public Task<Result<Guid>> BootstrapAdminAsync(string email, string name, CancellationToken ct) => repository.BootstrapAdminAsync(NormalizeEmail(email), name.Trim(), ct);
    public static string HashToken(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    private string HashOtp(Guid id, string code) { using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(options.OtpPepper)); return Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes($"{id:D}:{code}"))); }
    private void EnsurePepper() { if (options.OtpPepper.Length < 32) throw new InvalidOperationException("Auth:OtpPepper must contain at least 32 characters."); }
    private static Result<CreatedAdminSession> InvalidOtp() => Failure("otp_invalid");
    private static Result<CreatedAdminSession> Failure(string code) => Result<CreatedAdminSession>.Failure(new(ErrorType.Unauthorized, code, "The OTP challenge or code is invalid."));
    private static string NormalizeEmail(string value) => value.Trim().ToLowerInvariant();
    private static bool IsPlausibleEmail(string value) => value.Length is > 3 and <= 320 && value.Contains('@') && value.IndexOf('@') > 0 && value.LastIndexOf('.') > value.IndexOf('@') + 1;
    private static string MaskEmail(string email) { var at = email.IndexOf('@'); var local = email[..at]; return $"{local[0]}***@{email[(at + 1)..]}"; }
    private static string Base64Url(byte[] bytes) => Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
    private static string? Limit(string? value, int max) => string.IsNullOrWhiteSpace(value) ? null : value[..Math.Min(value.Length, max)];
}
