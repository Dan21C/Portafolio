using System.Security.Claims;
using System.Text.Encodings.Web;
using APX.Application.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace APX.Api;

internal static class AdminAuth
{
    public const string Scheme = "AdminSession"; public const string SessionItemKey = "APX.AdminSession"; public const string Read = "AdminRead"; public const string ContentWrite = "ContentWrite"; public const string Publish = "ContentPublish"; public const string Delete = "ContentDelete"; public const string CategoryManage = "CategoryManage"; public const string MediaWrite = "MediaWrite"; public const string ProjectRequestRead = "ProjectRequestRead"; public const string ProjectRequestWrite = "ProjectRequestWrite"; public const string UserManagement = "UserManagement";
}

internal sealed class AdminSessionSchemeOptions : AuthenticationSchemeOptions;

internal sealed class AdminSessionAuthenticationHandler(IOptionsMonitor<AdminSessionSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder, AuthService auth, AuthOptions authOptions)
    : AuthenticationHandler<AdminSessionSchemeOptions>(options, logger, encoder)
{
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Cookies.TryGetValue(authOptions.CookieName, out var token) || string.IsNullOrWhiteSpace(token)) return AuthenticateResult.NoResult();
        var session = await auth.ValidateSessionAsync(token, Context.RequestAborted); if (session is null) return AuthenticateResult.Fail("Invalid or expired admin session."); Context.Items[AdminAuth.SessionItemKey] = session;
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, session.UserId.ToString()), new(ClaimTypes.Name, session.DisplayName) };
        if (session.Email is not null) claims.Add(new(ClaimTypes.Email, session.Email));
        claims.AddRange(session.Roles.Select(role => new Claim(ClaimTypes.Role, role))); claims.AddRange(session.Permissions.Select(permission => new Claim("permission", permission)));
        return AuthenticateResult.Success(new(new ClaimsPrincipal(new ClaimsIdentity(claims, AdminAuth.Scheme)), AdminAuth.Scheme));
    }

    protected override async Task HandleChallengeAsync(AuthenticationProperties properties)
    {
        Response.StatusCode = StatusCodes.Status401Unauthorized; Response.ContentType = "application/problem+json";
        await Response.WriteAsJsonAsync(new { type = "https://apx.local/problems/unauthorized", title = "Unauthorized", status = 401, detail = "A valid admin session is required.", code = "unauthorized", traceId = Context.TraceIdentifier });
    }
}
