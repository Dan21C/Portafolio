using System.Data;
using APX.Application.Catalog;
using APX.Application.Authentication;
using APX.Application.Common;
using APX.Domain.Catalog;
using APX.Infrastructure.Catalog;
using APX.Infrastructure.Authentication;
using APX.Domain.Admin;
using APX.Infrastructure.Persistence;
using APX.Application.Requests;
using APX.Infrastructure.Requests;
using APX.Domain.Emailing;
using APX.Application.AdminUsers;
using APX.Infrastructure.AdminUsers;
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

        var expectedTables = new[] { "service_categories", "solutions", "solution_media", "solution_features", "tags", "solution_tags", "use_cases", "solution_use_cases", "modalities", "solution_modalities", "solution_relations", "solution_seo", "project_requests", "project_request_items", "admin_users", "roles", "admin_user_roles", "audit_log", "otp_challenges", "admin_sessions" };
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

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task Authentication_PersistsHashesRolesConsumptionAndRevocation()
    {
        var email = $"integration-auth-{Guid.NewGuid():N}@example.test"; Guid userId = Guid.Empty;
        try
        {
            await using (var db = CreateContext()) { var bootstrap = await new EfAuthRepository(db).BootstrapAdminAsync(email, "Integration Admin", default); Assert.True(bootstrap.Succeeded); userId = bootstrap.Value; }
            var sender = new CapturingEmailSender(); OtpChallengeDto requested;
            await using (var db = CreateContext()) { var service = new AuthService(new EfAuthRepository(db), sender, new(OtpPepper: "integration-only-pepper-with-at-least-32-characters")); var result = await service.RequestOtpAsync(new("email", email), new("127.0.0.1", "integration"), default); Assert.True(result.Succeeded); requested = result.Value!; }
            string token;
            await using (var db = CreateContext()) { var service = new AuthService(new EfAuthRepository(db), sender, new(OtpPepper: "integration-only-pepper-with-at-least-32-characters")); var verified = await service.VerifyOtpAsync(new(requested.ChallengeId, sender.Code!), new("127.0.0.1", "integration"), default); Assert.True(verified.Succeeded); token = verified.Value!.Token; Assert.Contains("Admin", verified.Value.Session.Roles); }
            await using (var db = CreateContext()) { var challenge = await db.OtpChallenges.SingleAsync(x => x.Id == requested.ChallengeId); var session = await db.AdminSessions.SingleAsync(x => x.AdminUserId == userId); Assert.NotNull(challenge.ConsumedAt); Assert.NotEqual(sender.Code, challenge.CodeHash); Assert.Equal(AuthService.HashToken(token), session.TokenHash); var service = new AuthService(new EfAuthRepository(db), sender, new(OtpPepper: "integration-only-pepper-with-at-least-32-characters")); await service.LogoutAsync(token, new("127.0.0.1", "integration"), default); Assert.NotNull((await db.AdminSessions.SingleAsync(x => x.Id == session.Id)).RevokedAt); }
        }
        finally { if (userId != Guid.Empty) { await using var db = CreateContext(); await db.AuditLog.Where(x => x.AdminUserId == userId).ExecuteDeleteAsync(); await db.AdminUsers.Where(x => x.Id == userId).ExecuteDeleteAsync(); } }
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task ProjectRequestWorkflow_PersistsSnapshotsHistorySequenceAndXmin()
    {
        Guid requestId = Guid.Empty; Guid adminId = Guid.Empty;
        try
        {
            await using var db = CreateContext(); var solutionIds = await db.Solutions.AsNoTracking().Where(x => x.Status == SolutionStatus.Published).OrderBy(x => x.Id).Select(x => x.Id).Take(2).ToArrayAsync(); Assert.Equal(2, solutionIds.Length);
            var auth = await new EfAuthRepository(db).BootstrapAdminAsync($"integration-request-{Guid.NewGuid():N}@example.test", "Request Integration", default); Assert.True(auth.Succeeded); adminId = auth.Value;
            var repository = new EfProjectRequestRepository(db); var created = await repository.CreateAsync(new("Integration Request", "APX", "REQUEST@EXAMPLE.TEST", "+57 300 000 0000", "Bogotá", null, 200, "Fixture", true, "2026-08", solutionIds.Select(x => new CreateProjectRequestItemDto(x)).ToArray()), new(20, "2026-08"), default); Assert.True(created.Succeeded); requestId = created.Value!.Id; Assert.Matches("^APX-[0-9]{6}$", created.Value.RequestNumber);
            var detail = await repository.GetByIdAsync(requestId, default); Assert.NotNull(detail); Assert.Equal(2, detail.Items.Count); Assert.All(detail.Items, x => { Assert.NotEmpty(x.SolutionName); Assert.NotEmpty(x.SolutionSlug); Assert.NotEmpty(x.CategoryName); }); Assert.Single(detail.StatusHistory); Assert.Equal("New", detail.Status);
            var changed = await repository.UpdateStatusAsync(requestId, new("InReview", detail.RowVersion), adminId, default); Assert.True(changed.Succeeded); Assert.Equal("InReview", changed.Value!.Status); Assert.Equal(2, changed.Value.StatusHistory.Count); Assert.NotEqual(detail.RowVersion, changed.Value.RowVersion);
            var contacted = await repository.UpdateStatusAsync(requestId, new("Contacted", changed.Value.RowVersion), adminId, default); Assert.True(contacted.Succeeded); Assert.NotNull(contacted.Value!.LastContactedAt);
            var stale = await repository.UpdateStatusAsync(requestId, new("Won", detail.RowVersion), adminId, default); Assert.False(stale.Succeeded); Assert.Equal(ErrorType.Concurrency, stale.Error!.Type);
        }
        finally
        {
            await using var cleanup = CreateContext(); if (requestId != Guid.Empty) { await cleanup.AuditLog.Where(x => x.EntityId == requestId).ExecuteDeleteAsync(); await cleanup.ProjectRequests.Where(x => x.Id == requestId).ExecuteDeleteAsync(); } if (adminId != Guid.Empty) { await cleanup.AuditLog.Where(x => x.AdminUserId == adminId).ExecuteDeleteAsync(); await cleanup.AdminUsers.Where(x => x.Id == adminId).ExecuteDeleteAsync(); }
        }
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task ProjectRequestSmokeFixtures_CanBeCleanedSafely()
    {
        await using var db = CreateContext(); var requestIds = await db.ProjectRequests.Where(x => x.Email == "phase2g-smoke@example.test" || x.Email == "phase2g-unavailable@example.test").Select(x => x.Id).ToArrayAsync();
        if (requestIds.Length > 0) { await db.AuditLog.Where(x => requestIds.Contains(x.EntityId)).ExecuteDeleteAsync(); await db.ProjectRequests.Where(x => requestIds.Contains(x.Id)).ExecuteDeleteAsync(); }
        var solutionIds = await db.Solutions.IgnoreQueryFilters().Where(x => x.Slug.StartsWith("api-integration-phase2g-")).Select(x => x.Id).ToArrayAsync();
        if (solutionIds.Length > 0) { await db.AuditLog.Where(x => solutionIds.Contains(x.EntityId)).ExecuteDeleteAsync(); await db.Solutions.IgnoreQueryFilters().Where(x => solutionIds.Contains(x.Id)).ExecuteDeleteAsync(); }
        Assert.False(await db.ProjectRequests.AnyAsync(x => x.Email == "phase2g-smoke@example.test" || x.Email == "phase2g-unavailable@example.test")); Assert.False(await db.Solutions.IgnoreQueryFilters().AnyAsync(x => x.Slug.StartsWith("api-integration-phase2g-")));
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task AdminUserManagement_EnforcesRoleRevocationStatusConcurrencyAndLastAdmin()
    {
        Guid actorId=Guid.Empty,targetId=Guid.Empty;
        try
        {
            await using(var db=CreateContext()){var actor=await new EfAuthRepository(db).BootstrapAdminAsync($"integration-users-actor-{Guid.NewGuid():N}@example.test","Actor Admin",default);Assert.True(actor.Succeeded);actorId=actor.Value;var repo=new EfAdminUserManagementRepository(db);var created=await repo.CreateAsync(new("Managed User",$"integration-users-target-{Guid.NewGuid():N}@example.test","Editor"),actorId,default);Assert.True(created.Succeeded);targetId=created.Value!.Id;db.AdminSessions.Add(new AdminSession{Id=Guid.NewGuid(),AdminUserId=targetId,TokenHash=Guid.NewGuid().ToString("N"),CreatedAt=DateTimeOffset.UtcNow,ExpiresAt=DateTimeOffset.UtcNow.AddHours(1),LastSeenAt=DateTimeOffset.UtcNow});await db.SaveChangesAsync();}
            string stale;
            await using(var db=CreateContext()){var repo=new EfAdminUserManagementRepository(db);var detail=await repo.GetByIdAsync(targetId,default);Assert.NotNull(detail);stale=detail.RowVersion;var changed=await repo.UpdateAsync(targetId,new("Managed Viewer","Viewer",detail.RowVersion),actorId,default);Assert.True(changed.Succeeded);Assert.Equal("Viewer",changed.Value!.Roles.Single());Assert.Equal(0,changed.Value.ActiveSessionsCount);var conflict=await repo.UpdateAsync(targetId,new("Stale","Editor",stale),actorId,default);Assert.False(conflict.Succeeded);Assert.Equal(ErrorType.Concurrency,conflict.Error!.Type);var disabled=await repo.SetActiveAsync(targetId,false,changed.Value.RowVersion,actorId,default);Assert.True(disabled.Succeeded);Assert.Equal("Disabled",disabled.Value!.Status);var active=await repo.SetActiveAsync(targetId,true,disabled.Value.RowVersion,actorId,default);Assert.True(active.Succeeded);Assert.Equal("Active",active.Value!.Status);Assert.Equal(0,active.Value.ActiveSessionsCount);}
        }
        finally{await using var db=CreateContext();var ids=new[]{actorId,targetId}.Where(x=>x!=Guid.Empty).ToArray();if(ids.Length>0){await db.AuditLog.Where(x=>ids.Contains(x.EntityId)||x.AdminUserId!=null&&ids.Contains(x.AdminUserId.Value)).ExecuteDeleteAsync();await db.AdminUsers.Where(x=>ids.Contains(x.Id)).ExecuteDeleteAsync();}}
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task AdminUserSmokeFixture_CanBeCleanedSafely()
    {
        const string email="apxtechlab+phase2i@gmail.com"; await using var db=CreateContext(); var user=await db.AdminUsers.SingleOrDefaultAsync(x=>x.Email==email); if(user is null)return;Assert.Equal(AdminUserStatus.Active,user.Status);Assert.False(await db.AdminSessions.AnyAsync(x=>x.AdminUserId==user.Id&&x.RevokedAt==null&&x.ExpiresAt>DateTimeOffset.UtcNow));Assert.False(await db.OtpChallenges.AnyAsync(x=>x.AdminUserId==user.Id&&x.ConsumedAt==null&&x.LockedAt==null&&x.ExpiresAt>DateTimeOffset.UtcNow));Assert.True(await db.EmailDeliveries.AnyAsync(x=>x.RelatedEntityId==user.Id&&x.Type==EmailDeliveryType.AdminInvitation&&x.Status==EmailDeliveryStatus.Sent));var sessionIds=await db.AdminSessions.Where(x=>x.AdminUserId==user.Id).Select(x=>x.Id).ToArrayAsync();var challengeIds=await db.OtpChallenges.Where(x=>x.AdminUserId==user.Id).Select(x=>x.Id).ToArrayAsync();var deliveryIds=await db.EmailDeliveries.Where(x=>x.RelatedEntityId==user.Id||challengeIds.Contains(x.RelatedEntityId)).Select(x=>x.Id).ToArrayAsync();await db.AuditLog.Where(x=>x.AdminUserId==user.Id||x.EntityId==user.Id||sessionIds.Contains(x.EntityId)||challengeIds.Contains(x.EntityId)||deliveryIds.Contains(x.EntityId)).ExecuteDeleteAsync();await db.EmailDeliveries.Where(x=>deliveryIds.Contains(x.Id)).ExecuteDeleteAsync();await db.AdminUsers.Where(x=>x.Id==user.Id).ExecuteDeleteAsync();Assert.False(await db.AdminUsers.AnyAsync(x=>x.Email==email));Assert.False(await db.EmailDeliveries.AnyAsync(x=>deliveryIds.Contains(x.Id)));
    }

    [IntegrationFact]
    [Trait("Category", "Integration")]
    public async Task TransactionalEmailSmoke_IsTrackedAndCleanedSafely()
    {
        await using var db = CreateContext(); var fixtures = await db.ProjectRequests.Where(x => x.Name == "Phase 2H SMTP Smoke" && x.Email == "apxtechlab@gmail.com").ToListAsync(); if (fixtures.Count == 0) return; var ids = fixtures.Select(x => x.Id).ToArray();
        var deliveries = await db.EmailDeliveries.AsNoTracking().Where(x => ids.Contains(x.RelatedEntityId)).ToListAsync(); Assert.Equal(fixtures.Count * 2, deliveries.Count); Assert.All(deliveries, x => Assert.Equal(EmailDeliveryStatus.Sent, x.Status)); Assert.Contains(deliveries, x => x.Type == EmailDeliveryType.ProjectRequestCustomerConfirmation); Assert.Contains(deliveries, x => x.Type == EmailDeliveryType.ProjectRequestInternalNotification);
        await db.AuditLog.Where(x => ids.Contains(x.EntityId)).ExecuteDeleteAsync(); await db.EmailDeliveries.Where(x => ids.Contains(x.RelatedEntityId)).ExecuteDeleteAsync(); await db.ProjectRequests.Where(x => ids.Contains(x.Id)).ExecuteDeleteAsync(); Assert.False(await db.ProjectRequests.AnyAsync(x => ids.Contains(x.Id))); Assert.False(await db.EmailDeliveries.AnyAsync(x => ids.Contains(x.RelatedEntityId)));
    }

    private static ApxDbContext CreateContext() => new(new DbContextOptionsBuilder<ApxDbContext>().UseNpgsql(Environment.GetEnvironmentVariable("APX_TEST_CONNECTION_STRING")!).Options);
    private static CreateSolutionRequest Request(Guid categoryId, string slug) => new("Integration test", slug, categoryId, null, "Temporary integration solution", "Temporary integration description", [new("Feature", null)], [], [], [], null, "quote", null, null, "COP", false, "draft", new("Integration SEO", null, ["integration"]), [], 9999);
    private static UpdateSolutionRequest Update(AdminSolutionDetailDto source, string rowVersion, string eyebrow) => new(rowVersion, source.Name, source.Slug, source.CategoryId, eyebrow, source.ShortDescription, source.Description, source.Features.Select(x => new FeatureInput(x.Title, x.Description)).ToList(), [], [], [], source.ImplementationTime, source.PriceMode, source.PriceFrom, source.PriceTo, source.Currency, source.Featured, source.Status, source.Seo is null ? null : new(source.Seo.Title, source.Seo.Description, source.Seo.Keywords), [], source.Order);
    private static async Task<HashSet<string>> ReadStringsAsync(ApxDbContext db, string sql) { var values = new HashSet<string>(StringComparer.Ordinal); var connection = db.Database.GetDbConnection(); if (connection.State != ConnectionState.Open) await connection.OpenAsync(); await using var command = connection.CreateCommand(); command.CommandText = sql; await using var reader = await command.ExecuteReaderAsync(); while (await reader.ReadAsync()) values.Add(reader.GetString(0)); return values; }
    private static async Task<string> ReadXminAsync(ApxDbContext db, Guid id) { var connection = db.Database.GetDbConnection(); if (connection.State != ConnectionState.Open) await connection.OpenAsync(); await using var command = connection.CreateCommand(); command.CommandText = "SELECT xmin::text FROM solutions WHERE id = @id"; var parameter = command.CreateParameter(); parameter.ParameterName = "id"; parameter.Value = id; command.Parameters.Add(parameter); return (string)(await command.ExecuteScalarAsync())!; }
    private static async Task CleanupAsync(IReadOnlyCollection<Guid> ids) { if (ids.Count == 0) return; await using var db = CreateContext(); await db.AuditLog.Where(x => ids.Contains(x.EntityId)).ExecuteDeleteAsync(); await db.Solutions.IgnoreQueryFilters().Where(x => ids.Contains(x.Id)).ExecuteDeleteAsync(); }
    private sealed class CapturingEmailSender : IEmailSender { public string? Code { get; private set; } public Task SendOtpAsync(Guid challengeId, string email, string code, DateTimeOffset expiresAt, CancellationToken ct) { Code = code; return Task.CompletedTask; } }
}
