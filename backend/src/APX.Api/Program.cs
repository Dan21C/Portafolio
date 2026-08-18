using APX.Api;
using APX.Application.Catalog;
using APX.Application.Authentication;
using APX.Infrastructure;
using APX.Infrastructure.Persistence.Seed;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Authorization;
using System.Threading.RateLimiting;
using APX.Infrastructure.Authentication;
using APX.Application.Requests;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddProblemDetails(options => options.CustomizeProblemDetails = context => context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier);
builder.Services.AddExceptionHandler(options => options.ExceptionHandler = async context =>
{
    var feature = context.Features.Get<IExceptionHandlerFeature>();
    var problem = new ProblemDetails { Type = "https://apx.local/problems/unexpected", Title = "Unexpected error", Status = 500, Detail = builder.Environment.IsDevelopment() ? feature?.Error.Message : "An unexpected error occurred." };
    problem.Extensions["code"] = "unexpected"; problem.Extensions["traceId"] = context.TraceIdentifier;
    context.Response.StatusCode = 500; context.Response.ContentType = "application/problem+json"; await context.Response.WriteAsJsonAsync(problem);
});
builder.Services.AddOpenApi();
builder.Services.AddScoped<CatalogQueryService>();
builder.Services.AddScoped<AdminSolutionService>();
builder.Services.AddScoped<AdminCategoryService>();
builder.Services.AddScoped<MediaService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProjectRequestService>();
var authOptions = new AuthOptions(
    builder.Configuration.GetValue("Auth:OtpLifetimeMinutes", 5), builder.Configuration.GetValue("Auth:OtpMaxAttempts", 5),
    builder.Configuration.GetValue("Auth:OtpCooldownSeconds", 60), builder.Configuration.GetValue("Auth:SessionLifetimeHours", 8),
    builder.Configuration.GetValue("Auth:MaxSessionsPerUser", 5), builder.Configuration["Auth:CookieName"] ?? "apx_admin_session",
    builder.Configuration["Auth:OtpPepper"] ?? string.Empty, builder.Configuration.GetValue("Auth:EnableDevelopmentOtpDisclosure", false));
builder.Services.AddSingleton(authOptions);
builder.Services.AddSingleton(new ProjectRequestOptions(builder.Configuration.GetValue("ProjectRequests:MaxItems", 20), builder.Configuration["ProjectRequests:PrivacyPolicyVersion"] ?? "2026-08", builder.Configuration["ProjectRequests:PrivacyPolicyUrl"]));
builder.Services.AddSingleton(new EmailSenderRuntimeOptions(builder.Environment.IsDevelopment()));
builder.Services.AddScoped<IEmailSender, DevelopmentEmailSender>();
builder.Services.AddAuthentication(AdminAuth.Scheme).AddScheme<AdminSessionSchemeOptions, AdminSessionAuthenticationHandler>(AdminAuth.Scheme, _ => { });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AdminAuth.Read, policy => policy.RequireClaim("permission", AdminPermissions.Read));
    options.AddPolicy(AdminAuth.ContentWrite, policy => policy.RequireClaim("permission", AdminPermissions.ContentWrite));
    options.AddPolicy(AdminAuth.Publish, policy => policy.RequireClaim("permission", AdminPermissions.Publish));
    options.AddPolicy(AdminAuth.Delete, policy => policy.RequireClaim("permission", AdminPermissions.Delete));
    options.AddPolicy(AdminAuth.CategoryManage, policy => policy.RequireClaim("permission", AdminPermissions.CategoryManage));
    options.AddPolicy(AdminAuth.MediaWrite, policy => policy.RequireClaim("permission", AdminPermissions.MediaWrite));
    options.AddPolicy(AdminAuth.ProjectRequestRead, policy => policy.RequireClaim("permission", AdminPermissions.ProjectRequestRead));
    options.AddPolicy(AdminAuth.ProjectRequestWrite, policy => policy.RequireClaim("permission", AdminPermissions.ProjectRequestWrite));
});
builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, ProblemAuthorizationResultHandler>();
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, ct) => { context.HttpContext.Response.Headers.RetryAfter = "60"; await context.HttpContext.Response.WriteAsJsonAsync(new { type = "https://apx.local/problems/rate-limit", title = "Too many requests", status = 429, detail = "Try again later.", code = "rate_limited" }, ct); };
    options.AddPolicy("otp-request", http => RateLimitPartition.GetFixedWindowLimiter(http.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions { PermitLimit = builder.Configuration.GetValue("Auth:RequestRateLimit", 5), Window = TimeSpan.FromMinutes(builder.Configuration.GetValue("Auth:RequestRateWindowMinutes", 15)), QueueLimit = 0, AutoReplenishment = true }));
    options.AddPolicy("otp-verify", http => RateLimitPartition.GetFixedWindowLimiter(http.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions { PermitLimit = builder.Configuration.GetValue("Auth:VerifyRateLimit", 30), Window = TimeSpan.FromMinutes(15), QueueLimit = 0, AutoReplenishment = true }));
    options.AddPolicy("project-requests", http => RateLimitPartition.GetFixedWindowLimiter(http.Connection.RemoteIpAddress?.ToString() ?? "unknown", _ => new FixedWindowRateLimiterOptions { PermitLimit = builder.Configuration.GetValue("ProjectRequests:RateLimit", 5), Window = TimeSpan.FromMinutes(builder.Configuration.GetValue("ProjectRequests:RateWindowMinutes", 15)), QueueLimit = 0, AutoReplenishment = true }));
});
builder.Services.AddSingleton(new MediaValidationOptions(builder.Configuration.GetValue<long?>("Media:MaxUploadBytes") ?? 10 * 1024 * 1024));
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("ApxClients", policy =>
{
    if (allowedOrigins.Length > 0) policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
}));
builder.Services.AddHealthChecks();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors("ApxClients");
app.UseRateLimiter();
app.UseAuthentication();
app.UseMiddleware<CsrfOriginMiddleware>();
app.UseAuthorization();
app.MapGet("/health", () => Results.Ok(new { status = "ok" })).WithName("Health");
app.MapCatalogApi();
app.MapAuthApi(authOptions);
app.MapAdminApi();
app.MapProjectRequestApi();
if (app.Environment.IsDevelopment()) app.MapOpenApi();

var connectionString = builder.Configuration.GetConnectionString("ApxDatabase");
if (!string.IsNullOrWhiteSpace(connectionString) && builder.Configuration.GetValue("Database:InitializeOnStartup", false)) await app.Services.InitializeDatabaseAsync();

if (args.Length > 0 && args[0].Equals("bootstrap-admin", StringComparison.OrdinalIgnoreCase))
{
    static string? Argument(string[] values, string name) { var index = Array.FindIndex(values, x => x.Equals(name, StringComparison.OrdinalIgnoreCase)); return index >= 0 && index + 1 < values.Length ? values[index + 1] : null; }
    var email = Argument(args, "--email"); var name = Argument(args, "--name");
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(name)) { Console.Error.WriteLine("Usage: bootstrap-admin --email <email> --name <display-name>"); Environment.ExitCode = 2; return; }
    await using var scope = app.Services.CreateAsyncScope(); var result = await scope.ServiceProvider.GetRequiredService<AuthService>().BootstrapAdminAsync(email, name, default);
    if (!result.Succeeded) { Console.Error.WriteLine($"Bootstrap failed: {result.Error!.Code} - {result.Error.Detail}"); Environment.ExitCode = 1; return; }
    Console.WriteLine($"Admin bootstrap completed for user {result.Value}."); return;
}

app.Run();
public partial class Program;
