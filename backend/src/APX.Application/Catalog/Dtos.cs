namespace APX.Application.Catalog;

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, long TotalItems, int TotalPages);
public sealed record MediaDto(Guid Id, string Url, string Alt, string Type, int Order, bool IsCover, string? StorageKey, string? MimeType, int? Width, int? Height, long? Bytes);
public sealed record CategoryListDto(Guid Id, string Name, string Slug, string ShortDescription, string? Image, int Order);
public sealed record CategoryDetailDto(Guid Id, string Name, string Slug, string ShortDescription, string? Image, int Order, string? Description, string? Icon);
public sealed record SolutionCardDto(Guid Id, Guid CategoryId, string Name, string Slug, string? Eyebrow, string ShortDescription, MediaDto? CoverMedia, IReadOnlyList<string> Tags, bool Featured);
public sealed record FeatureDto(Guid Id, string Title, string? Description);
public sealed record SeoDto(string? Title, string? Description, IReadOnlyList<string> Keywords);
public sealed record SolutionDetailDto(Guid Id, Guid CategoryId, string Name, string Slug, string? Eyebrow, string ShortDescription, string Description, IReadOnlyList<MediaDto> Gallery, IReadOnlyList<FeatureDto> Features, IReadOnlyList<string> UseCases, IReadOnlyList<string> Tags, IReadOnlyList<string> Modalities, string? ImplementationTime, string PriceMode, decimal? PriceFrom, decimal? PriceTo, string? Currency, bool Featured, string Status, DateTimeOffset? PublishedAt, IReadOnlyList<Guid> RelatedSolutionIds, SeoDto? Seo, int Order);
public sealed record AdminSolutionListDto(Guid Id, string Name, string Slug, Guid CategoryId, string Status, bool Featured, MediaDto? CoverMedia);
public sealed record AdminSolutionDetailDto(Guid Id, Guid CategoryId, string Name, string Slug, string? Eyebrow, string ShortDescription, string Description, IReadOnlyList<MediaDto> Gallery, IReadOnlyList<FeatureDto> Features, IReadOnlyList<string> UseCases, IReadOnlyList<string> Tags, IReadOnlyList<string> Modalities, string? ImplementationTime, string PriceMode, decimal? PriceFrom, decimal? PriceTo, string? Currency, bool Featured, string Status, DateTimeOffset? PublishedAt, IReadOnlyList<Guid> RelatedSolutionIds, SeoDto? Seo, int Order, string RowVersion);
public sealed record AdminCategoryDto(Guid Id, string Name, string Slug, string ShortDescription, string? Description, string? Image, string? Icon, int Order, bool IsActive, string RowVersion);

public sealed record FeatureInput(string Title, string? Description);
public sealed record MediaInput(string Url, string Alt, string Type, int Order, bool IsCover, string? StorageKey = null, string? MimeType = null, int? Width = null, int? Height = null, long? Bytes = null);
public sealed record SeoInput(string? Title, string? Description, IReadOnlyList<string>? Keywords);
public sealed record CreateSolutionRequest(string Name, string Slug, Guid CategoryId, string? Eyebrow, string ShortDescription, string Description, IReadOnlyList<FeatureInput>? Features, IReadOnlyList<Guid>? UseCaseIds, IReadOnlyList<Guid>? TagIds, IReadOnlyList<Guid>? ModalityIds, string? ImplementationTime, string PriceMode, decimal? PriceFrom, decimal? PriceTo, string? Currency, bool Featured, string Status, SeoInput? Seo, IReadOnlyList<MediaInput>? Media, int Order = 0);
public sealed record UpdateSolutionRequest(string RowVersion, string Name, string Slug, Guid CategoryId, string? Eyebrow, string ShortDescription, string Description, IReadOnlyList<FeatureInput>? Features, IReadOnlyList<Guid>? UseCaseIds, IReadOnlyList<Guid>? TagIds, IReadOnlyList<Guid>? ModalityIds, string? ImplementationTime, string PriceMode, decimal? PriceFrom, decimal? PriceTo, string? Currency, bool Featured, string Status, SeoInput? Seo, IReadOnlyList<MediaInput>? Media, int Order = 0);
public sealed record DuplicateSolutionRequest(string? Name, string? Slug, bool IncludeMedia = false);
public sealed record CreateCategoryRequest(string Name, string Slug, string ShortDescription, string? Description, string? Image, string? Icon, int Order = 0, bool IsActive = true);
public sealed record UpdateCategoryRequest(string RowVersion, string Name, string Slug, string ShortDescription, string? Description, string? Image, string? Icon, int Order, bool IsActive);
public sealed record ReorderCategoryItem(Guid Id, int Order);
public sealed record ReorderCategoriesRequest(IReadOnlyList<ReorderCategoryItem> Items);
public sealed record MediaUploadRequest(Stream Content, string FileName, string ContentType, long Length, string Alt, bool IsCover = false, int Order = 0);
public sealed record CreateStoredMediaRequest(Guid Id, Guid SolutionId, string StorageKey, string PublicUrl, string Alt, string MimeType, long Bytes, int Order, bool IsCover);
public sealed record UpdateMediaRequest(string Alt, int Order);
public sealed record ObjectStorageUpload(string Key, string PublicUrl);
public sealed record MediaValidationOptions(long MaxBytes = 10 * 1024 * 1024);

public sealed record PublicSolutionQuery(string? Category, string? Search, bool? Featured, string? Tags, string? UseCase, string? Modality, string Sort = "order", int Page = 1, int PageSize = 12);
public sealed record AdminSolutionQuery(string? Search, Guid? Category, string? Status, bool? Featured, string Sort = "order", int Page = 1, int PageSize = 12);
