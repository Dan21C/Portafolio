using System.Net;
using System.Net.Http.Json;
using APX.Application.Authentication;
using APX.Application.Catalog;
using APX.Application.Common;
using APX.Domain.Admin;
using APX.Application.AdminUsers;
using APX.Application.Dashboard;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace APX.Tests;

public sealed class AuthHttpTests
{
    [Fact]
    public async Task OtpCookieMeAdminAndLogout_FlowIsProtected()
    {
        await using var factory = new AuthApiFactory(); using var client = factory.CreateClient(new() { HandleCookies = true, AllowAutoRedirect = false });
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/admin/solutions")).StatusCode);
        var request = await client.PostAsJsonAsync("/api/v1/auth/otp/request", new { channel = "email", destination = factory.Auth.User.Email }); Assert.True(request.StatusCode == HttpStatusCode.Accepted, await request.Content.ReadAsStringAsync());
        var challenge = await request.Content.ReadFromJsonAsync<OtpChallengeDto>(); Assert.NotNull(challenge); Assert.DoesNotContain(factory.Auth.User.Email!, await request.Content.ReadAsStringAsync());
        var verify = await client.PostAsJsonAsync("/api/v1/auth/otp/verify", new { challengeId = challenge.ChallengeId, code = factory.Email.Code }); Assert.Equal(HttpStatusCode.OK, verify.StatusCode); Assert.Contains("httponly", verify.Headers.GetValues("Set-Cookie").Single(), StringComparison.OrdinalIgnoreCase);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/auth/me")).StatusCode); Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/admin/solutions")).StatusCode);
        using var logout = new HttpRequestMessage(HttpMethod.Post, "/api/v1/auth/logout"); logout.Headers.Add("Origin", "http://localhost:5174"); Assert.Equal(HttpStatusCode.NoContent, (await client.SendAsync(logout)).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/auth/me")).StatusCode);
    }

    [Theory] [InlineData("Admin", HttpStatusCode.NoContent)] [InlineData("Editor", HttpStatusCode.Forbidden)] [InlineData("Viewer", HttpStatusCode.Forbidden)]
    public async Task DestructiveEndpoint_IsReservedForAdmin(string role, HttpStatusCode expected)
    {
        await using var factory = new AuthApiFactory(role); using var client = factory.CreateClient(new() { HandleCookies = true });
        var requested = await (await client.PostAsJsonAsync("/api/v1/auth/otp/request", new { channel = "email", destination = factory.Auth.User.Email })).Content.ReadFromJsonAsync<OtpChallengeDto>();
        await client.PostAsJsonAsync("/api/v1/auth/otp/verify", new { challengeId = requested!.ChallengeId, code = factory.Email.Code });
        using var delete = new HttpRequestMessage(HttpMethod.Delete, $"/api/v1/admin/solutions/{Guid.NewGuid()}"); delete.Headers.Add("Origin", "http://localhost:5174");
        Assert.Equal(expected, (await client.SendAsync(delete)).StatusCode);
    }

    [Theory] [InlineData("Admin", HttpStatusCode.OK)] [InlineData("Editor", HttpStatusCode.Forbidden)] [InlineData("Viewer", HttpStatusCode.Forbidden)]
    public async Task UserManagementEndpoint_RequiresUsersManagePermission(string role, HttpStatusCode expected)
    {
        await using var factory = new AuthApiFactory(role); using var client = factory.CreateClient(new() { HandleCookies = true });
        var requested = await (await client.PostAsJsonAsync("/api/v1/auth/otp/request", new { channel = "email", destination = factory.Auth.User.Email })).Content.ReadFromJsonAsync<OtpChallengeDto>();
        await client.PostAsJsonAsync("/api/v1/auth/otp/verify", new { challengeId = requested!.ChallengeId, code = factory.Email.Code });
        Assert.Equal(expected, (await client.GetAsync("/api/v1/admin/users?page=1&pageSize=20")).StatusCode);
    }

    [Theory] [InlineData("Admin")] [InlineData("Editor")] [InlineData("Viewer")]
    public async Task Dashboard_is_readable_by_every_authenticated_role(string role)
    {
        await using var factory=new AuthApiFactory(role);using var client=factory.CreateClient(new(){HandleCookies=true});Assert.Equal(HttpStatusCode.Unauthorized,(await client.GetAsync("/api/v1/admin/dashboard")).StatusCode);var requested=await(await client.PostAsJsonAsync("/api/v1/auth/otp/request",new{channel="email",destination=factory.Auth.User.Email})).Content.ReadFromJsonAsync<OtpChallengeDto>();await client.PostAsJsonAsync("/api/v1/auth/otp/verify",new{challengeId=requested!.ChallengeId,code=factory.Email.Code});Assert.Equal(HttpStatusCode.OK,(await client.GetAsync("/api/v1/admin/dashboard")).StatusCode);Assert.Equal(HttpStatusCode.BadRequest,(await client.GetAsync("/api/v1/admin/dashboard?dateFrom=2026-08-18T00:00:00Z&dateTo=2026-08-17T00:00:00Z")).StatusCode);
    }

    private sealed class AuthApiFactory : WebApplicationFactory<Program>
    {
        public FakeAuthRepository Auth { get; } = new(); public CapturingEmailSender Email { get; } = new();
        public AuthApiFactory(string role = "Admin") => Auth.User.UserRoles.Single().Role.Name = role;
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Development"); builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?> { ["Auth:OtpPepper"] = "http-test-pepper-with-at-least-32-characters", ["Cors:AllowedOrigins:0"] = "http://localhost:5174", ["Database:InitializeOnStartup"] = "false" }));
            builder.ConfigureTestServices(services => { services.RemoveAll<IAuthRepository>(); services.RemoveAll<IEmailSender>(); services.RemoveAll<ICatalogRepository>(); services.RemoveAll<IAdminUserManagementRepository>(); services.RemoveAll<IDashboardRepository>(); services.RemoveAll<AuthOptions>(); services.AddSingleton(new AuthOptions(OtpPepper: "http-test-pepper-with-at-least-32-characters")); services.AddSingleton<IAuthRepository>(Auth); services.AddSingleton<IEmailSender>(Email); services.AddSingleton<ICatalogRepository, EmptyCatalogRepository>(); services.AddSingleton<IAdminUserManagementRepository, EmptyAdminUserRepository>(); services.AddSingleton<IDashboardRepository, EmptyDashboardRepository>(); });
        }
    }

    private sealed class CapturingEmailSender : IEmailSender { public string? Code { get; private set; } public Task SendOtpAsync(Guid challengeId, string email, string code, DateTimeOffset expiresAt, CancellationToken ct) { Code = code; return Task.CompletedTask; } }
    private sealed class FakeAuthRepository : IAuthRepository
    {
        public AdminUser User { get; } = new() { Id = Guid.NewGuid(), Email = "http-admin@example.test", DisplayName = "HTTP Admin", Status = AdminUserStatus.Active }; private OtpChallenge? challenge; private AdminSession? session;
        public FakeAuthRepository() => User.UserRoles.Add(new AdminUserRole { RoleId = Guid.NewGuid(), Role = new Role { Name = "Admin" } });
        public Task<AdminUser?> FindActiveUserByEmailAsync(string email, CancellationToken ct) => Task.FromResult<AdminUser?>(email == User.Email ? User : null);
        public Task<OtpChallenge?> GetLatestOpenChallengeAsync(Guid id, CancellationToken ct) => Task.FromResult(challenge);
        public Task CreateChallengeAsync(OtpChallenge value, CancellationToken ct) { challenge = value; value.AdminUser = User; return Task.CompletedTask; }
        public Task InvalidateChallengeAsync(Guid id, CancellationToken ct) { if (challenge?.Id == id) challenge.LockedAt = DateTimeOffset.UtcNow; return Task.CompletedTask; }
        public Task<OtpChallenge?> GetChallengeAsync(Guid id, CancellationToken ct) => Task.FromResult(challenge?.Id == id ? challenge : null);
        public Task<bool> SaveFailedAttemptAsync(OtpChallenge value, AuthRequestContext context, CancellationToken ct) { value.Attempts++; return Task.FromResult(value.Attempts >= value.MaxAttempts); }
        public Task CreateSessionAsync(OtpChallenge value, AdminSession created, int max, AuthRequestContext context, CancellationToken ct) { value.ConsumedAt = DateTimeOffset.UtcNow; created.AdminUser = User; session = created; return Task.CompletedTask; }
        public Task<AdminSession?> GetActiveSessionAsync(string hash, CancellationToken ct) => Task.FromResult(session?.TokenHash == hash && session.RevokedAt is null ? session : null);
        public Task RevokeSessionAsync(Guid id, AuthRequestContext context, CancellationToken ct) { if (session?.Id == id) session.RevokedAt = DateTimeOffset.UtcNow; return Task.CompletedTask; }
        public Task<Result<Guid>> BootstrapAdminAsync(string email, string name, CancellationToken ct) => Task.FromResult(Result<Guid>.Success(User.Id));
    }

    private sealed class EmptyCatalogRepository : ICatalogRepository
    {
        public Task<PagedResult<AdminSolutionListDto>> GetAdminSolutionsAsync(AdminSolutionQuery q, CancellationToken ct) => Task.FromResult(new PagedResult<AdminSolutionListDto>([], q.Page, q.PageSize, 0, 0));
        public Task<AdminSolutionDetailDto?> GetAdminSolutionAsync(Guid id, CancellationToken ct) => Task.FromResult<AdminSolutionDetailDto?>(null); public Task<IReadOnlyList<AdminCategoryDto>> GetAdminCategoriesAsync(CancellationToken ct) => Task.FromResult<IReadOnlyList<AdminCategoryDto>>([]);
        public Task<IReadOnlyList<CategoryListDto>> GetPublicCategoriesAsync(CancellationToken ct) => Task.FromResult<IReadOnlyList<CategoryListDto>>([]); public Task<CategoryDetailDto?> GetPublicCategoryAsync(string slug, CancellationToken ct) => Task.FromResult<CategoryDetailDto?>(null); public Task<PagedResult<SolutionCardDto>> GetPublicSolutionsAsync(PublicSolutionQuery q, CancellationToken ct) => Task.FromResult(new PagedResult<SolutionCardDto>([], q.Page, q.PageSize, 0, 0)); public Task<SolutionDetailDto?> GetPublicSolutionAsync(string slug, CancellationToken ct) => Task.FromResult<SolutionDetailDto?>(null); public Task<IReadOnlyList<SolutionCardDto>> GetFeaturedAsync(int limit, CancellationToken ct) => Task.FromResult<IReadOnlyList<SolutionCardDto>>([]);
        public Task<bool> CategoryExistsAsync(Guid id, CancellationToken ct) => Task.FromResult(true); public Task<bool> SolutionSlugExistsAsync(string slug, Guid? id, CancellationToken ct) => Task.FromResult(false); public Task<bool> CategorySlugExistsAsync(string slug, Guid? id, CancellationToken ct) => Task.FromResult(false);
        public Task<Result<AdminSolutionDetailDto>> CreateSolutionAsync(CreateSolutionRequest r, CancellationToken ct) => throw new NotSupportedException(); public Task<Result<AdminSolutionDetailDto>> UpdateSolutionAsync(Guid id, UpdateSolutionRequest r, CancellationToken ct) => throw new NotSupportedException(); public Task<Result> DeleteSolutionAsync(Guid id, CancellationToken ct) => Task.FromResult(Result.Success()); public Task<Result<AdminSolutionDetailDto>> DuplicateSolutionAsync(Guid id, DuplicateSolutionRequest r, CancellationToken ct) => throw new NotSupportedException(); public Task<Result<AdminSolutionDetailDto>> SetPublishedAsync(Guid id, bool p, CancellationToken ct) => throw new NotSupportedException(); public Task<Result<AdminCategoryDto>> CreateCategoryAsync(CreateCategoryRequest r, CancellationToken ct) => throw new NotSupportedException(); public Task<Result<AdminCategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest r, CancellationToken ct) => throw new NotSupportedException(); public Task<Result> DeleteCategoryAsync(Guid id, CancellationToken ct) => Task.FromResult(Result.Success()); public Task<Result> ReorderCategoriesAsync(ReorderCategoriesRequest r, CancellationToken ct) => Task.FromResult(Result.Success());
    }
    private sealed class EmptyAdminUserRepository : IAdminUserManagementRepository
    {
        public Task<PagedResult<AdminUserListDto>> GetAsync(AdminUserListQuery query, CancellationToken ct) => Task.FromResult(new PagedResult<AdminUserListDto>([],query.Page,query.PageSize,0,0));
        public Task<AdminUserDetailDto?> GetByIdAsync(Guid id, CancellationToken ct) => Task.FromResult<AdminUserDetailDto?>(null);
        public Task<bool> EmailExistsAsync(string email, CancellationToken ct) => Task.FromResult(false);
        public Task<Result<AdminUserDetailDto>> CreateAsync(CreateAdminUserDto request, Guid actorId, CancellationToken ct) => throw new NotSupportedException();
        public Task<Result<AdminUserDetailDto>> UpdateAsync(Guid id, UpdateAdminUserDto request, Guid actorId, CancellationToken ct) => throw new NotSupportedException();
        public Task<Result<AdminUserDetailDto>> SetActiveAsync(Guid id, bool active, string rowVersion, Guid actorId, CancellationToken ct) => throw new NotSupportedException();
    }
    private sealed class EmptyDashboardRepository:IDashboardRepository{public Task<DashboardDto> GetAsync(DateTimeOffset from,DateTimeOffset to,DateTimeOffset now,int attentionHours,CancellationToken ct)=>Task.FromResult(new DashboardDto(new(from,to,attentionHours),new(0,0,0,0,0,0,0,0),[],new(0,0,0),new(null,null),new(0,null),[],new(0,0,null,null),[],[],[],[],new(0,[])));}
}
