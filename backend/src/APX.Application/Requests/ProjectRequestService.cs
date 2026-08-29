using System.Net.Mail;
using APX.Application.Catalog;
using APX.Application.Common;
namespace APX.Application.Requests;
public sealed class ProjectRequestService(IProjectRequestRepository repository, IProjectRequestNotifier notifier, ProjectRequestOptions options)
{
    public async Task<Result<ProjectRequestCreatedDto>> CreateAsync(CreateProjectRequestDto request, CancellationToken ct)
    {
        var errors = Validate(request, options);
        if (errors.Count > 0) return Result<ProjectRequestCreatedDto>.Failure(Errors.Validation("Review the project request fields.", errors));
        var normalized = request with { Name = request.Name.Trim(), Company = NullIfBlank(request.Company), Email = request.Email.Trim().ToLowerInvariant(), Phone = request.Phone.Trim(), City = request.City.Trim(), Message = NullIfBlank(request.Message), Website = null, Items = request.Items!.DistinctBy(x => x.SolutionId).ToArray() };
        var result = await repository.CreateAsync(normalized, options, ct);
        if (result.Succeeded) { var notification = await repository.GetNotificationAsync(result.Value!.Id, ct); if (notification is not null) await notifier.NotifyCreatedAsync(notification, ct); }
        return result;
    }
    public Task<Result<PagedResult<AdminProjectRequestListDto>>> GetAsync(AdminProjectRequestQuery query, CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>(); if (query.Page < 1) errors["page"] = ["Must be at least 1."]; if (query.PageSize is < 1 or > 100) errors["pageSize"] = ["Must be between 1 and 100."]; if (query.Sort is not ("newest" or "oldest")) errors["sort"] = ["Must be newest or oldest."];
        if (errors.Count > 0) return Task.FromResult(Result<PagedResult<AdminProjectRequestListDto>>.Failure(Errors.Validation("Invalid query.", errors)));
        return GetPage(query, ct);
    }
    private async Task<Result<PagedResult<AdminProjectRequestListDto>>> GetPage(AdminProjectRequestQuery q, CancellationToken ct) => Result<PagedResult<AdminProjectRequestListDto>>.Success(await repository.GetAsync(q, ct));
    public async Task<Result<AdminProjectRequestDetailDto>> GetByIdAsync(Guid id, CancellationToken ct) { var value = await repository.GetByIdAsync(id, ct); return value is null ? Result<AdminProjectRequestDetailDto>.Failure(Errors.NotFound("project_request_not_found", "Project request was not found.")) : Result<AdminProjectRequestDetailDto>.Success(value); }
    public Task<Result<AdminProjectRequestDetailDto>> UpdateStatusAsync(Guid id, UpdateProjectRequestStatusDto request, Guid adminUserId, CancellationToken ct)
    {
        if (!Enum.TryParse<Domain.Requests.ProjectRequestStatus>(request.Status, true, out _) || string.IsNullOrWhiteSpace(request.RowVersion)) return Task.FromResult(Result<AdminProjectRequestDetailDto>.Failure(Errors.Validation("Invalid status update.", new Dictionary<string, string[]> { ["status"] = ["Use a valid status."], ["rowVersion"] = ["Row version is required."] })));
        return repository.UpdateStatusAsync(id, request, adminUserId, ct);
    }
    private static Dictionary<string, string[]> Validate(CreateProjectRequestDto r, ProjectRequestOptions o)
    {
        var e = new Dictionary<string, string[]>(); Required(e, "name", r.Name, 150); Optional(e, "company", r.Company, 200); Required(e, "email", r.Email, 320); Required(e, "phone", r.Phone, 50); Required(e, "city", r.City, 120); Optional(e, "message", r.Message, 3000);
        try { _ = new MailAddress(r.Email.Trim()); } catch { e["email"] = ["Enter a valid email address."]; }
        if (r.Attendees.HasValue && r.Attendees <= 0) e["attendees"] = ["Must be greater than zero."]; if (!r.AcceptedPrivacy) e["acceptedPrivacy"] = ["Privacy acceptance is required."]; if (r.PrivacyPolicyVersion != o.PrivacyPolicyVersion) e["privacyPolicyVersion"] = ["The privacy policy version is not current."];
        var count = r.Items?.Select(x => x.SolutionId).Distinct().Count() ?? 0; if (count < 1) e["items"] = ["Select at least one solution."]; else if (count > o.MaxItems) e["items"] = [$"Select no more than {o.MaxItems} solutions."]; if (!string.IsNullOrWhiteSpace(r.Website)) e["website"] = ["Request could not be accepted."];
        return e;
    }
    private static void Required(Dictionary<string,string[]> e, string key, string? value, int max) { if (string.IsNullOrWhiteSpace(value)) e[key] = ["Required."]; else if (value.Trim().Length > max) e[key] = [$"Maximum length is {max}."]; }
    private static void Optional(Dictionary<string,string[]> e, string key, string? value, int max) { if (value?.Trim().Length > max) e[key] = [$"Maximum length is {max}."]; }
    private static string? NullIfBlank(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
