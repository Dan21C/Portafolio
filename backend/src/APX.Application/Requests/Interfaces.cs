using APX.Application.Catalog;
using APX.Application.Common;
namespace APX.Application.Requests;
public interface IProjectRequestRepository
{
    Task<Result<ProjectRequestCreatedDto>> CreateAsync(CreateProjectRequestDto request, ProjectRequestOptions options, CancellationToken ct);
    Task<PagedResult<AdminProjectRequestListDto>> GetAsync(AdminProjectRequestQuery query, CancellationToken ct);
    Task<AdminProjectRequestDetailDto?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Result<AdminProjectRequestDetailDto>> UpdateStatusAsync(Guid id, UpdateProjectRequestStatusDto request, Guid adminUserId, CancellationToken ct);
}
