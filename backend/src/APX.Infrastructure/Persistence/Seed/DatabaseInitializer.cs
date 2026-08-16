using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace APX.Infrastructure.Persistence.Seed;

public static class DatabaseInitializer
{
    public static async Task InitializeDatabaseAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        await using var scope = services.CreateAsyncScope(); var db = scope.ServiceProvider.GetRequiredService<ApxDbContext>(); var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApxDbContext>>();
        await db.Database.MigrateAsync(cancellationToken);
        await using var transaction = await db.Database.BeginTransactionAsync(cancellationToken);
        if (!await db.Roles.AnyAsync(cancellationToken)) db.Roles.AddRange(CatalogSeedData.Roles);
        if (!await db.ServiceCategories.AnyAsync(cancellationToken)) db.ServiceCategories.AddRange(CatalogSeedData.Categories);
        if (!await db.Tags.AnyAsync(cancellationToken)) db.Tags.AddRange(CatalogSeedData.Tags);
        if (!await db.UseCases.AnyAsync(cancellationToken)) db.UseCases.AddRange(CatalogSeedData.UseCases);
        if (!await db.Modalities.AnyAsync(cancellationToken)) db.Modalities.AddRange(CatalogSeedData.Modalities);
        await db.SaveChangesAsync(cancellationToken);
        if (!await db.Solutions.IgnoreQueryFilters().AnyAsync(cancellationToken)) { db.Solutions.AddRange(CatalogSeedData.Solutions); await db.SaveChangesAsync(cancellationToken); }
        await transaction.CommitAsync(cancellationToken); logger.LogInformation("APX database seed verified.");
    }
}
