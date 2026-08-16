using System.Data;
using APX.Application.Catalog;
using APX.Application.Common;
using APX.Domain.Catalog;
using APX.Infrastructure.Catalog;
using APX.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace APX.Tests;

public sealed class IntegrationFactAttribute : FactAttribute
{
    public IntegrationFactAttribute()
    {
        if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("APX_TEST_CONNECTION_STRING")))
            Skip = "Set APX_TEST_CONNECTION_STRING to an isolated or explicitly authorized PostgreSQL database.";
    }
}

public sealed class PostgresIntegrationTests
{
    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task SchemaSeedIndexesAndPostgresFilters_AreReal()
    {
        await using var db = CreateContext();
        Assert.Equal(6, await db.ServiceCategories.CountAsync());
        Assert.Equal(36, await db.Solutions.CountAsync());

        var repository = new EfCatalogRepository(db);
        var lower = await repository.GetPublicSolutionsAsync(new(null, "apx", null, null, null, null, "order", 1, 100), default);
        var upper = await repository.GetPublicSolutionsAsync(new(null, "APX", null, null, null, null, "order", 1, 100), default);
        Assert.Equal(lower.TotalItems, upper.TotalItems);
        Assert.True(lower.TotalItems > 0);

        var category = await db.ServiceCategories.AsNoTracking().OrderBy(x => x.SortOrder).FirstAsync();
        var categoryResult = await repository.GetPublicSolutionsAsync(new(category.Slug, null, null, null, null, null, "order", 1, 100), default);
        Assert.Equal(6, categoryResult.TotalItems);
        Assert.All(categoryResult.Items, item => Assert.Equal(category.Id, item.CategoryId));

        var expectedTables = new[] { "service_categories", "solutions", "solution_media", "solution_features", "tags", "solution_tags", "use_cases", "solution_use_cases", "modalities", "solution_modalities", "solution_relations", "solution_seo", "project_requests", "project_request_items", "admin_users", "roles", "admin_user_roles", "audit_log" };
        var actualTables = await ReadStringsAsync(db, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        Assert.All(expectedTables, table => Assert.Contains(table, actualTables));
        var indexes = await ReadStringsAsync(db, "SELECT indexname FROM pg_indexes WHERE schemaname = 'public'");
        Assert.Contains("ix_solutions_status_order", indexes);
        Assert.Contains("ix_solutions_featured_order", indexes);
        Assert.Contains("ux_solutions_slug", indexes);
        Assert.Contains("ux_service_categories_slug", indexes);
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task AdminWorkflow_UsesTransactionsXminSoftDeleteAndAudit()
    {
        var suffix = Guid.NewGuid().ToString("N");
        var slug = $"integration-{suffix}";
        var createdIds = new List<Guid>();
        try
        {
            Guid categoryId;
            await using (var db = CreateContext()) categoryId = await db.ServiceCategories.AsNoTracking().OrderBy(x => x.SortOrder).Select(x => x.Id).FirstAsync();
            AdminSolutionDetailDto created;
            await using (var db = CreateContext())
            {
                var service = new AdminSolutionService(new EfCatalogRepository(db));
                var result = await service.CreateAsync(Request(categoryId, slug), default);
                Assert.True(result.Succeeded); created = result.Value!; createdIds.Add(created.Id); Assert.NotEqual("0", created.RowVersion);
            }

            AdminSolutionDetailDto updated;
            await using (var db = CreateContext())
            {
                var databaseVersion = await ReadXminAsync(db, created.Id);
                Assert.Equal(databaseVersion, created.RowVersion);
                var service = new AdminSolutionService(new EfCatalogRepository(db));
                var result = await service.UpdateAsync(created.Id, Update(created, created.RowVersion, "updated"), default);
                Assert.True(result.Succeeded, $"{result.Error?.Code}: {result.Error?.Detail}"); updated = result.Value!; Assert.NotEqual(created.RowVersion, updated.RowVersion);
            }

            await using (var db = CreateContext())
            {
                var stale = await new AdminSolutionService(new EfCatalogRepository(db)).UpdateAsync(created.Id, Update(created, created.RowVersion, "stale"), default);
                Assert.False(stale.Succeeded); Assert.Equal("concurrency_conflict", stale.Error!.Code);
            }

            await using (var db = CreateContext())
            {
                var service = new AdminSolutionService(new EfCatalogRepository(db));
                var published = await service.PublishAsync(created.Id, true, default); Assert.True(published.Succeeded); Assert.Equal("published", published.Value!.Status);
                var unpublished = await service.PublishAsync(created.Id, false, default); Assert.True(unpublished.Succeeded); Assert.Equal("draft", unpublished.Value!.Status); Assert.Null(unpublished.Value.PublishedAt);
                var duplicate = await service.DuplicateAsync(created.Id, new(null, null, false), default); Assert.True(duplicate.Succeeded); createdIds.Add(duplicate.Value!.Id); Assert.Equal("draft", duplicate.Value.Status); Assert.False(duplicate.Value.Featured);
            }

            await using (var db = CreateContext())
            {
                var deleted = await new AdminSolutionService(new EfCatalogRepository(db)).DeleteAsync(created.Id, default); Assert.True(deleted.Succeeded);
                Assert.False(await db.Solutions.AnyAsync(x => x.Id == created.Id));
                Assert.NotNull((await db.Solutions.IgnoreQueryFilters().SingleAsync(x => x.Id == created.Id)).DeletedAt);
                var actions = await db.AuditLog.Where(x => createdIds.Contains(x.EntityId)).Select(x => x.Action).ToListAsync();
                Assert.Contains("SolutionCreated", actions); Assert.Contains("SolutionUpdated", actions); Assert.Contains("SolutionPublished", actions); Assert.Contains("SolutionUnpublished", actions); Assert.Contains("SolutionDuplicated", actions); Assert.Contains("SolutionDeleted", actions);
            }

            await using (var db = CreateContext())
            {
                var categoryConflict = await new AdminCategoryService(new EfCatalogRepository(db)).DeleteAsync(categoryId, default);
                Assert.False(categoryConflict.Succeeded); Assert.Equal("category_has_solutions", categoryConflict.Error!.Code);
            }
        }
        finally { await CleanupAsync(createdIds); }
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task PostgreSqlUniqueSlugConstraint_IsEnforcedAtomically()
    {
        var slug = $"integration-unique-{Guid.NewGuid():N}"; await using var db = CreateContext(); var categoryId = await db.ServiceCategories.Select(x => x.Id).FirstAsync(); await using var tx = await db.Database.BeginTransactionAsync();
        db.Solutions.Add(Solution.Create(Guid.NewGuid(), categoryId, "Unique A", slug, "Short", "Description"));
        db.Solutions.Add(Solution.Create(Guid.NewGuid(), categoryId, "Unique B", slug, "Short", "Description"));
        await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync()); await tx.RollbackAsync(); db.ChangeTracker.Clear();
        Assert.False(await db.Solutions.IgnoreQueryFilters().AnyAsync(x => x.Slug == slug));
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task ApiIntegrationFixtures_CanBeCleanedSafely()
    {
        await using var db = CreateContext();
        var fixtures = await db.Solutions.IgnoreQueryFilters().Where(x => EF.Functions.Like(x.Slug, "api-integration-%")).Select(x => new { x.Id, x.DeletedAt }).ToListAsync();
        var ids = fixtures.Select(x => x.Id).ToList();
        if (ids.Count == 0) return;
        Assert.All(fixtures, fixture => Assert.NotNull(fixture.DeletedAt));
        var actions = await db.AuditLog.Where(x => ids.Contains(x.EntityId)).Select(x => x.Action).ToListAsync();
        Assert.Contains("SolutionCreated", actions); Assert.Contains("SolutionUpdated", actions); Assert.Contains("SolutionPublished", actions); Assert.Contains("SolutionUnpublished", actions); Assert.Contains("SolutionDeleted", actions);
        await db.AuditLog.Where(x => ids.Contains(x.EntityId)).ExecuteDeleteAsync();
        await db.Solutions.IgnoreQueryFilters().Where(x => ids.Contains(x.Id)).ExecuteDeleteAsync();
        Assert.False(await db.Solutions.IgnoreQueryFilters().AnyAsync(x => ids.Contains(x.Id)));
    }

    private static ApxDbContext CreateContext() => new(new DbContextOptionsBuilder<ApxDbContext>().UseNpgsql(Environment.GetEnvironmentVariable("APX_TEST_CONNECTION_STRING")!).Options);
    private static CreateSolutionRequest Request(Guid categoryId, string slug) => new("Integration test", slug, categoryId, null, "Temporary integration solution", "Temporary integration description", [new("Feature", null)], [], [], [], null, "quote", null, null, "COP", false, "draft", new("Integration SEO", null, ["integration"]), [], 9999);
    private static UpdateSolutionRequest Update(AdminSolutionDetailDto source, string rowVersion, string eyebrow) => new(rowVersion, source.Name, source.Slug, source.CategoryId, eyebrow, source.ShortDescription, source.Description, source.Features.Select(x => new FeatureInput(x.Title, x.Description)).ToList(), [], [], [], source.ImplementationTime, source.PriceMode, source.PriceFrom, source.PriceTo, source.Currency, source.Featured, source.Status, source.Seo is null ? null : new(source.Seo.Title, source.Seo.Description, source.Seo.Keywords), [], source.Order);
    private static async Task<HashSet<string>> ReadStringsAsync(ApxDbContext db, string sql) { var values = new HashSet<string>(StringComparer.Ordinal); var connection = db.Database.GetDbConnection(); if (connection.State != ConnectionState.Open) await connection.OpenAsync(); await using var command = connection.CreateCommand(); command.CommandText = sql; await using var reader = await command.ExecuteReaderAsync(); while (await reader.ReadAsync()) values.Add(reader.GetString(0)); return values; }
    private static async Task<string> ReadXminAsync(ApxDbContext db, Guid id) { var connection = db.Database.GetDbConnection(); if (connection.State != ConnectionState.Open) await connection.OpenAsync(); await using var command = connection.CreateCommand(); command.CommandText = "SELECT xmin::text FROM solutions WHERE id = @id"; var parameter = command.CreateParameter(); parameter.ParameterName = "id"; parameter.Value = id; command.Parameters.Add(parameter); return (string)(await command.ExecuteScalarAsync())!; }
    private static async Task CleanupAsync(IReadOnlyCollection<Guid> ids) { if (ids.Count == 0) return; await using var db = CreateContext(); await db.AuditLog.Where(x => ids.Contains(x.EntityId)).ExecuteDeleteAsync(); await db.Solutions.IgnoreQueryFilters().Where(x => ids.Contains(x.Id)).ExecuteDeleteAsync(); }
}
