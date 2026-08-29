using APX.Application.AdminUsers;
using APX.Application.Catalog;
using APX.Application.Common;

namespace APX.Tests;

public sealed class AdminUserManagementServiceTests
{
    [Fact] public async Task Create_normalizes_email_and_reports_invitation_result() { var repo = new FakeRepository(); var service = new AdminUserManagementService(repo, new FakeInvitation(false)); var result = await service.CreateAsync(new(" Ada ", " ADA@Example.COM ", "editor"), Guid.NewGuid(), default); Assert.True(result.Succeeded); Assert.Equal("ada@example.com", repo.Created!.Email); Assert.Equal("Editor", repo.Created.Role); Assert.False(result.Value!.InvitationSent); }
    [Fact] public async Task Create_rejects_unknown_role() { var result = await new AdminUserManagementService(new FakeRepository(), new FakeInvitation()).CreateAsync(new("Ada", "ada@example.com", "Owner"), Guid.NewGuid(), default); Assert.False(result.Succeeded); Assert.Contains("role", result.Error!.Errors!); }
    [Fact] public async Task Create_rejects_case_insensitive_duplicate() { var repo = new FakeRepository { Duplicate = true }; var result = await new AdminUserManagementService(repo, new FakeInvitation()).CreateAsync(new("Ada", "ADA@example.com", "Viewer"), Guid.NewGuid(), default); Assert.False(result.Succeeded); Assert.Equal("admin_email_conflict", result.Error!.Code); }
    [Fact] public async Task Self_demotion_and_self_disable_are_blocked() { var id = Guid.NewGuid(); var service = new AdminUserManagementService(new FakeRepository(), new FakeInvitation()); var demotion = await service.UpdateAsync(id, new("Admin", "Viewer", "1"), id, default); var disabled = await service.DisableAsync(id, new("1"), id, default); Assert.Equal("cannot_modify_own_access", demotion.Error!.Code); Assert.Equal("cannot_modify_own_access", disabled.Error!.Code); }

    private sealed class FakeInvitation(bool sent = true) : IAdminInvitationSender { public Task<bool> SendAsync(AdminUserDetailDto user, CancellationToken ct) => Task.FromResult(sent); }
    private sealed class FakeRepository : IAdminUserManagementRepository
    {
        public bool Duplicate { get; init; } public CreateAdminUserDto? Created { get; private set; }
        public Task<PagedResult<AdminUserListDto>> GetAsync(AdminUserListQuery query, CancellationToken ct) => Task.FromResult(new PagedResult<AdminUserListDto>([],1,20,0,0));
        public Task<AdminUserDetailDto?> GetByIdAsync(Guid id, CancellationToken ct) => Task.FromResult<AdminUserDetailDto?>(null);
        public Task<bool> EmailExistsAsync(string email, CancellationToken ct) => Task.FromResult(Duplicate);
        public Task<Result<AdminUserDetailDto>> CreateAsync(CreateAdminUserDto request, Guid actorId, CancellationToken ct) { Created=request; return Task.FromResult(Result<AdminUserDetailDto>.Success(new(Guid.NewGuid(),request.DisplayName,request.Email,"Active",[request.Role],DateTimeOffset.UtcNow,DateTimeOffset.UtcNow,null,0,"1"))); }
        public Task<Result<AdminUserDetailDto>> UpdateAsync(Guid id, UpdateAdminUserDto request, Guid actorId, CancellationToken ct) => throw new NotImplementedException();
        public Task<Result<AdminUserDetailDto>> SetActiveAsync(Guid id, bool active, string rowVersion, Guid actorId, CancellationToken ct) => throw new NotImplementedException();
    }
}
