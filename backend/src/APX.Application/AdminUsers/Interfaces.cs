using APX.Application.Catalog;
using APX.Application.Common;
namespace APX.Application.AdminUsers;
public interface IAdminUserManagementRepository
{
    Task<PagedResult<AdminUserListDto>> GetAsync(AdminUserListQuery query, CancellationToken ct);
    Task<AdminUserDetailDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct);
    Task<Result<AdminUserDetailDto>> CreateAsync(CreateAdminUserDto request, Guid actorId, CancellationToken ct);
    Task<Result<AdminUserDetailDto>> UpdateAsync(Guid id, UpdateAdminUserDto request, Guid actorId, CancellationToken ct);
    Task<Result<AdminUserDetailDto>> SetActiveAsync(Guid id, bool active, string rowVersion, Guid actorId, CancellationToken ct);
}
public interface IAdminInvitationSender { Task<bool> SendAsync(AdminUserDetailDto user, CancellationToken ct); }
