using System.Diagnostics;
using System.Security.Claims;
namespace APX.Api;
internal sealed class OperationalMiddleware(RequestDelegate next,ILogger<OperationalMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context){var started=Stopwatch.GetTimestamp();try{await next(context);}finally{var duration=Stopwatch.GetElapsedTime(started).TotalMilliseconds;using var scope=logger.BeginScope(new Dictionary<string,object?>{{"TraceId",context.TraceIdentifier},{"AdminUserId",context.User.FindFirstValue(ClaimTypes.NameIdentifier)}});logger.LogInformation("HTTP {Method} {Path} responded {StatusCode} in {DurationMs:F1} ms",context.Request.Method,context.Request.Path.Value,context.Response.StatusCode,duration);}}
}
internal sealed class SecurityHeadersMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context){context.Response.OnStarting(()=>{context.Response.Headers["X-Content-Type-Options"]="nosniff";context.Response.Headers["Referrer-Policy"]="no-referrer";context.Response.Headers["X-Frame-Options"]="DENY";context.Response.Headers["Permissions-Policy"]="camera=(), microphone=(), geolocation=()";return Task.CompletedTask;});await next(context);}
}
