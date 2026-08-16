using APX.Application.Authentication;
using APX.Application.Common;
using APX.Domain.Admin;
using APX.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace APX.Infrastructure.Authentication;

public sealed class EfAuthRepository(ApxDbContext db) : IAuthRepository
{
    public Task<AdminUser?> FindActiveUserByEmailAsync(string email, CancellationToken ct) => db.AdminUsers.SingleOrDefaultAsync(x => x.Email != null && x.Email.ToLower() == email && x.Status == AdminUserStatus.Active, ct);
    public Task<OtpChallenge?> GetLatestOpenChallengeAsync(Guid userId, CancellationToken ct) { var now = DateTimeOffset.UtcNow; return db.OtpChallenges.AsNoTracking().Where(x => x.AdminUserId == userId && x.ConsumedAt == null && x.LockedAt == null && x.ExpiresAt > now).OrderByDescending(x => x.CreatedAt).FirstOrDefaultAsync(ct); }

    public async Task CreateChallengeAsync(OtpChallenge challenge, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct); var now = DateTimeOffset.UtcNow;
        await db.OtpChallenges.Where(x => x.AdminUserId == challenge.AdminUserId && x.ConsumedAt == null && x.LockedAt == null).ExecuteUpdateAsync(update => update.SetProperty(x => x.LockedAt, now), ct);
        db.OtpChallenges.Add(challenge); Audit(challenge.AdminUserId, challenge.Id, "OtpRequested", challenge.IpAddress); await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
    }

    public Task<OtpChallenge?> GetChallengeAsync(Guid id, CancellationToken ct) => db.OtpChallenges.Include(x => x.AdminUser).ThenInclude(x => x.UserRoles).ThenInclude(x => x.Role).SingleOrDefaultAsync(x => x.Id == id, ct);
    public async Task<bool> SaveFailedAttemptAsync(OtpChallenge challenge, AuthRequestContext context, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow; db.Entry(challenge).State = EntityState.Detached;
        await db.OtpChallenges.Where(x => x.Id == challenge.Id && x.ConsumedAt == null && x.LockedAt == null && x.Attempts < x.MaxAttempts).ExecuteUpdateAsync(update => update.SetProperty(x => x.Attempts, x => x.Attempts + 1).SetProperty(x => x.LockedAt, x => x.Attempts + 1 >= x.MaxAttempts ? now : x.LockedAt), ct);
        var state = await db.OtpChallenges.AsNoTracking().Where(x => x.Id == challenge.Id).Select(x => new { x.Attempts, x.LockedAt }).SingleAsync(ct); challenge.Attempts = state.Attempts; challenge.LockedAt = state.LockedAt; Audit(challenge.AdminUserId, challenge.Id, "LoginFailed", context.IpAddress); await db.SaveChangesAsync(ct); return state.LockedAt.HasValue || state.Attempts >= challenge.MaxAttempts;
    }

    public async Task CreateSessionAsync(OtpChallenge challenge, AdminSession session, int maximumActiveSessions, AuthRequestContext context, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct); var now = DateTimeOffset.UtcNow; challenge.ConsumedAt = now; challenge.AdminUser.LastLoginAt = now; challenge.AdminUser.UpdatedAt = now;
        var active = await db.AdminSessions.Where(x => x.AdminUserId == challenge.AdminUserId && x.RevokedAt == null && x.ExpiresAt > now).OrderByDescending(x => x.CreatedAt).ToListAsync(ct);
        foreach (var old in active.Skip(Math.Max(0, maximumActiveSessions - 1))) { old.RevokedAt = now; Audit(old.AdminUserId, old.Id, "SessionRevoked", context.IpAddress); }
        db.AdminSessions.Add(session); Audit(challenge.AdminUserId, session.Id, "LoginSucceeded", context.IpAddress); await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
    }

    public Task<AdminSession?> GetActiveSessionAsync(string hash, CancellationToken ct) => db.AdminSessions.Include(x => x.AdminUser).ThenInclude(x => x.UserRoles).ThenInclude(x => x.Role).SingleOrDefaultAsync(x => x.TokenHash == hash && x.RevokedAt == null, ct);
    public async Task RevokeSessionAsync(Guid id, AuthRequestContext context, CancellationToken ct) { var session = await db.AdminSessions.SingleOrDefaultAsync(x => x.Id == id, ct); if (session is null || session.RevokedAt.HasValue) return; session.RevokedAt = DateTimeOffset.UtcNow; Audit(session.AdminUserId, session.Id, "Logout", context.IpAddress); await db.SaveChangesAsync(ct); }

    public async Task<Result<Guid>> BootstrapAdminAsync(string email, string name, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(email) || !email.Contains('@')) return Result<Guid>.Failure(Errors.Validation("A valid email and display name are required.", new Dictionary<string, string[]>()));
        await using var tx = await db.Database.BeginTransactionAsync(ct); var role = await db.Roles.SingleOrDefaultAsync(x => x.Name == "Admin", ct); if (role is null) return Result<Guid>.Failure(Errors.NotFound("admin_role_missing", "The Admin role has not been seeded."));
        var user = await db.AdminUsers.Include(x => x.UserRoles).SingleOrDefaultAsync(x => x.Email != null && x.Email.ToLower() == email, ct); var now = DateTimeOffset.UtcNow;
        if (user is null) { user = new AdminUser { Id = Guid.NewGuid(), Email = email, DisplayName = name, Status = AdminUserStatus.Active, CreatedAt = now, UpdatedAt = now }; db.AdminUsers.Add(user); }
        else { user.Email = email; user.DisplayName = name; user.Status = AdminUserStatus.Active; user.UpdatedAt = now; }
        if (!user.UserRoles.Any(x => x.RoleId == role.Id)) user.UserRoles.Add(new AdminUserRole { RoleId = role.Id });
        db.AuditLog.Add(new AuditEntry { Id = Guid.NewGuid(), AdminUserId = user.Id, EntityType = "AdminUser", EntityId = user.Id, Action = "AdminBootstrapped", CreatedAt = now }); await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); return Result<Guid>.Success(user.Id);
    }

    private void Audit(Guid userId, Guid entityId, string action, string? ip) => db.AuditLog.Add(new AuditEntry { Id = Guid.NewGuid(), AdminUserId = userId, EntityType = action.StartsWith("Otp") || action.StartsWith("Login") ? "Authentication" : "AdminSession", EntityId = entityId, Action = action, CreatedAt = DateTimeOffset.UtcNow, IpAddress = ip });
}
