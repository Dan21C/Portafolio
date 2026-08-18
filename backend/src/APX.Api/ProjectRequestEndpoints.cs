using System.Security.Claims;
using APX.Application.Requests;
using Microsoft.AspNetCore.Mvc;
namespace APX.Api;
internal static class ProjectRequestEndpoints
{
    public static IEndpointRouteBuilder MapProjectRequestApi(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/v1/project-requests", async (CreateProjectRequestDto request, ProjectRequestService service, CancellationToken ct) => (await service.CreateAsync(request, ct)).ToHttp(value => Results.Created($"/api/v1/project-requests/{value.Id}", value))).WithMetadata(new RequestSizeLimitAttribute(64 * 1024)).RequireRateLimiting("project-requests").Produces<ProjectRequestCreatedDto>(201).ProducesProblem(400).ProducesProblem(429);
        var admin = endpoints.MapGroup("/api/v1/admin/project-requests").RequireAuthorization(AdminAuth.ProjectRequestRead).WithTags("Admin Project Requests");
        admin.MapGet("/", async ([AsParameters] AdminProjectRequestQuery query, ProjectRequestService service, CancellationToken ct) => (await service.GetAsync(query, ct)).ToHttp());
        admin.MapGet("/{id:guid}", async (Guid id, ProjectRequestService service, CancellationToken ct) => (await service.GetByIdAsync(id, ct)).ToHttp()).ProducesProblem(404);
        admin.MapPut("/{id:guid}/status", async (Guid id, UpdateProjectRequestStatusDto request, ClaimsPrincipal user, ProjectRequestService service, CancellationToken ct) => Guid.TryParse(user.FindFirstValue(ClaimTypes.NameIdentifier), out var adminId) ? (await service.UpdateStatusAsync(id, request, adminId, ct)).ToHttp() : Results.Unauthorized()).RequireAuthorization(AdminAuth.ProjectRequestWrite).ProducesProblem(409);
        return endpoints;
    }
}
