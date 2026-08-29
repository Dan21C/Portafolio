using APX.Infrastructure.Persistence;
using Microsoft.Extensions.Diagnostics.HealthChecks;
namespace APX.Api;
public sealed class DatabaseReadinessHealthCheck(IServiceScopeFactory scopes):IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context,CancellationToken ct=default){using var timeout=CancellationTokenSource.CreateLinkedTokenSource(ct);timeout.CancelAfter(TimeSpan.FromSeconds(5));try{await using var scope=scopes.CreateAsyncScope();var db=scope.ServiceProvider.GetRequiredService<ApxDbContext>();return await db.Database.CanConnectAsync(timeout.Token)?HealthCheckResult.Healthy():HealthCheckResult.Unhealthy("Database unavailable.");}catch(OperationCanceledException){return HealthCheckResult.Unhealthy("Database readiness timed out.");}catch(Exception){return HealthCheckResult.Unhealthy("Database unavailable.");}}
}
