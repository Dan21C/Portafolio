using APX.Application.Catalog;
using APX.Application.Common;

namespace APX.Tests;

public sealed class CatalogApplicationTests
{
    [Fact]
    public async Task PublicPaging_RejectsPageSizeAboveLimit()
    {
        var service = new CatalogQueryService(new FakeCatalogRepository());
        var result = await service.GetSolutionsAsync(new PublicSolutionQuery(null, null, null, null, null, null, "order", 1, 101), default);
        Assert.False(result.Succeeded); Assert.Equal(ErrorType.Validation, result.Error!.Type);
    }

    [Fact]
    public async Task PublicDetail_ReturnsNotFound()
    {
        var result = await new CatalogQueryService(new FakeCatalogRepository()).GetSolutionAsync("missing", default);
        Assert.False(result.Succeeded); Assert.Equal("solution_not_found", result.Error!.Code);
    }

    [Fact]
    public async Task CreateSolution_RejectsInvalidPricesAndCurrency()
    {
        var request = ValidSolution() with { PriceFrom = -1, PriceTo = -2, Currency = "CO" };
        var result = await new AdminSolutionService(new FakeCatalogRepository()).CreateAsync(request, default);
        Assert.False(result.Succeeded); Assert.Contains("priceFrom", result.Error!.Errors!.Keys); Assert.Contains("currency", result.Error.Errors.Keys);
    }

    [Fact]
    public async Task CreateSolution_ReturnsSlugConflict()
    {
        var result = await new AdminSolutionService(new FakeCatalogRepository { SlugExists = true }).CreateAsync(ValidSolution(), default);
        Assert.False(result.Succeeded); Assert.Equal("solution_slug_conflict", result.Error!.Code);
    }

    [Fact]
    public async Task UpdateSolution_RequiresRowVersion()
    {
        var source = ValidSolution();
        var request = new UpdateSolutionRequest("", source.Name, source.Slug, source.CategoryId, source.Eyebrow, source.ShortDescription, source.Description, source.Features, source.UseCaseIds, source.TagIds, source.ModalityIds, source.ImplementationTime, source.PriceMode, source.PriceFrom, source.PriceTo, source.Currency, source.Featured, source.Status, source.Seo, source.Media, source.Order);
        var result = await new AdminSolutionService(new FakeCatalogRepository()).UpdateAsync(Guid.NewGuid(), request, default);
        Assert.False(result.Succeeded); Assert.Equal(ErrorType.Validation, result.Error!.Type);
    }

    [Fact]
    public async Task DeleteCategory_ForwardsAssociationConflict()
    {
        var result = await new AdminCategoryService(new FakeCatalogRepository { DeleteCategoryResult = Result.Failure(Errors.Conflict("category_has_solutions", "Has solutions.")) }).DeleteAsync(Guid.NewGuid(), default);
        Assert.False(result.Succeeded); Assert.Equal("category_has_solutions", result.Error!.Code);
    }

    [Fact]
    public async Task Update_ForwardsConcurrencyConflict()
    {
        var source = ValidSolution(); var request = new UpdateSolutionRequest("1", source.Name, source.Slug, source.CategoryId, source.Eyebrow, source.ShortDescription, source.Description, source.Features, source.UseCaseIds, source.TagIds, source.ModalityIds, source.ImplementationTime, source.PriceMode, source.PriceFrom, source.PriceTo, source.Currency, source.Featured, source.Status, source.Seo, source.Media, source.Order);
        var result = await new AdminSolutionService(new FakeCatalogRepository { UpdateResult = Result<AdminSolutionDetailDto>.Failure(Errors.Concurrency("Changed.")) }).UpdateAsync(Guid.NewGuid(), request, default);
        Assert.False(result.Succeeded); Assert.Equal("concurrency_conflict", result.Error!.Code);
    }

    private static CreateSolutionRequest ValidSolution() => new("Name", "valid-slug", Guid.NewGuid(), null, "Short", "Description", [], [], [], [], null, "quote", null, null, "COP", false, "draft", null, [], 0);

    private sealed class FakeCatalogRepository : ICatalogRepository
    {
        public bool SlugExists { get; init; }
        public Result DeleteCategoryResult { get; init; } = Result.Success();
        public Result<AdminSolutionDetailDto> UpdateResult { get; init; } = Result<AdminSolutionDetailDto>.Failure(Errors.NotFound("unused", "unused"));
        public Task<bool> CategoryExistsAsync(Guid id, CancellationToken ct) => Task.FromResult(true);
        public Task<bool> SolutionSlugExistsAsync(string slug, Guid? id, CancellationToken ct) => Task.FromResult(SlugExists);
        public Task<bool> CategorySlugExistsAsync(string slug, Guid? id, CancellationToken ct) => Task.FromResult(SlugExists);
        public Task<Result<AdminSolutionDetailDto>> UpdateSolutionAsync(Guid id, UpdateSolutionRequest request, CancellationToken ct) => Task.FromResult(UpdateResult);
        public Task<Result> DeleteCategoryAsync(Guid id, CancellationToken ct) => Task.FromResult(DeleteCategoryResult);
        public Task<CategoryDetailDto?> GetPublicCategoryAsync(string slug, CancellationToken ct) => Task.FromResult<CategoryDetailDto?>(null);
        public Task<SolutionDetailDto?> GetPublicSolutionAsync(string slug, CancellationToken ct) => Task.FromResult<SolutionDetailDto?>(null);
        public Task<PagedResult<SolutionCardDto>> GetPublicSolutionsAsync(PublicSolutionQuery q, CancellationToken ct) => Task.FromResult(new PagedResult<SolutionCardDto>([], q.Page, q.PageSize, 0, 0));
        public Task<IReadOnlyList<CategoryListDto>> GetPublicCategoriesAsync(CancellationToken ct) => Task.FromResult<IReadOnlyList<CategoryListDto>>([]);
        public Task<IReadOnlyList<SolutionCardDto>> GetFeaturedAsync(int limit, CancellationToken ct) => Task.FromResult<IReadOnlyList<SolutionCardDto>>([]);
        public Task<PagedResult<AdminSolutionListDto>> GetAdminSolutionsAsync(AdminSolutionQuery q, CancellationToken ct) => Task.FromResult(new PagedResult<AdminSolutionListDto>([], q.Page, q.PageSize, 0, 0));
        public Task<AdminSolutionDetailDto?> GetAdminSolutionAsync(Guid id, CancellationToken ct) => Task.FromResult<AdminSolutionDetailDto?>(null);
        public Task<IReadOnlyList<AdminCategoryDto>> GetAdminCategoriesAsync(CancellationToken ct) => Task.FromResult<IReadOnlyList<AdminCategoryDto>>([]);
        public Task<Result<AdminSolutionDetailDto>> CreateSolutionAsync(CreateSolutionRequest r, CancellationToken ct) => Task.FromResult(UpdateResult);
        public Task<Result> DeleteSolutionAsync(Guid id, CancellationToken ct) => Task.FromResult(Result.Success());
        public Task<Result<AdminSolutionDetailDto>> DuplicateSolutionAsync(Guid id, DuplicateSolutionRequest r, CancellationToken ct) => Task.FromResult(UpdateResult);
        public Task<Result<AdminSolutionDetailDto>> SetPublishedAsync(Guid id, bool p, CancellationToken ct) => Task.FromResult(UpdateResult);
        public Task<Result<AdminCategoryDto>> CreateCategoryAsync(CreateCategoryRequest r, CancellationToken ct) => Task.FromResult(Result<AdminCategoryDto>.Failure(Errors.NotFound("unused", "unused")));
        public Task<Result<AdminCategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest r, CancellationToken ct) => Task.FromResult(Result<AdminCategoryDto>.Failure(Errors.NotFound("unused", "unused")));
        public Task<Result> ReorderCategoriesAsync(ReorderCategoriesRequest r, CancellationToken ct) => Task.FromResult(Result.Success());
    }
}
