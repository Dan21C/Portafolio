using System.Text.Json;
using APX.Application.Catalog;
using APX.Application.Common;
using APX.Application.Requests;
using APX.Domain.Admin;
using APX.Domain.Catalog;
using APX.Domain.Requests;
using APX.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace APX.Infrastructure.Requests;
public sealed class EfProjectRequestRepository(ApxDbContext db) : IProjectRequestRepository
{
    public async Task<Result<ProjectRequestCreatedDto>> CreateAsync(CreateProjectRequestDto request, ProjectRequestOptions options, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var ids = request.Items!.Select(x => x.SolutionId).Distinct().ToArray();
        var solutions = await db.Solutions.AsNoTracking().Where(x => ids.Contains(x.Id) && x.Status == SolutionStatus.Published).Include(x => x.Category).ToListAsync(ct);
        if (solutions.Count != ids.Length)
        {
            var available = solutions.Select(x => x.Id).ToHashSet(); var missing = ids.Where(x => !available.Contains(x)).Select(x => x.ToString()).ToArray();
            return Result<ProjectRequestCreatedDto>.Failure(Errors.Validation("One or more selected solutions are no longer available.", new Dictionary<string, string[]> { ["items"] = missing.Select(x => $"Solution {x} is no longer available.").ToArray() }));
        }
        var sequence = await db.Database.SqlQueryRaw<long>("SELECT nextval('project_request_number_seq') AS \"Value\"").SingleAsync(ct);
        var now = DateTimeOffset.UtcNow; var entity = new ProjectRequest { Id = Guid.NewGuid(), RequestNumber = $"APX-{sequence:000000}", Name = request.Name, Company = request.Company, Email = request.Email, Phone = request.Phone, City = request.City, ApproximateDate = request.ApproximateDate, Attendees = request.Attendees, Message = request.Message, Status = ProjectRequestStatus.New, PrivacyAcceptedAt = now, PrivacyPolicyVersion = options.PrivacyPolicyVersion, PrivacyPolicyUrl = options.PrivacyPolicyUrl, CreatedAt = now, UpdatedAt = now };
        foreach (var solution in solutions) entity.Items.Add(new ProjectRequestItem { Id = Guid.NewGuid(), SolutionId = solution.Id, SolutionName = solution.Name, SolutionSlug = solution.Slug, CategoryName = solution.Category.Name, SolutionDescription = solution.ShortDescription });
        entity.StatusHistory.Add(new ProjectRequestStatusHistory { Id = Guid.NewGuid(), NewStatus = ProjectRequestStatus.New, CreatedAt = now });
        db.ProjectRequests.Add(entity); db.AuditLog.Add(new AuditEntry { Id = Guid.NewGuid(), EntityType = "ProjectRequest", EntityId = entity.Id, Action = "ProjectRequestCreated", AfterJson = JsonSerializer.Serialize(new { entity.RequestNumber, Status = entity.Status.ToString(), ItemCount = entity.Items.Count }), CreatedAt = now });
        await db.SaveChangesAsync(ct); await tx.CommitAsync(ct);
        return Result<ProjectRequestCreatedDto>.Success(new(entity.Id, entity.RequestNumber, entity.CreatedAt, entity.Status.ToString()));
    }
    public async Task<PagedResult<AdminProjectRequestListDto>> GetAsync(AdminProjectRequestQuery q, CancellationToken ct)
    {
        var query = db.ProjectRequests.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(q.Status) && Enum.TryParse<ProjectRequestStatus>(q.Status, true, out var status)) query = query.Where(x => x.Status == status);
        if (!string.IsNullOrWhiteSpace(q.Search)) { var p = $"%{q.Search.Trim()}%"; query = query.Where(x => EF.Functions.ILike(x.RequestNumber, p) || EF.Functions.ILike(x.Name, p) || (x.Company != null && EF.Functions.ILike(x.Company, p)) || EF.Functions.ILike(x.Email, p) || EF.Functions.ILike(x.Phone, p)); }
        if (!string.IsNullOrWhiteSpace(q.City)) { var p = $"%{q.City.Trim()}%"; query = query.Where(x => EF.Functions.ILike(x.City, p)); }
        if (q.DateFrom.HasValue) { var from = new DateTimeOffset(q.DateFrom.Value.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero); query = query.Where(x => x.CreatedAt >= from); }
        if (q.DateTo.HasValue) { var to = new DateTimeOffset(q.DateTo.Value.AddDays(1).ToDateTime(TimeOnly.MinValue), TimeSpan.Zero); query = query.Where(x => x.CreatedAt < to); }
        var total = await query.LongCountAsync(ct); query = q.Sort == "oldest" ? query.OrderBy(x => x.CreatedAt).ThenBy(x => x.Id) : query.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.Id);
        var items = await query.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).Select(x => new AdminProjectRequestListDto(x.Id, x.RequestNumber, x.Name, x.Company, x.Email, x.Phone, x.City, x.Status.ToString(), x.CreatedAt)).ToListAsync(ct);
        return new(items, q.Page, q.PageSize, total, (int)Math.Ceiling(total / (double)q.PageSize));
    }
    public async Task<AdminProjectRequestDetailDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var entity = await db.ProjectRequests.AsNoTracking().Include(x => x.Items).Include(x => x.StatusHistory).AsSplitQuery().SingleOrDefaultAsync(x => x.Id == id, ct); return entity is null ? null : ToDetail(entity);
    }
    public async Task<Result<AdminProjectRequestDetailDto>> UpdateStatusAsync(Guid id, UpdateProjectRequestStatusDto request, Guid adminUserId, CancellationToken ct)
    {
        var entity = await db.ProjectRequests.SingleOrDefaultAsync(x => x.Id == id, ct); if (entity is null) return Result<AdminProjectRequestDetailDto>.Failure(Errors.NotFound("project_request_not_found", "Project request was not found."));
        if (!uint.TryParse(request.RowVersion, out var version) || !Enum.TryParse<ProjectRequestStatus>(request.Status, true, out var next)) return Result<AdminProjectRequestDetailDto>.Failure(Errors.Validation("Invalid status update.", new Dictionary<string, string[]>()));
        db.Entry(entity).Property(x => x.Version).OriginalValue = version; var previous = entity.Status; var now = DateTimeOffset.UtcNow; entity.Status = next; entity.UpdatedAt = now;
        if (next == ProjectRequestStatus.Contacted) entity.LastContactedAt = now; if (next == ProjectRequestStatus.Qualified) entity.QualifiedAt = now; if (next == ProjectRequestStatus.Won) entity.WonAt = now; if (next == ProjectRequestStatus.Lost) entity.LostAt = now; if (next == ProjectRequestStatus.Archived) entity.ArchivedAt = now;
        db.ProjectRequestStatusHistory.Add(new ProjectRequestStatusHistory { Id = Guid.NewGuid(), ProjectRequestId = id, PreviousStatus = previous, NewStatus = next, ChangedByAdminUserId = adminUserId, CreatedAt = now });
        db.AuditLog.Add(new AuditEntry { Id = Guid.NewGuid(), AdminUserId = adminUserId, EntityType = "ProjectRequest", EntityId = id, Action = next == ProjectRequestStatus.Archived ? "ProjectRequestArchived" : "ProjectRequestStatusChanged", BeforeJson = JsonSerializer.Serialize(new { Status = previous.ToString() }), AfterJson = JsonSerializer.Serialize(new { Status = next.ToString() }), CreatedAt = now });
        try { await db.SaveChangesAsync(ct); } catch (DbUpdateConcurrencyException) { return Result<AdminProjectRequestDetailDto>.Failure(Errors.Concurrency("The project request was updated from another session.")); }
        return Result<AdminProjectRequestDetailDto>.Success((await GetByIdAsync(id, ct))!);
    }
    private static AdminProjectRequestDetailDto ToDetail(ProjectRequest x) => new(x.Id, x.RequestNumber, x.Name, x.Company, x.Email, x.Phone, x.City, x.ApproximateDate, x.Attendees, x.Message, x.Status.ToString(), x.PrivacyAcceptedAt, x.PrivacyPolicyVersion, x.PrivacyPolicyUrl, x.CreatedAt, x.UpdatedAt, x.LastContactedAt, x.QualifiedAt, x.WonAt, x.LostAt, x.ArchivedAt, x.Items.Select(i => new ProjectRequestItemDto(i.SolutionId, i.SolutionName, i.SolutionSlug, i.CategoryName, i.SolutionDescription)).ToList(), x.StatusHistory.OrderBy(h => h.CreatedAt).Select(h => new ProjectRequestHistoryDto(h.Id, h.PreviousStatus?.ToString(), h.NewStatus.ToString(), h.ChangedByAdminUserId, h.CreatedAt)).ToList(), x.Version.ToString());
}
