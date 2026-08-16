using System.Text.Json;
using APX.Application.Catalog;
using APX.Application.Common;
using APX.Domain.Admin;
using APX.Domain.Catalog;
using APX.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace APX.Infrastructure.Catalog;

public sealed class EfCatalogRepository(ApxDbContext db) : ICatalogRepository
{
    public async Task<IReadOnlyList<CategoryListDto>> GetPublicCategoriesAsync(CancellationToken ct) => await db.ServiceCategories.AsNoTracking().Where(x => x.IsActive).OrderBy(x => x.SortOrder).ThenBy(x => x.Id).Select(x => new CategoryListDto(x.Id, x.Name, x.Slug, x.ShortDescription, x.ImageUrl, x.SortOrder)).ToListAsync(ct);
    public Task<CategoryDetailDto?> GetPublicCategoryAsync(string slug, CancellationToken ct) => db.ServiceCategories.AsNoTracking().Where(x => x.IsActive && x.Slug.ToLower() == slug).Select(x => new CategoryDetailDto(x.Id, x.Name, x.Slug, x.ShortDescription, x.ImageUrl, x.SortOrder, x.Description, x.Icon)).SingleOrDefaultAsync(ct);

    public async Task<PagedResult<SolutionCardDto>> GetPublicSolutionsAsync(PublicSolutionQuery q, CancellationToken ct)
    {
        var query = db.Solutions.AsNoTracking().Where(x => x.Status == SolutionStatus.Published && x.Category.IsActive);
        if (!string.IsNullOrWhiteSpace(q.Category)) query = query.Where(x => x.Category.Slug.ToLower() == q.Category);
        if (!string.IsNullOrWhiteSpace(q.Search)) { var pattern = $"%{q.Search.Trim()}%"; query = query.Where(x => EF.Functions.ILike(x.Name, pattern) || EF.Functions.ILike(x.ShortDescription, pattern) || x.SolutionTags.Any(t => EF.Functions.ILike(t.Tag.Name, pattern))); }
        if (q.Featured.HasValue) query = query.Where(x => x.Featured == q.Featured);
        var tags = SplitSlugs(q.Tags); if (tags.Length > 0) query = query.Where(x => x.SolutionTags.Any(t => tags.Contains(t.Tag.Slug.ToLower())));
        if (!string.IsNullOrWhiteSpace(q.UseCase)) { var slug = q.UseCase.Trim().ToLower(); query = query.Where(x => x.SolutionUseCases.Any(u => u.UseCase.Slug.ToLower() == slug)); }
        if (!string.IsNullOrWhiteSpace(q.Modality)) { var slug = q.Modality.Trim().ToLower(); query = query.Where(x => x.SolutionModalities.Any(m => m.Modality.Slug.ToLower() == slug)); }
        var total = await query.LongCountAsync(ct); query = ApplyPublicSort(query, q.Sort);
        var entities = await query.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).Include(x => x.Media).Include(x => x.SolutionTags).ThenInclude(x => x.Tag).AsSplitQuery().ToListAsync(ct);
        return new PagedResult<SolutionCardDto>(entities.Select(ToCard).ToList(), q.Page, q.PageSize, total, Pages(total, q.PageSize));
    }

    public async Task<SolutionDetailDto?> GetPublicSolutionAsync(string slug, CancellationToken ct)
    {
        var item = await DetailQuery().AsNoTracking().Where(x => x.Status == SolutionStatus.Published && x.Category.IsActive && x.Slug.ToLower() == slug).SingleOrDefaultAsync(ct);
        return item is null ? null : ToDetail(item);
    }

    public async Task<IReadOnlyList<SolutionCardDto>> GetFeaturedAsync(int limit, CancellationToken ct)
    {
        var items = await db.Solutions.AsNoTracking().Where(x => x.Status == SolutionStatus.Published && x.Featured && x.Category.IsActive).OrderBy(x => x.SortOrder).ThenBy(x => x.Id).Take(limit).Include(x => x.Media).Include(x => x.SolutionTags).ThenInclude(x => x.Tag).AsSplitQuery().ToListAsync(ct);
        return items.Select(ToCard).ToList();
    }

    public async Task<PagedResult<AdminSolutionListDto>> GetAdminSolutionsAsync(AdminSolutionQuery q, CancellationToken ct)
    {
        var query = db.Solutions.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(q.Search)) { var p = $"%{q.Search.Trim()}%"; query = query.Where(x => EF.Functions.ILike(x.Name, p) || EF.Functions.ILike(x.Slug, p)); }
        if (q.Category.HasValue) query = query.Where(x => x.CategoryId == q.Category); if (q.Featured.HasValue) query = query.Where(x => x.Featured == q.Featured);
        if (!string.IsNullOrWhiteSpace(q.Status) && TryStatus(q.Status, out var status)) query = query.Where(x => x.Status == status);
        var total = await query.LongCountAsync(ct); query = ApplyAdminSort(query, q.Sort);
        var items = await query.Skip((q.Page - 1) * q.PageSize).Take(q.PageSize).Include(x => x.Media).AsSplitQuery().ToListAsync(ct);
        return new(items.Select(x => new AdminSolutionListDto(x.Id, x.Name, x.Slug, x.CategoryId, x.Status.ToContract(), x.Featured, x.Media.Where(m => m.IsCover).OrderBy(m => m.SortOrder).Select(ToMedia).FirstOrDefault())).ToList(), q.Page, q.PageSize, total, Pages(total, q.PageSize));
    }

    public async Task<AdminSolutionDetailDto?> GetAdminSolutionAsync(Guid id, CancellationToken ct) { var item = await DetailQuery().AsNoTracking().SingleOrDefaultAsync(x => x.Id == id, ct); return item is null ? null : ToAdminDetail(item); }
    public async Task<IReadOnlyList<AdminCategoryDto>> GetAdminCategoriesAsync(CancellationToken ct) => await db.ServiceCategories.AsNoTracking().OrderBy(x => x.SortOrder).ThenBy(x => x.Id).Select(x => new AdminCategoryDto(x.Id, x.Name, x.Slug, x.ShortDescription, x.Description, x.ImageUrl, x.Icon, x.SortOrder, x.IsActive, x.Version.ToString())).ToListAsync(ct);
    public Task<bool> CategoryExistsAsync(Guid id, CancellationToken ct) => db.ServiceCategories.AnyAsync(x => x.Id == id, ct);
    public Task<bool> SolutionSlugExistsAsync(string slug, Guid? excludingId, CancellationToken ct) => db.Solutions.IgnoreQueryFilters().AnyAsync(x => x.Slug.ToLower() == slug && (!excludingId.HasValue || x.Id != excludingId), ct);
    public Task<bool> CategorySlugExistsAsync(string slug, Guid? excludingId, CancellationToken ct) => db.ServiceCategories.AnyAsync(x => x.Slug.ToLower() == slug && (!excludingId.HasValue || x.Id != excludingId), ct);

    public async Task<Result<AdminSolutionDetailDto>> CreateSolutionAsync(CreateSolutionRequest request, CancellationToken ct)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct); var now = DateTimeOffset.UtcNow;
        var entity = Solution.Create(Guid.NewGuid(), request.CategoryId, request.Name, request.Slug, request.ShortDescription, request.Description); ApplyScalar(entity, request.Eyebrow, request.ImplementationTime, request.PriceMode, request.PriceFrom, request.PriceTo, request.Currency, request.Featured, request.Order, request.Status, now); ReplaceChildren(entity, request.Features, request.TagIds, request.UseCaseIds, request.ModalityIds, request.Media, request.Seo, now);
        db.Solutions.Add(entity); AddAudit(entity.Id, "SolutionCreated", null, Snapshot(entity)); await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); return Result<AdminSolutionDetailDto>.Success((await GetAdminSolutionAsync(entity.Id, ct))!);
    }

    public async Task<Result<AdminSolutionDetailDto>> UpdateSolutionAsync(Guid id, UpdateSolutionRequest request, CancellationToken ct)
    {
        var entity = await db.Solutions.SingleOrDefaultAsync(x => x.Id == id, ct); if (entity is null) return Result<AdminSolutionDetailDto>.Failure(Errors.NotFound("solution_not_found", "Solution was not found.")); if (!uint.TryParse(request.RowVersion, out var version)) return Result<AdminSolutionDetailDto>.Failure(Errors.Validation("Invalid row version.", new Dictionary<string, string[]> { ["rowVersion"] = ["Must be an unsigned integer string."] }));
        await using var tx = await db.Database.BeginTransactionAsync(ct); var before = Snapshot(entity); db.Entry(entity).Property(x => x.Version).OriginalValue = version; entity.Name = request.Name.Trim(); entity.Slug = request.Slug; entity.CategoryId = request.CategoryId; entity.ShortDescription = request.ShortDescription.Trim(); entity.Description = request.Description.Trim(); ApplyScalar(entity, request.Eyebrow, request.ImplementationTime, request.PriceMode, request.PriceFrom, request.PriceTo, request.Currency, request.Featured, request.Order, request.Status, DateTimeOffset.UtcNow); await ClearChildrenAsync(entity, ct); ReplaceChildren(entity, request.Features, request.TagIds, request.UseCaseIds, request.ModalityIds, request.Media, request.Seo, DateTimeOffset.UtcNow); MarkChildrenAdded(entity); AddAudit(id, "SolutionUpdated", before, Snapshot(entity));
        try { await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); } catch (DbUpdateConcurrencyException) { await tx.RollbackAsync(ct); return Result<AdminSolutionDetailDto>.Failure(Errors.Concurrency("The solution was modified by another process.")); }
        return Result<AdminSolutionDetailDto>.Success((await GetAdminSolutionAsync(id, ct))!);
    }

    public async Task<Result> DeleteSolutionAsync(Guid id, CancellationToken ct)
    {
        var entity = await db.Solutions.SingleOrDefaultAsync(x => x.Id == id, ct); if (entity is null) return Result.Failure(Errors.NotFound("solution_not_found", "Solution was not found.")); var before = Snapshot(entity); entity.DeletedAt = entity.UpdatedAt = DateTimeOffset.UtcNow; AddAudit(id, "SolutionDeleted", before, Snapshot(entity)); await db.SaveChangesAsync(ct); return Result.Success();
    }

    public async Task<Result<AdminSolutionDetailDto>> DuplicateSolutionAsync(Guid id, DuplicateSolutionRequest request, CancellationToken ct)
    {
        var source = await DetailQuery().AsNoTracking().SingleOrDefaultAsync(x => x.Id == id, ct); if (source is null) return Result<AdminSolutionDetailDto>.Failure(Errors.NotFound("solution_not_found", "Solution was not found.")); var slug = string.IsNullOrWhiteSpace(request.Slug) ? await NextCopySlugAsync(source.Slug, ct) : request.Slug.Trim().ToLowerInvariant(); if (await SolutionSlugExistsAsync(slug, null, ct)) return Result<AdminSolutionDetailDto>.Failure(Errors.Conflict("solution_slug_conflict", "A solution with this slug already exists."));
        await using var tx = await db.Database.BeginTransactionAsync(ct); var now = DateTimeOffset.UtcNow; var copy = Solution.Create(Guid.NewGuid(), source.CategoryId, request.Name?.Trim() ?? $"{source.Name} (copy)", slug, source.ShortDescription, source.Description); ApplyScalar(copy, source.Eyebrow, source.ImplementationTime, source.PriceMode.ToContract(), source.PriceFrom, source.PriceTo, source.Currency, false, source.SortOrder, "draft", now); ReplaceChildren(copy, source.Features.OrderBy(x => x.SortOrder).Select(x => new FeatureInput(x.Title, x.Description)).ToList(), source.SolutionTags.Select(x => x.TagId).ToList(), source.SolutionUseCases.Select(x => x.UseCaseId).ToList(), source.SolutionModalities.Select(x => x.ModalityId).ToList(), request.IncludeMedia ? source.Media.OrderBy(x => x.SortOrder).Select(x => new MediaInput(x.PublicUrl, x.Alt, x.MediaType.ToContract(), x.SortOrder, x.IsCover, x.StorageKey, x.MimeType, x.Width, x.Height, x.Bytes)).ToList() : null, source.Seo is null ? null : new SeoInput(source.Seo.MetaTitle, source.Seo.MetaDescription, source.Seo.Keywords), now); db.Solutions.Add(copy); AddAudit(copy.Id, "SolutionDuplicated", null, Snapshot(copy)); await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); return Result<AdminSolutionDetailDto>.Success((await GetAdminSolutionAsync(copy.Id, ct))!);
    }

    public async Task<Result<AdminSolutionDetailDto>> SetPublishedAsync(Guid id, bool published, CancellationToken ct)
    {
        var entity = await db.Solutions.Include(x => x.Category).SingleOrDefaultAsync(x => x.Id == id, ct); if (entity is null) return Result<AdminSolutionDetailDto>.Failure(Errors.NotFound("solution_not_found", "Solution was not found.")); if (published && (string.IsNullOrWhiteSpace(entity.Name) || string.IsNullOrWhiteSpace(entity.Slug) || string.IsNullOrWhiteSpace(entity.ShortDescription) || string.IsNullOrWhiteSpace(entity.Description) || entity.Category is null)) return Result<AdminSolutionDetailDto>.Failure(Errors.Validation("Solution is incomplete for publication.", new Dictionary<string, string[]>())); var before = Snapshot(entity); entity.SetStatus(published ? SolutionStatus.Published : SolutionStatus.Draft); AddAudit(id, published ? "SolutionPublished" : "SolutionUnpublished", before, Snapshot(entity)); await db.SaveChangesAsync(ct); return Result<AdminSolutionDetailDto>.Success((await GetAdminSolutionAsync(id, ct))!);
    }

    public async Task<Result<AdminCategoryDto>> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken ct) { var now = DateTimeOffset.UtcNow; var item = new ServiceCategory { Id = Guid.NewGuid(), Name = request.Name.Trim(), Slug = request.Slug, ShortDescription = request.ShortDescription.Trim(), Description = request.Description, ImageUrl = request.Image, Icon = request.Icon, SortOrder = request.Order, IsActive = request.IsActive, CreatedAt = now, UpdatedAt = now }; db.ServiceCategories.Add(item); AddAudit(item.Id, "CategoryCreated", null, Snapshot(item)); await db.SaveChangesAsync(ct); return Result<AdminCategoryDto>.Success(ToAdminCategory(item)); }
    public async Task<Result<AdminCategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct) { var item = await db.ServiceCategories.SingleOrDefaultAsync(x => x.Id == id, ct); if (item is null) return Result<AdminCategoryDto>.Failure(Errors.NotFound("category_not_found", "Category was not found.")); if (!uint.TryParse(request.RowVersion, out var version)) return Result<AdminCategoryDto>.Failure(Errors.Validation("Invalid row version.", new Dictionary<string, string[]>())); var before = Snapshot(item); db.Entry(item).Property(x => x.Version).OriginalValue = version; item.Name = request.Name.Trim(); item.Slug = request.Slug; item.ShortDescription = request.ShortDescription.Trim(); item.Description = request.Description; item.ImageUrl = request.Image; item.Icon = request.Icon; item.SortOrder = request.Order; item.IsActive = request.IsActive; item.UpdatedAt = DateTimeOffset.UtcNow; AddAudit(id, "CategoryUpdated", before, Snapshot(item)); try { await db.SaveChangesAsync(ct); } catch (DbUpdateConcurrencyException) { return Result<AdminCategoryDto>.Failure(Errors.Concurrency("The category was modified by another process.")); } return Result<AdminCategoryDto>.Success(ToAdminCategory(item)); }
    public async Task<Result> DeleteCategoryAsync(Guid id, CancellationToken ct) { var item = await db.ServiceCategories.SingleOrDefaultAsync(x => x.Id == id, ct); if (item is null) return Result.Failure(Errors.NotFound("category_not_found", "Category was not found.")); if (await db.Solutions.IgnoreQueryFilters().AnyAsync(x => x.CategoryId == id, ct)) return Result.Failure(Errors.Conflict("category_has_solutions", "Category cannot be deleted while it has solutions.")); db.ServiceCategories.Remove(item); AddAudit(id, "CategoryDeleted", Snapshot(item), null); await db.SaveChangesAsync(ct); return Result.Success(); }
    public async Task<Result> ReorderCategoriesAsync(ReorderCategoriesRequest request, CancellationToken ct) { var ids = request.Items.Select(x => x.Id).ToArray(); if (ids.Distinct().Count() != ids.Length) return Result.Failure(Errors.Validation("Category IDs must be unique.", new Dictionary<string, string[]>())); var items = await db.ServiceCategories.Where(x => ids.Contains(x.Id)).ToListAsync(ct); if (items.Count != ids.Length) return Result.Failure(Errors.Validation("One or more category IDs are invalid.", new Dictionary<string, string[]>())); await using var tx = await db.Database.BeginTransactionAsync(ct); foreach (var item in items) { item.SortOrder = request.Items.Single(x => x.Id == item.Id).Order; item.UpdatedAt = DateTimeOffset.UtcNow; } AddAudit(Guid.Empty, "CategoryReordered", null, JsonSerializer.Serialize(request.Items)); await db.SaveChangesAsync(ct); await tx.CommitAsync(ct); return Result.Success(); }

    private IQueryable<Solution> DetailQuery() => db.Solutions.Include(x => x.Media).Include(x => x.Features).Include(x => x.SolutionTags).ThenInclude(x => x.Tag).Include(x => x.SolutionUseCases).ThenInclude(x => x.UseCase).Include(x => x.SolutionModalities).ThenInclude(x => x.Modality).Include(x => x.RelatedSolutions).Include(x => x.Seo).AsSplitQuery();
    private static IQueryable<Solution> ApplyPublicSort(IQueryable<Solution> q, string sort) => sort.ToLowerInvariant() switch { "featured" => q.OrderByDescending(x => x.Featured).ThenBy(x => x.SortOrder).ThenBy(x => x.Id), "name" => q.OrderBy(x => x.Name).ThenBy(x => x.Id), "newest" => q.OrderByDescending(x => x.PublishedAt).ThenBy(x => x.Id), _ => q.OrderBy(x => x.SortOrder).ThenBy(x => x.Id) };
    private static IQueryable<Solution> ApplyAdminSort(IQueryable<Solution> q, string sort) => sort.ToLowerInvariant() switch { "name" => q.OrderBy(x => x.Name).ThenBy(x => x.Id), "newest" => q.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.Id), "featured" => q.OrderByDescending(x => x.Featured).ThenBy(x => x.SortOrder).ThenBy(x => x.Id), _ => q.OrderBy(x => x.SortOrder).ThenBy(x => x.Id) };
    private static int Pages(long total, int size) => (int)Math.Ceiling(total / (double)size); private static string[] SplitSlugs(string? value) => string.IsNullOrWhiteSpace(value) ? [] : value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Select(x => x.ToLowerInvariant()).Distinct().ToArray();
    private static MediaDto ToMedia(SolutionMedia x) => new(x.Id, x.PublicUrl, x.Alt, x.MediaType.ToContract(), x.SortOrder, x.IsCover, x.StorageKey, x.MimeType, x.Width, x.Height, x.Bytes);
    private static SolutionCardDto ToCard(Solution x) => new(x.Id, x.CategoryId, x.Name, x.Slug, x.Eyebrow, x.ShortDescription, x.Media.Where(m => m.IsCover).OrderBy(m => m.SortOrder).Select(ToMedia).FirstOrDefault(), x.SolutionTags.Select(t => t.Tag.Slug).Order().ToList(), x.Featured);
    private static SolutionDetailDto ToDetail(Solution x) => new(x.Id, x.CategoryId, x.Name, x.Slug, x.Eyebrow, x.ShortDescription, x.Description, x.Media.OrderBy(m => m.SortOrder).Select(ToMedia).ToList(), x.Features.OrderBy(f => f.SortOrder).Select(f => new FeatureDto(f.Id, f.Title, f.Description)).ToList(), x.SolutionUseCases.Select(u => u.UseCase.Slug).Order().ToList(), x.SolutionTags.Select(t => t.Tag.Slug).Order().ToList(), x.SolutionModalities.Select(m => m.Modality.Slug).Order().ToList(), x.ImplementationTime, x.PriceMode.ToContract(), x.PriceFrom, x.PriceTo, x.Currency, x.Featured, x.Status.ToContract(), x.PublishedAt, x.RelatedSolutions.OrderBy(r => r.SortOrder).Select(r => r.RelatedSolutionId).ToList(), x.Seo is null ? null : new SeoDto(x.Seo.MetaTitle, x.Seo.MetaDescription, x.Seo.Keywords), x.SortOrder);
    private static AdminSolutionDetailDto ToAdminDetail(Solution x) { var d = ToDetail(x); return new(d.Id, d.CategoryId, d.Name, d.Slug, d.Eyebrow, d.ShortDescription, d.Description, d.Gallery, d.Features, d.UseCases, d.Tags, d.Modalities, d.ImplementationTime, d.PriceMode, d.PriceFrom, d.PriceTo, d.Currency, d.Featured, d.Status, d.PublishedAt, d.RelatedSolutionIds, d.Seo, d.Order, x.Version.ToString()); }
    private static AdminCategoryDto ToAdminCategory(ServiceCategory x) => new(x.Id, x.Name, x.Slug, x.ShortDescription, x.Description, x.ImageUrl, x.Icon, x.SortOrder, x.IsActive, x.Version.ToString());
    private static bool TryStatus(string value, out SolutionStatus status) { try { status = CatalogEnumMappings.ParseSolutionStatus(value.ToLowerInvariant()); return true; } catch { status = default; return false; } }
    private static void ApplyScalar(Solution x, string? eyebrow, string? implementation, string priceMode, decimal? from, decimal? to, string? currency, bool featured, int order, string status, DateTimeOffset now) { x.Eyebrow = eyebrow; x.ImplementationTime = implementation; x.PriceMode = CatalogEnumMappings.ParsePriceMode(priceMode); x.PriceFrom = from; x.PriceTo = to; x.Currency = currency; x.Featured = featured; x.SortOrder = order; x.SetStatus(CatalogEnumMappings.ParseSolutionStatus(status), now); }
    private async Task ClearChildrenAsync(Solution x, CancellationToken ct)
    {
        await db.SolutionFeatures.Where(item => item.SolutionId == x.Id).ExecuteDeleteAsync(ct);
        await db.SolutionMedia.Where(item => item.SolutionId == x.Id).ExecuteDeleteAsync(ct);
        await db.Set<SolutionTag>().Where(item => item.SolutionId == x.Id).ExecuteDeleteAsync(ct);
        await db.Set<SolutionUseCase>().Where(item => item.SolutionId == x.Id).ExecuteDeleteAsync(ct);
        await db.Set<SolutionModality>().Where(item => item.SolutionId == x.Id).ExecuteDeleteAsync(ct);
        await db.Set<SolutionSeo>().Where(item => item.SolutionId == x.Id).ExecuteDeleteAsync(ct);
        var trackedChildren = x.Features.Cast<object>().Concat(x.Media).Concat(x.SolutionTags).Concat(x.SolutionUseCases).Concat(x.SolutionModalities).ToArray();
        var trackedSeo = x.Seo;
        x.Features.Clear(); x.Media.Clear(); x.SolutionTags.Clear(); x.SolutionUseCases.Clear(); x.SolutionModalities.Clear(); x.Seo = null;
        foreach (var item in trackedChildren) db.Entry(item).State = EntityState.Detached;
        if (trackedSeo is not null) db.Entry(trackedSeo).State = EntityState.Detached;
    }
    private static void ReplaceChildren(Solution x, IReadOnlyList<FeatureInput>? features, IReadOnlyList<Guid>? tagIds, IReadOnlyList<Guid>? useCaseIds, IReadOnlyList<Guid>? modalityIds, IReadOnlyList<MediaInput>? media, SeoInput? seo, DateTimeOffset now) { foreach (var (f, i) in (features ?? []).Select((v, i) => (v, i))) x.Features.Add(new SolutionFeature { Id = Guid.NewGuid(), Title = f.Title.Trim(), Description = f.Description, SortOrder = i }); foreach (var id in (tagIds ?? []).Distinct()) x.SolutionTags.Add(new SolutionTag { TagId = id }); foreach (var id in (useCaseIds ?? []).Distinct()) x.SolutionUseCases.Add(new SolutionUseCase { UseCaseId = id }); foreach (var id in (modalityIds ?? []).Distinct()) x.SolutionModalities.Add(new SolutionModality { ModalityId = id }); foreach (var m in media ?? []) x.Media.Add(new SolutionMedia { Id = Guid.NewGuid(), PublicUrl = m.Url, Alt = m.Alt, MediaType = CatalogEnumMappings.ParseMediaType(m.Type), SortOrder = m.Order, IsCover = m.IsCover, StorageKey = m.StorageKey, MimeType = m.MimeType, Width = m.Width, Height = m.Height, Bytes = m.Bytes, CreatedAt = now }); if (seo is not null) x.Seo = new SolutionSeo { MetaTitle = seo.Title, MetaDescription = seo.Description, Keywords = seo.Keywords?.ToArray() ?? [] }; }
    private void MarkChildrenAdded(Solution x) { db.SolutionFeatures.AddRange(x.Features); db.SolutionMedia.AddRange(x.Media); db.Set<SolutionTag>().AddRange(x.SolutionTags); db.Set<SolutionUseCase>().AddRange(x.SolutionUseCases); db.Set<SolutionModality>().AddRange(x.SolutionModalities); if (x.Seo is not null) db.Set<SolutionSeo>().Add(x.Seo); }
    private void AddAudit(Guid id, string action, string? before, string? after) => db.AuditLog.Add(new AuditEntry { Id = Guid.NewGuid(), EntityType = action.StartsWith("Category") ? "ServiceCategory" : "Solution", EntityId = id, Action = action, BeforeJson = before, AfterJson = after, CreatedAt = DateTimeOffset.UtcNow });
    private static string Snapshot(object value) => JsonSerializer.Serialize(value, new JsonSerializerOptions { ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles });
    private async Task<string> NextCopySlugAsync(string original, CancellationToken ct) { var candidate = $"{original}-copy"; var number = 2; while (await SolutionSlugExistsAsync(candidate, null, ct)) candidate = $"{original}-copy-{number++}"; return candidate; }
}
