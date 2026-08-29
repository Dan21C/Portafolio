using APX.Application.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace APX.Api;

internal static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthApi(this IEndpointRouteBuilder endpoints, AuthOptions options, CookieSecurityOptions cookieSecurity)
    {
        var auth = endpoints.MapGroup("/api/v1/auth").WithTags("Admin Authentication");
        auth.MapPost("/otp/request", async (RequestOtpDto request, HttpContext http, AuthService service, CancellationToken ct) =>
            (await service.RequestOtpAsync(request, Context(http), ct)).ToHttp(value => Results.Accepted(value: value)))
            .RequireRateLimiting("otp-request").Produces<OtpChallengeDto>(202).ProducesProblem(400).ProducesProblem(429);
        auth.MapPost("/otp/verify", async (VerifyOtpDto request, HttpContext http, AuthService service, IWebHostEnvironment environment, CancellationToken ct) =>
        {
            var result = await service.VerifyOtpAsync(request, Context(http), ct); if (!result.Succeeded) return result.ToHttp();
            var created = result.Value!; http.Response.Cookies.Append(options.CookieName, created.Token, Cookie(environment, cookieSecurity, created.Session.ExpiresAt)); return Results.Ok(created.Session);
        }).RequireRateLimiting("otp-verify").Produces<AuthSessionDto>().ProducesProblem(401).ProducesProblem(429);
        auth.MapGet("/me", (HttpContext http) => http.Items[AdminAuth.SessionItemKey] is AuthSessionDto session ? Results.Ok(session) : Results.Unauthorized()).RequireAuthorization().Produces<AuthSessionDto>().ProducesProblem(401);
        auth.MapPost("/logout", async (HttpContext http, AuthService service, IWebHostEnvironment environment, CancellationToken ct) =>
        {
            await service.LogoutAsync(http.Request.Cookies[options.CookieName], Context(http), ct); http.Response.Cookies.Delete(options.CookieName, Cookie(environment, cookieSecurity, DateTimeOffset.UnixEpoch)); return Results.NoContent();
        }).RequireAuthorization().Produces(204).ProducesProblem(401);
        return endpoints;
    }

    private static AuthRequestContext Context(HttpContext http) => new(http.Connection.RemoteIpAddress?.ToString(), http.Request.Headers.UserAgent.ToString());
    private static CookieOptions Cookie(IWebHostEnvironment environment, CookieSecurityOptions security, DateTimeOffset expires) => new() { HttpOnly = true, Secure = !environment.IsDevelopment(), SameSite = security.SameSite, Path = "/", Expires = expires, IsEssential = true };
}
