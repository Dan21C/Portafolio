using APX.Application.Catalog;
namespace APX.Application.AdminUsers;
public sealed record AdminUserListQuery(string? Search, string? Role, string? Status, int Page = 1, int PageSize = 20);
public sealed record AdminUserListDto(Guid Id, string DisplayName, string Email, string Role, string Status, DateTimeOffset? LastLoginAt);
public sealed record AdminUserDetailDto(Guid Id, string DisplayName, string Email, string Status, IReadOnlyList<string> Roles, DateTimeOffset CreatedAt, DateTimeOffset UpdatedAt, DateTimeOffset? LastLoginAt, int ActiveSessionsCount, string RowVersion);
public sealed record CreateAdminUserDto(string DisplayName, string Email, string Role);
public sealed record CreateAdminUserResultDto(AdminUserDetailDto User, bool InvitationSent);
public sealed record UpdateAdminUserDto(string DisplayName, string Role, string RowVersion);
public sealed record ChangeAdminUserStatusDto(string RowVersion);
