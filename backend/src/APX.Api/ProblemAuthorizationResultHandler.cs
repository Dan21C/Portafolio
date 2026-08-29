using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;

namespace APX.Api;

internal sealed class ProblemAuthorizationResultHandler : IAuthorizationMiddlewareResultHandler
{
    private readonly AuthorizationMiddlewareResultHandler fallback = new();
    public async Task HandleAsync(RequestDelegate next, HttpContext context, AuthorizationPolicy policy, PolicyAuthorizationResult result)
    {
        if (!result.Forbidden) { await fallback.HandleAsync(next, context, policy, result); return; }
        context.Response.StatusCode = StatusCodes.Status403Forbidden; context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(new { type = "https://apx.local/problems/forbidden", title = "Forbidden", status = 403, detail = "The authenticated administrator does not have permission for this operation.", code = "forbidden", traceId = context.TraceIdentifier });
    }
}
