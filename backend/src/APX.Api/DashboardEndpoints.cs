using APX.Application.Dashboard;
using Microsoft.AspNetCore.Mvc;
namespace APX.Api;
internal static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardApi(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/v1/admin/dashboard",async([AsParameters] DashboardQuery query,DashboardService service,CancellationToken ct)=>(await service.GetAsync(query,ct)).ToHttp()).RequireAuthorization(AdminAuth.Read).WithTags("Admin Dashboard").Produces<DashboardDto>().ProducesProblem(400).ProducesProblem(401).ProducesProblem(403);
        return endpoints;
    }
}
