using APX.Application.Common;

namespace APX.Application.Catalog;

public sealed class CatalogQueryService(ICatalogRepository repository)
{
    public Task<IReadOnlyList<CategoryListDto>> GetCategoriesAsync(CancellationToken ct) => repository.GetPublicCategoriesAsync(ct);
    public async Task<Result<CategoryDetailDto>> GetCategoryAsync(string slug, CancellationToken ct) => await repository.GetPublicCategoryAsync(NormalizeSlug(slug), ct) is { } item ? Result<CategoryDetailDto>.Success(item) : Result<CategoryDetailDto>.Failure(Errors.NotFound("category_not_found", "Category was not found."));
    public async Task<Result<PagedResult<SolutionCardDto>>> GetSolutionsAsync(PublicSolutionQuery query, CancellationToken ct)
    {
        var paging = ValidatePaging(query.Page, query.PageSize); if (paging is not null) return Result<PagedResult<SolutionCardDto>>.Failure(paging);
        if (!new[] { "order", "featured", "name", "newest" }.Contains(query.Sort, StringComparer.OrdinalIgnoreCase)) return Result<PagedResult<SolutionCardDto>>.Failure(Errors.Validation("Invalid sort.", new Dictionary<string, string[]> { ["sort"] = ["Use order, featured, name or newest."] }));
        return Result<PagedResult<SolutionCardDto>>.Success(await repository.GetPublicSolutionsAsync(query with { Category = NormalizeOptionalSlug(query.Category) }, ct));
    }
    public async Task<Result<SolutionDetailDto>> GetSolutionAsync(string slug, CancellationToken ct) => await repository.GetPublicSolutionAsync(NormalizeSlug(slug), ct) is { } item ? Result<SolutionDetailDto>.Success(item) : Result<SolutionDetailDto>.Failure(Errors.NotFound("solution_not_found", "Solution was not found."));
    public Task<IReadOnlyList<SolutionCardDto>> GetFeaturedAsync(CancellationToken ct) => repository.GetFeaturedAsync(8, ct);
    private static AppError? ValidatePaging(int page, int size) => page < 1 || size is < 1 or > 100 ? Errors.Validation("Invalid pagination.", new Dictionary<string, string[]> { ["page"] = ["Page must be at least 1."], ["pageSize"] = ["Page size must be between 1 and 100."] }) : null;
    internal static string NormalizeSlug(string value) => value.Trim().ToLowerInvariant();
    internal static string? NormalizeOptionalSlug(string? value) => string.IsNullOrWhiteSpace(value) ? null : NormalizeSlug(value);
}

public sealed class AdminSolutionService(ICatalogRepository repository)
{
    public async Task<Result<PagedResult<AdminSolutionListDto>>> GetAsync(AdminSolutionQuery query, CancellationToken ct) => query.Page < 1 || query.PageSize is < 1 or > 100 ? Result<PagedResult<AdminSolutionListDto>>.Failure(Errors.Validation("Invalid pagination.", new Dictionary<string, string[]>())) : Result<PagedResult<AdminSolutionListDto>>.Success(await repository.GetAdminSolutionsAsync(query, ct));
    public async Task<Result<AdminSolutionDetailDto>> GetByIdAsync(Guid id, CancellationToken ct) => await repository.GetAdminSolutionAsync(id, ct) is { } item ? Result<AdminSolutionDetailDto>.Success(item) : Result<AdminSolutionDetailDto>.Failure(Errors.NotFound("solution_not_found", "Solution was not found."));
    public async Task<Result<AdminSolutionDetailDto>> CreateAsync(CreateSolutionRequest request, CancellationToken ct) { var error = await ValidateAsync(request.Name, request.Slug, request.CategoryId, request.ShortDescription, request.Description, request.PriceMode, request.PriceFrom, request.PriceTo, request.Currency, request.Status, null, ct); return error is null ? await repository.CreateSolutionAsync(request with { Slug = CatalogQueryService.NormalizeSlug(request.Slug), Currency = request.Currency?.ToUpperInvariant() }, ct) : Result<AdminSolutionDetailDto>.Failure(error); }
    public async Task<Result<AdminSolutionDetailDto>> UpdateAsync(Guid id, UpdateSolutionRequest request, CancellationToken ct) { if (string.IsNullOrWhiteSpace(request.RowVersion)) return Result<AdminSolutionDetailDto>.Failure(Errors.Validation("Row version is required.", new Dictionary<string, string[]> { ["rowVersion"] = ["Required."] })); var error = await ValidateAsync(request.Name, request.Slug, request.CategoryId, request.ShortDescription, request.Description, request.PriceMode, request.PriceFrom, request.PriceTo, request.Currency, request.Status, id, ct); return error is null ? await repository.UpdateSolutionAsync(id, request with { Slug = CatalogQueryService.NormalizeSlug(request.Slug), Currency = request.Currency?.ToUpperInvariant() }, ct) : Result<AdminSolutionDetailDto>.Failure(error); }
    public Task<Result> DeleteAsync(Guid id, CancellationToken ct) => repository.DeleteSolutionAsync(id, ct);
    public Task<Result<AdminSolutionDetailDto>> DuplicateAsync(Guid id, DuplicateSolutionRequest request, CancellationToken ct) => repository.DuplicateSolutionAsync(id, request, ct);
    public Task<Result<AdminSolutionDetailDto>> PublishAsync(Guid id, bool publish, CancellationToken ct) => repository.SetPublishedAsync(id, publish, ct);
    private async Task<AppError?> ValidateAsync(string name, string slug, Guid categoryId, string shortDescription, string description, string priceMode, decimal? from, decimal? to, string? currency, string status, Guid? excludingId, CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(name)) errors["name"] = ["Name is required."]; if (string.IsNullOrWhiteSpace(slug)) errors["slug"] = ["Slug is required."]; if (string.IsNullOrWhiteSpace(shortDescription)) errors["shortDescription"] = ["Short description is required."]; if (!new[] { "quote", "startingAt", "range", "fixed", "contact" }.Contains(priceMode)) errors["priceMode"] = ["Invalid price mode."]; if (from < 0) errors["priceFrom"] = ["Must be non-negative."]; if (to.HasValue && from.HasValue && to < from) errors["priceTo"] = ["Must be greater than or equal to priceFrom."]; if (currency is not null && currency.Trim().Length != 3) errors["currency"] = ["Must contain 3 characters."]; if (!new[] { "draft", "published", "archived" }.Contains(status)) errors["status"] = ["Invalid status."];
        if (errors.Count > 0) return Errors.Validation("Solution validation failed.", errors); if (!await repository.CategoryExistsAsync(categoryId, ct)) return Errors.Validation("Category is invalid.", new Dictionary<string, string[]> { ["categoryId"] = ["Category does not exist."] }); if (await repository.SolutionSlugExistsAsync(CatalogQueryService.NormalizeSlug(slug), excludingId, ct)) return Errors.Conflict("solution_slug_conflict", "A solution with this slug already exists."); return null;
    }
}

public sealed class AdminCategoryService(ICatalogRepository repository)
{
    public Task<IReadOnlyList<AdminCategoryDto>> GetAsync(CancellationToken ct) => repository.GetAdminCategoriesAsync(ct);
    public async Task<Result<AdminCategoryDto>> CreateAsync(CreateCategoryRequest request, CancellationToken ct) { var error = await ValidateAsync(request.Name, request.Slug, request.ShortDescription, request.Order, null, ct); return error is null ? await repository.CreateCategoryAsync(request with { Slug = CatalogQueryService.NormalizeSlug(request.Slug) }, ct) : Result<AdminCategoryDto>.Failure(error); }
    public async Task<Result<AdminCategoryDto>> UpdateAsync(Guid id, UpdateCategoryRequest request, CancellationToken ct) { if (string.IsNullOrWhiteSpace(request.RowVersion)) return Result<AdminCategoryDto>.Failure(Errors.Validation("Row version is required.", new Dictionary<string, string[]> { ["rowVersion"] = ["Required."] })); var error = await ValidateAsync(request.Name, request.Slug, request.ShortDescription, request.Order, id, ct); return error is null ? await repository.UpdateCategoryAsync(id, request with { Slug = CatalogQueryService.NormalizeSlug(request.Slug) }, ct) : Result<AdminCategoryDto>.Failure(error); }
    public Task<Result> DeleteAsync(Guid id, CancellationToken ct) => repository.DeleteCategoryAsync(id, ct);
    public Task<Result> ReorderAsync(ReorderCategoriesRequest request, CancellationToken ct) => request.Items.Count == 0 || request.Items.Any(x => x.Order < 0) ? Task.FromResult(Result.Failure(Errors.Validation("Invalid reorder request.", new Dictionary<string, string[]> { ["items"] = ["Items are required and orders must be non-negative."] }))) : repository.ReorderCategoriesAsync(request, ct);
    private async Task<AppError?> ValidateAsync(string name, string slug, string shortDescription, int order, Guid? excludingId, CancellationToken ct) { var errors = new Dictionary<string, string[]>(); if (string.IsNullOrWhiteSpace(name)) errors["name"] = ["Name is required."]; if (string.IsNullOrWhiteSpace(slug)) errors["slug"] = ["Slug is required."]; if (string.IsNullOrWhiteSpace(shortDescription)) errors["shortDescription"] = ["Short description is required."]; if (order < 0) errors["order"] = ["Must be non-negative."]; if (errors.Count > 0) return Errors.Validation("Category validation failed.", errors); return await repository.CategorySlugExistsAsync(CatalogQueryService.NormalizeSlug(slug), excludingId, ct) ? Errors.Conflict("category_slug_conflict", "A category with this slug already exists.") : null; }
}
