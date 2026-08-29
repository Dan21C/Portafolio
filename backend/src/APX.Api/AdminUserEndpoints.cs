using System.Security.Claims;
using APX.Application.AdminUsers;

namespace APX.Api;

internal static class AdminUserEndpoints
{
    public static IEndpointRouteBuilder MapAdminUserApi(this IEndpointRouteBuilder endpoints)
    {
        var users = endpoints.MapGroup("/api/v1/admin/users")
            .WithTags("Admin Users")
            .RequireAuthorization(AdminAuth.UserManagement);

        users.MapGet("/", async (string? search, string? role, string? status, int page, int pageSize, AdminUserManagementService service, CancellationToken ct) =>
            (await service.GetAsync(new(search, role, status, page == 0 ? 1 : page, pageSize == 0 ? 20 : pageSize), ct)).ToHttp());
        users.MapGet("/{id:guid}", async (Guid id, AdminUserManagementService service, CancellationToken ct) =>
            (await service.GetByIdAsync(id, ct)).ToHttp()).ProducesProblem(404);
        users.MapPost("/", async (CreateAdminUserDto request, ClaimsPrincipal principal, AdminUserManagementService service, CancellationToken ct) =>
            Actor(principal) is { } actor ? (await service.CreateAsync(request, actor, ct)).ToHttp(value => Results.Created($"/api/v1/admin/users/{value.User.Id}", value)) : Results.Unauthorized()).Produces<CreateAdminUserResultDto>(201).ProducesProblem(400).ProducesProblem(409);
        users.MapPut("/{id:guid}", async (Guid id, UpdateAdminUserDto request, ClaimsPrincipal principal, AdminUserManagementService service, CancellationToken ct) =>
            Actor(principal) is { } actor ? (await service.UpdateAsync(id, request, actor, ct)).ToHttp() : Results.Unauthorized()).ProducesProblem(409);
        users.MapPost("/{id:guid}/disable", async (Guid id, ChangeAdminUserStatusDto request, ClaimsPrincipal principal, AdminUserManagementService service, CancellationToken ct) =>
            Actor(principal) is { } actor ? (await service.DisableAsync(id, request, actor, ct)).ToHttp() : Results.Unauthorized()).ProducesProblem(409);
        users.MapPost("/{id:guid}/reactivate", async (Guid id, ChangeAdminUserStatusDto request, ClaimsPrincipal principal, AdminUserManagementService service, CancellationToken ct) =>
            Actor(principal) is { } actor ? (await service.ReactivateAsync(id, request, actor, ct)).ToHttp() : Results.Unauthorized()).ProducesProblem(409);
        users.MapPost("/{id:guid}/resend-invitation", async (Guid id, AdminUserManagementService service, CancellationToken ct) =>
            (await service.ResendInvitationAsync(id, ct)).ToHttp()).ProducesProblem(404).ProducesProblem(409);
        return endpoints;
    }

    private static Guid? Actor(ClaimsPrincipal principal) => Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;
}
