using APX.Application.Authentication;
using APX.Application.Common;
using APX.Domain.Admin;

namespace APX.Tests;

public sealed class AuthServiceTests
{
    private const string Pepper = "test-only-pepper-with-at-least-32-characters";

    [Fact] public async Task ValidOtp_CreatesHashedSessionAndConsumesChallenge() { var f = new Fixture(); var requested = await f.Request(); var verified = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, f.Email.Code!), f.Context, default); Assert.True(verified.Succeeded); Assert.NotNull(f.Repository.Session); Assert.NotEqual(verified.Value!.Token, f.Repository.Session!.TokenHash); Assert.NotNull(f.Repository.Challenge!.ConsumedAt); }
    [Fact] public async Task IncorrectOtp_IncrementsAttempts() { var f = new Fixture(); var requested = await f.Request(); var result = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, "000000"), f.Context, default); Assert.False(result.Succeeded); Assert.Equal(1, f.Repository.Challenge!.Attempts); }
    [Fact] public async Task ExpiredOtp_IsRejected() { var f = new Fixture(); var requested = await f.Request(); f.Repository.Challenge!.ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(-1); var result = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, f.Email.Code!), f.Context, default); Assert.Equal("otp_expired", result.Error!.Code); }
    [Fact] public async Task ConsumedOtp_CannotBeReused() { var f = new Fixture(); var requested = await f.Request(); await f.Service.VerifyOtpAsync(new(requested.ChallengeId, f.Email.Code!), f.Context, default); var reused = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, f.Email.Code!), f.Context, default); Assert.Equal("otp_consumed", reused.Error!.Code); }
    [Fact] public async Task MaximumAttempts_LocksChallenge() { var f = new Fixture(maxAttempts: 2); var requested = await f.Request(); await f.Service.VerifyOtpAsync(new(requested.ChallengeId, "000000"), f.Context, default); var result = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, "000000"), f.Context, default); Assert.Equal("otp_locked", result.Error!.Code); Assert.NotNull(f.Repository.Challenge!.LockedAt); }
    [Fact] public async Task Cooldown_ReusesChallengeWithoutSendingAgain() { var f = new Fixture(); var first = await f.Request(); var second = await f.Request(); Assert.Equal(first.ChallengeId, second.ChallengeId); Assert.Equal(1, f.Email.SendCount); }
    [Fact] public async Task DisabledUser_DoesNotReceiveOtp() { var f = new Fixture(); f.Repository.User.Status = AdminUserStatus.Disabled; await f.Request(); Assert.Equal(0, f.Email.SendCount); }
    [Fact] public async Task EmailFailure_InvalidatesChallengeAndReturnsSafeError() { var f = new Fixture(); f.Email.Fail = true; var result = await f.Service.RequestOtpAsync(new("email", f.Repository.User.Email!), f.Context, default); Assert.False(result.Succeeded); Assert.Equal("email_delivery_failed", result.Error!.Code); Assert.NotNull(f.Repository.Challenge!.LockedAt); }
    [Fact] public async Task SessionStates_AreValidated() { var f = new Fixture(); var requested = await f.Request(); var verified = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, f.Email.Code!), f.Context, default); Assert.NotNull(await f.Service.ValidateSessionAsync(verified.Value!.Token, default)); f.Repository.Session!.ExpiresAt = DateTimeOffset.UtcNow.AddSeconds(-1); Assert.Null(await f.Service.ValidateSessionAsync(verified.Value.Token, default)); f.Repository.Session.ExpiresAt = DateTimeOffset.UtcNow.AddHours(1); f.Repository.Session.RevokedAt = DateTimeOffset.UtcNow; Assert.Null(await f.Service.ValidateSessionAsync(verified.Value.Token, default)); }
    [Fact] public async Task Logout_RevokesSession() { var f = new Fixture(); var requested = await f.Request(); var verified = await f.Service.VerifyOtpAsync(new(requested.ChallengeId, f.Email.Code!), f.Context, default); await f.Service.LogoutAsync(verified.Value!.Token, f.Context, default); Assert.NotNull(f.Repository.Session!.RevokedAt); }
    [Theory] [InlineData("Admin", true, true)] [InlineData("Editor", true, false)] [InlineData("Viewer", false, false)] public void Roles_MapToExpectedPermissions(string role, bool write, bool delete) { var permissions = AdminPermissions.ForRoles([role]); Assert.Equal(write, permissions.Contains(AdminPermissions.ContentWrite)); Assert.Equal(delete, permissions.Contains(AdminPermissions.Delete)); Assert.Contains(AdminPermissions.Read, permissions); }

    private sealed class Fixture
    {
        public FakeAuthRepository Repository { get; } = new(); public FakeEmailSender Email { get; } = new(); public AuthService Service { get; } public AuthRequestContext Context { get; } = new("127.0.0.1", "tests");
        public Fixture(int maxAttempts = 5) => Service = new(Repository, Email, new(OtpMaxAttempts: maxAttempts, OtpPepper: Pepper));
        public async Task<OtpChallengeDto> Request() { var result = await Service.RequestOtpAsync(new("email", Repository.User.Email!), Context, default); Assert.True(result.Succeeded); return result.Value!; }
    }

    private sealed class FakeEmailSender : IEmailSender { public string? Code { get; private set; } public int SendCount { get; private set; } public bool Fail { get; set; } public Task SendOtpAsync(Guid challengeId, string email, string code, DateTimeOffset expiresAt, CancellationToken ct) { Code = code; SendCount++; return Fail ? Task.FromException(new InvalidOperationException("SMTP details must not escape")) : Task.CompletedTask; } }
    private sealed class FakeAuthRepository : IAuthRepository
    {
        public AdminUser User { get; } = new() { Id = Guid.NewGuid(), Email = "admin@example.com", DisplayName = "Admin", Status = AdminUserStatus.Active };
        public OtpChallenge? Challenge { get; set; } public AdminSession? Session { get; set; }
        public FakeAuthRepository() { User.UserRoles.Add(new AdminUserRole { AdminUserId = User.Id, RoleId = Guid.NewGuid(), Role = new Role { Name = "Admin" } }); }
        public Task<AdminUser?> FindActiveUserByEmailAsync(string email, CancellationToken ct) => Task.FromResult<AdminUser?>(User.Status == AdminUserStatus.Active && User.Email == email ? User : null);
        public Task<OtpChallenge?> GetLatestOpenChallengeAsync(Guid id, CancellationToken ct) => Task.FromResult(Challenge is { ConsumedAt: null, LockedAt: null } ? Challenge : null);
        public Task CreateChallengeAsync(OtpChallenge challenge, CancellationToken ct) { Challenge = challenge; challenge.AdminUser = User; return Task.CompletedTask; }
        public Task InvalidateChallengeAsync(Guid id, CancellationToken ct) { if (Challenge?.Id == id) Challenge.LockedAt = DateTimeOffset.UtcNow; return Task.CompletedTask; }
        public Task<OtpChallenge?> GetChallengeAsync(Guid id, CancellationToken ct) => Task.FromResult(Challenge?.Id == id ? Challenge : null);
        public Task<bool> SaveFailedAttemptAsync(OtpChallenge challenge, AuthRequestContext context, CancellationToken ct) { challenge.Attempts++; var locked = challenge.Attempts >= challenge.MaxAttempts; if (locked) challenge.LockedAt = DateTimeOffset.UtcNow; return Task.FromResult(locked); }
        public Task CreateSessionAsync(OtpChallenge challenge, AdminSession session, int maximum, AuthRequestContext context, CancellationToken ct) { challenge.ConsumedAt = DateTimeOffset.UtcNow; session.AdminUser = User; Session = session; return Task.CompletedTask; }
        public Task<AdminSession?> GetActiveSessionAsync(string hash, CancellationToken ct) => Task.FromResult(Session?.TokenHash == hash ? Session : null);
        public Task RevokeSessionAsync(Guid id, AuthRequestContext context, CancellationToken ct) { if (Session?.Id == id) Session.RevokedAt = DateTimeOffset.UtcNow; return Task.CompletedTask; }
        public Task<Result<Guid>> BootstrapAdminAsync(string email, string name, CancellationToken ct) => Task.FromResult(Result<Guid>.Success(User.Id));
    }
}
