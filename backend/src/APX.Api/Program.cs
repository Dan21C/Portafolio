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
using APX.Application.Emailing;
using APX.Infrastructure.Emailing;
using APX.Application.AdminUsers;
using APX.Application.Dashboard;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
if (Environment.GetEnvironmentVariable("PORT") is { Length: > 0 } port && string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("ASPNETCORE_URLS"))) builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
ProductionConfigurationValidator.Validate(builder.Configuration,builder.Environment);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.AddProblemDetails(options => options.CustomizeProblemDetails = context => context.ProblemDetails.Extensions["traceId"] = context.HttpContext.TraceIdentifier);
builder.Services.AddExceptionHandler(options => options.ExceptionHandler = async context =>
{
    var feature = context.Features.Get<IExceptionHandlerFeature>();
    context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("GlobalException").LogError(feature?.Error,"Unhandled request failure. TraceId {TraceId}",context.TraceIdentifier);
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
builder.Services.AddScoped<AdminUserManagementService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton(new DashboardOptions(builder.Configuration.GetValue("Dashboard:LeadAttentionHours",24),builder.Configuration.GetValue("Dashboard:MaxRangeDays",366)));
builder.Services.AddSingleton(new DataRetentionOptions(builder.Configuration.GetValue("Retention:ConsumedOtpDays",7),builder.Configuration.GetValue("Retention:RevokedSessionDays",30),builder.Configuration.GetValue("Retention:EmailDeliveryDays",180),builder.Configuration.GetValue("Retention:AuditLogDays",730)));
var authOptions = new AuthOptions(
    builder.Configuration.GetValue("Auth:OtpLifetimeMinutes", 5), builder.Configuration.GetValue("Auth:OtpMaxAttempts", 5),
    builder.Configuration.GetValue("Auth:OtpCooldownSeconds", 60), builder.Configuration.GetValue("Auth:SessionLifetimeHours", 8),
    builder.Configuration.GetValue("Auth:MaxSessionsPerUser", 5), builder.Configuration["Auth:CookieName"] ?? "apx_admin_session",
    builder.Configuration["Auth:OtpPepper"] ?? string.Empty, builder.Configuration.GetValue("Auth:EnableDevelopmentOtpDisclosure", false));
builder.Services.AddSingleton(authOptions);
var cookieSameSite=Enum.TryParse<SameSiteMode>(builder.Configuration["Auth:CookieSameSite"]??"Lax",true,out var parsedSameSite)?parsedSameSite:SameSiteMode.Lax;var cookieOptions=new CookieSecurityOptions(cookieSameSite);builder.Services.AddSingleton(cookieOptions);
builder.Services.AddSingleton(new ProjectRequestOptions(builder.Configuration.GetValue("ProjectRequests:MaxItems", 20), builder.Configuration["ProjectRequests:PrivacyPolicyVersion"] ?? "2026-08", builder.Configuration["ProjectRequests:PrivacyPolicyUrl"]));
var emailProvider = builder.Configuration["Email:Provider"]?.Trim() is { Length: > 0 } configuredProvider ? configuredProvider : "Development";
var emailOptions = new TransactionalEmailOptions(emailProvider, builder.Configuration["Email:FromAddress"] ?? string.Empty, builder.Configuration["Email:FromName"] ?? "APX", builder.Configuration["Email:ReplyToAddress"], builder.Configuration.GetSection("Email:InternalRecipients").Get<string[]>() ?? [], new(builder.Configuration["Email:Smtp:Host"] ?? string.Empty, builder.Configuration.GetValue("Email:Smtp:Port", 587), builder.Configuration["Email:Smtp:Username"] ?? string.Empty, builder.Configuration["Email:Smtp:Password"] ?? string.Empty, builder.Configuration.GetValue("Email:Smtp:UseStartTls", true), builder.Configuration.GetValue("Email:Smtp:TimeoutSeconds", 15), builder.Configuration.GetValue("Email:Smtp:MaxAttempts", 3)), builder.Configuration["AppUrls:AdminBaseUrl"], new(builder.Configuration["Email:Resend:ApiKey"] ?? string.Empty, builder.Configuration["Email:Resend:BaseUrl"] is { Length: > 0 } resendBaseUrl ? resendBaseUrl : "https://api.resend.com", builder.Configuration.GetValue("Email:Resend:TimeoutSeconds", 15), builder.Configuration.GetValue("Email:Resend:MaxAttempts", 3)));
if (emailProvider.Equals("Development", StringComparison.OrdinalIgnoreCase) && !builder.Environment.IsDevelopment()) throw new InvalidOperationException("Email:Provider=Development is only allowed in Development.");
if (emailProvider.Equals("Smtp", StringComparison.OrdinalIgnoreCase) && (string.IsNullOrWhiteSpace(emailOptions.FromAddress) || string.IsNullOrWhiteSpace(emailOptions.Smtp.Host) || emailOptions.Smtp.Port is < 1 or > 65535 || string.IsNullOrWhiteSpace(emailOptions.Smtp.Username) || string.IsNullOrWhiteSpace(emailOptions.Smtp.Password))) throw new InvalidOperationException("Email SMTP configuration is incomplete. Configure host, port, username, password and from address.");
if (emailProvider.Equals("Resend", StringComparison.OrdinalIgnoreCase) && (string.IsNullOrWhiteSpace(emailOptions.FromAddress) || string.IsNullOrWhiteSpace(emailOptions.Resend?.ApiKey) || !Uri.TryCreate(emailOptions.Resend.BaseUrl, UriKind.Absolute, out var resendUri) || resendUri.Scheme != Uri.UriSchemeHttps)) throw new InvalidOperationException("Email Resend configuration is incomplete. Configure ApiKey, an absolute HTTPS BaseUrl and from address.");
if (!emailProvider.Equals("Development", StringComparison.OrdinalIgnoreCase) && !emailProvider.Equals("Smtp", StringComparison.OrdinalIgnoreCase) && !emailProvider.Equals("Resend", StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Email:Provider must be Development, Smtp or Resend.");
builder.Services.AddSingleton(emailOptions); builder.Services.AddSingleton(new EmailSenderRuntimeOptions(builder.Environment.IsDevelopment()));
builder.Services.AddEmailTransport(emailProvider, emailOptions);
builder.Services.AddScoped<IProjectRequestNotifier, ProjectRequestEmailNotifier>();
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
    options.AddPolicy(AdminAuth.UserManagement, policy => policy.RequireClaim("permission", AdminPermissions.UserManage));
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
builder.Services.Configure<ForwardedHeadersOptions>(options=>{options.ForwardedHeaders=ForwardedHeaders.XForwardedFor|ForwardedHeaders.XForwardedProto;options.ForwardLimit=1;foreach(var value in builder.Configuration.GetSection("Proxy:KnownProxies").Get<string[]>()??[])if(IPAddress.TryParse(value,out var address))options.KnownProxies.Add(address);});
builder.Services.AddHealthChecks().AddCheck<DatabaseReadinessHealthCheck>("postgresql",tags:["ready"]);
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();
app.UseForwardedHeaders();
app.UseExceptionHandler();
if(!app.Environment.IsDevelopment())app.UseHsts();
app.UseHttpsRedirection();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseCors("ApxClients");
app.UseRateLimiter();
app.UseAuthentication();
app.UseMiddleware<OperationalMiddleware>();
app.UseMiddleware<CsrfOriginMiddleware>();
app.UseAuthorization();
app.MapGet("/health", () => Results.Ok(new { status = "ok" })).WithName("Health");
static Task HealthResponse(HttpContext context,HealthReport report){context.Response.ContentType="application/json";return context.Response.WriteAsync(JsonSerializer.Serialize(new{status=report.Status.ToString(),components=report.Entries.ToDictionary(x=>x.Key,x=>x.Value.Status.ToString())}));}
app.MapHealthChecks("/health/live",new HealthCheckOptions{Predicate=_=>false,ResponseWriter=HealthResponse});
app.MapHealthChecks("/health/ready",new HealthCheckOptions{Predicate=check=>check.Tags.Contains("ready"),ResponseWriter=HealthResponse});
app.MapCatalogApi();
app.MapAuthApi(authOptions,cookieOptions);
app.MapAdminApi();
app.MapProjectRequestApi();
app.MapAdminUserApi();
app.MapDashboardApi();
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
if(args.Length>0&&args[0].Equals("cleanup-auth",StringComparison.OrdinalIgnoreCase))
{
    await using var scope=app.Services.CreateAsyncScope();var db=scope.ServiceProvider.GetRequiredService<APX.Infrastructure.Persistence.ApxDbContext>();var retention=scope.ServiceProvider.GetRequiredService<DataRetentionOptions>();var now=DateTimeOffset.UtcNow;var sessions=await db.AdminSessions.Where(x=>(x.ExpiresAt<now||x.RevokedAt!=null)&&(x.RevokedAt??x.ExpiresAt)<now.AddDays(-retention.RevokedSessionDays)).ExecuteDeleteAsync();var challenges=await db.OtpChallenges.Where(x=>(x.ConsumedAt!=null||x.LockedAt!=null||x.ExpiresAt<now)&&x.CreatedAt<now.AddDays(-retention.ConsumedOtpDays)).ExecuteDeleteAsync();Console.WriteLine($"Auth cleanup completed. Sessions: {sessions}; OTP challenges: {challenges}.");return;
}

app.Run();
public partial class Program;
