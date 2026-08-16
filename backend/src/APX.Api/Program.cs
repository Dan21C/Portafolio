using APX.Infrastructure;
using APX.Infrastructure.Persistence.Seed;

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("ApxClients", policy =>
{
    if (allowedOrigins.Length > 0) policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
}));
builder.Services.AddHealthChecks();
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();
app.UseHttpsRedirection();
app.UseCors("ApxClients");
app.MapGet("/health", () => Results.Ok(new { status = "ok" })).WithName("Health");

var connectionString = builder.Configuration.GetConnectionString("ApxDatabase");
if (!string.IsNullOrWhiteSpace(connectionString) && builder.Configuration.GetValue("Database:InitializeOnStartup", false)) await app.Services.InitializeDatabaseAsync();

app.Run();
public partial class Program;
