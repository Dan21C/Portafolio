namespace APX.Api;

internal sealed class CsrfOriginMiddleware(RequestDelegate next, IConfiguration configuration, APX.Application.Authentication.AuthOptions authOptions)
{
    private readonly HashSet<string> allowed = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()?.Select(x => x.TrimEnd('/')).ToHashSet(StringComparer.OrdinalIgnoreCase) ?? [];
    public async Task InvokeAsync(HttpContext context)
    {
        if (NeedsValidation(context.Request) && !IsAllowed(context.Request))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden; context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsJsonAsync(new { type = "https://apx.local/problems/csrf", title = "Forbidden", status = 403, detail = "The request origin is not allowed.", code = "csrf_origin_rejected", traceId = context.TraceIdentifier }); return;
        }
        await next(context);
    }
    private bool NeedsValidation(HttpRequest request) => request.Cookies.ContainsKey(authOptions.CookieName) && request.Path.StartsWithSegments("/api/v1") && !HttpMethods.IsGet(request.Method) && !HttpMethods.IsHead(request.Method) && !HttpMethods.IsOptions(request.Method);
    private bool IsAllowed(HttpRequest request)
    {
        if (request.Headers.TryGetValue("Origin", out var origin)) return allowed.Contains(origin.ToString().TrimEnd('/'));
        if (request.Headers.TryGetValue("Referer", out var referer) && Uri.TryCreate(referer.ToString(), UriKind.Absolute, out var uri)) return allowed.Contains(uri.GetLeftPart(UriPartial.Authority));
        return false;
    }
}
