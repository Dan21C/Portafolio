using APX.Application.Catalog;
using APX.Application.Common;
using APX.Application.Requests;
namespace APX.Tests;
public sealed class ProjectRequestServiceTests
{
    private static readonly Guid SolutionId = Guid.NewGuid();
    [Fact] public async Task Valid_request_is_normalized_and_created() { var repo = new FakeRepository(); var result = await Service(repo).CreateAsync(Valid() with { Email = " USER@Example.COM ", Items = [new(SolutionId), new(SolutionId)] }, default); Assert.True(result.Succeeded); Assert.Equal("user@example.com", repo.Created!.Email); Assert.Single(repo.Created.Items!); }
    [Fact] public async Task Request_requires_items() { var result = await Service().CreateAsync(Valid() with { Items = [] }, default); Assert.False(result.Succeeded); Assert.Contains("items", result.Error!.Errors!); }
    [Fact] public async Task Request_rejects_privacy_false() { var result = await Service().CreateAsync(Valid() with { AcceptedPrivacy = false }, default); Assert.False(result.Succeeded); Assert.Contains("acceptedPrivacy", result.Error!.Errors!); }
    [Fact] public async Task Request_rejects_invalid_email() { var result = await Service().CreateAsync(Valid() with { Email = "not-an-email" }, default); Assert.False(result.Succeeded); Assert.Contains("email", result.Error!.Errors!); }
    [Fact] public async Task Request_rejects_non_positive_attendees() { var result = await Service().CreateAsync(Valid() with { Attendees = 0 }, default); Assert.False(result.Succeeded); Assert.Contains("attendees", result.Error!.Errors!); }
    [Fact] public async Task Request_rejects_honeypot() { var result = await Service().CreateAsync(Valid() with { Website = "spam.example" }, default); Assert.False(result.Succeeded); Assert.Contains("website", result.Error!.Errors!); }
    [Fact] public async Task Status_rejects_invalid_value() { var result = await Service().UpdateStatusAsync(Guid.NewGuid(), new("Unknown", "1"), Guid.NewGuid(), default); Assert.False(result.Succeeded); }
    private static ProjectRequestService Service(FakeRepository? repo = null) => new(repo ?? new(), new(20, "2026-08"));
    private static CreateProjectRequestDto Valid() => new("Ada", null, "ada@example.com", "+57 300 000 0000", "Bogotá", null, 10, null, true, "2026-08", [new(SolutionId)]);
    private sealed class FakeRepository : IProjectRequestRepository
    {
        public CreateProjectRequestDto? Created { get; private set; }
        public Task<Result<ProjectRequestCreatedDto>> CreateAsync(CreateProjectRequestDto request, ProjectRequestOptions options, CancellationToken ct) { Created = request; return Task.FromResult(Result<ProjectRequestCreatedDto>.Success(new(Guid.NewGuid(), "APX-000001", DateTimeOffset.UtcNow, "New"))); }
        public Task<PagedResult<AdminProjectRequestListDto>> GetAsync(AdminProjectRequestQuery query, CancellationToken ct) => Task.FromResult(new PagedResult<AdminProjectRequestListDto>([], 1, 20, 0, 0));
        public Task<AdminProjectRequestDetailDto?> GetByIdAsync(Guid id, CancellationToken ct) => Task.FromResult<AdminProjectRequestDetailDto?>(null);
        public Task<Result<AdminProjectRequestDetailDto>> UpdateStatusAsync(Guid id, UpdateProjectRequestStatusDto request, Guid adminUserId, CancellationToken ct) => throw new NotImplementedException();
    }
}
