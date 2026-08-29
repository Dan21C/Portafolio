using APX.Application.Common;

namespace APX.Application.Catalog;

public interface ICatalogRepository
{
    Task<IReadOnlyList<CategoryListDto>> GetPublicCategoriesAsync(CancellationToken cancellationToken);
    Task<CategoryDetailDto?> GetPublicCategoryAsync(string slug, CancellationToken cancellationToken);
    Task<PagedResult<SolutionCardDto>> GetPublicSolutionsAsync(PublicSolutionQuery query, CancellationToken cancellationToken);
    Task<SolutionDetailDto?> GetPublicSolutionAsync(string slug, CancellationToken cancellationToken);
    Task<IReadOnlyList<SolutionCardDto>> GetFeaturedAsync(int limit, CancellationToken cancellationToken);
    Task<PagedResult<AdminSolutionListDto>> GetAdminSolutionsAsync(AdminSolutionQuery query, CancellationToken cancellationToken);
    Task<AdminSolutionDetailDto?> GetAdminSolutionAsync(Guid id, CancellationToken cancellationToken);
    Task<IReadOnlyList<AdminCategoryDto>> GetAdminCategoriesAsync(CancellationToken cancellationToken);
    Task<bool> CategoryExistsAsync(Guid id, CancellationToken cancellationToken);
    Task<bool> SolutionSlugExistsAsync(string slug, Guid? excludingId, CancellationToken cancellationToken);
    Task<bool> CategorySlugExistsAsync(string slug, Guid? excludingId, CancellationToken cancellationToken);
    Task<Result<AdminSolutionDetailDto>> CreateSolutionAsync(CreateSolutionRequest request, CancellationToken cancellationToken);
    Task<Result<AdminSolutionDetailDto>> UpdateSolutionAsync(Guid id, UpdateSolutionRequest request, CancellationToken cancellationToken);
    Task<Result> DeleteSolutionAsync(Guid id, CancellationToken cancellationToken);
    Task<Result<AdminSolutionDetailDto>> DuplicateSolutionAsync(Guid id, DuplicateSolutionRequest request, CancellationToken cancellationToken);
    Task<Result<AdminSolutionDetailDto>> SetPublishedAsync(Guid id, bool published, CancellationToken cancellationToken);
    Task<Result<AdminCategoryDto>> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken cancellationToken);
    Task<Result<AdminCategoryDto>> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request, CancellationToken cancellationToken);
    Task<Result> DeleteCategoryAsync(Guid id, CancellationToken cancellationToken);
    Task<Result> ReorderCategoriesAsync(ReorderCategoriesRequest request, CancellationToken cancellationToken);
}

public interface IMediaRepository
{
    Task<bool> SolutionExistsAsync(Guid solutionId, CancellationToken cancellationToken);
    Task<MediaDto?> GetMediaAsync(Guid solutionId, Guid mediaId, CancellationToken cancellationToken);
    Task<Result<MediaDto>> CreateMediaAsync(CreateStoredMediaRequest request, CancellationToken cancellationToken);
    Task<Result<MediaDto>> UpdateMediaAsync(Guid solutionId, Guid mediaId, UpdateMediaRequest request, CancellationToken cancellationToken);
    Task<Result<MediaDto>> SetCoverAsync(Guid solutionId, Guid mediaId, CancellationToken cancellationToken);
    Task<Result> DeleteMediaAsync(Guid solutionId, Guid mediaId, CancellationToken cancellationToken);
}

public interface IObjectStorage
{
    Task<ObjectStorageUpload> UploadAsync(string key, Stream content, string contentType, CancellationToken cancellationToken);
    Task DeleteAsync(string key, CancellationToken cancellationToken);
}
