using APX.Api;
using APX.Application.Catalog;
using APX.Infrastructure;
using APX.Infrastructure.Persistence.Seed;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

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
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("ApxClients", policy =>
{
    if (allowedOrigins.Length > 0) policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
}));
builder.Services.AddHealthChecks();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();
app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors("ApxClients");
app.MapGet("/health", () => Results.Ok(new { status = "ok" })).WithName("Health");
app.MapCatalogApi();
if (app.Environment.IsDevelopment() && builder.Configuration.GetValue("Features:EnableUnsafeDevelopmentAdminApi", false)) app.MapUnsafeDevelopmentAdminApi();
if (app.Environment.IsDevelopment()) app.MapOpenApi();

var connectionString = builder.Configuration.GetConnectionString("ApxDatabase");
if (!string.IsNullOrWhiteSpace(connectionString) && builder.Configuration.GetValue("Database:InitializeOnStartup", false)) await app.Services.InitializeDatabaseAsync();

app.Run();
public partial class Program;
