namespace APX.Application.Authentication;

public sealed record RequestOtpDto(string Channel, string Destination);
public sealed record OtpChallengeDto(Guid ChallengeId, DateTimeOffset ExpiresAt, string MaskedDestination);
public sealed record VerifyOtpDto(Guid ChallengeId, string Code);
public sealed record AuthSessionDto(bool Authenticated, Guid UserId, string DisplayName, string? Email, IReadOnlyList<string> Roles, IReadOnlyList<string> Permissions, DateTimeOffset ExpiresAt);
public sealed record AuthOptions(int OtpLifetimeMinutes = 5, int OtpMaxAttempts = 5, int OtpCooldownSeconds = 60, int SessionLifetimeHours = 8, int MaxSessionsPerUser = 5, string CookieName = "apx_admin_session", string OtpPepper = "", bool EnableDevelopmentOtpDisclosure = false);
public sealed record AuthRequestContext(string? IpAddress, string? UserAgent);
public sealed record CreatedAdminSession(string Token, AuthSessionDto Session);

public static class AdminPermissions
{
    public const string Read = "admin.read"; public const string ContentWrite = "content.write"; public const string Publish = "content.publish"; public const string Delete = "content.delete"; public const string CategoryManage = "category.manage"; public const string MediaWrite = "media.write"; public const string UserManage = "users.manage"; public const string ProjectRequestRead = "project-request.read"; public const string ProjectRequestWrite = "project-request.write";
    public static IReadOnlyList<string> ForRoles(IEnumerable<string> roles)
    {
        var set = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { Read, ProjectRequestRead };
        foreach (var role in roles)
        {
            if (role.Equals("Admin", StringComparison.OrdinalIgnoreCase)) set.UnionWith([ContentWrite, Publish, Delete, CategoryManage, MediaWrite, UserManage, ProjectRequestWrite]);
            else if (role.Equals("Editor", StringComparison.OrdinalIgnoreCase)) set.UnionWith([ContentWrite, Publish, MediaWrite, ProjectRequestWrite]);
        }
        return set.Order(StringComparer.Ordinal).ToArray();
    }
}
