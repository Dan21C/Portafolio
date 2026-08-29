namespace APX.Domain.Catalog;

public sealed class ServiceCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public uint Version { get; private set; }
    public ICollection<Solution> Solutions { get; } = new List<Solution>();
}

public sealed class Solution
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public ServiceCategory Category { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Eyebrow { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public PriceMode PriceMode { get; set; } = PriceMode.Quote;
    public decimal? PriceFrom { get; set; }
    public decimal? PriceTo { get; set; }
    public string? Currency { get; set; }
    public SolutionStatus Status { get; private set; } = SolutionStatus.Draft;
    public bool Featured { get; set; }
    public string? ImplementationTime { get; set; }
    public int SortOrder { get; set; }
    public DateTimeOffset? PublishedAt { get; private set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public uint Version { get; private set; }
    public ICollection<SolutionMedia> Media { get; } = new List<SolutionMedia>();
    public ICollection<SolutionFeature> Features { get; } = new List<SolutionFeature>();
    public ICollection<SolutionTag> SolutionTags { get; } = new List<SolutionTag>();
    public ICollection<SolutionUseCase> SolutionUseCases { get; } = new List<SolutionUseCase>();
    public ICollection<SolutionModality> SolutionModalities { get; } = new List<SolutionModality>();
    public ICollection<SolutionRelation> RelatedSolutions { get; } = new List<SolutionRelation>();
    public ICollection<SolutionRelation> RelatedFromSolutions { get; } = new List<SolutionRelation>();
    public SolutionSeo? Seo { get; set; }

    public static Solution Create(Guid id, Guid categoryId, string name, string slug, string shortDescription, string description)
    {
        if (id == Guid.Empty || categoryId == Guid.Empty) throw new ArgumentException("Solution and category IDs are required.");
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(slug)) throw new ArgumentException("Name and slug are required.");
        return new Solution { Id = id, CategoryId = categoryId, Name = name.Trim(), Slug = slug.Trim(), ShortDescription = shortDescription.Trim(), Description = description.Trim(), CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow };
    }

    public void SetStatus(SolutionStatus status, DateTimeOffset? now = null)
    {
        Status = status;
        PublishedAt = status == SolutionStatus.Published ? PublishedAt ?? now ?? DateTimeOffset.UtcNow : null;
        UpdatedAt = now ?? DateTimeOffset.UtcNow;
    }

    public SolutionMedia? GetCover() => Media.Where(item => item.IsCover).OrderBy(item => item.SortOrder).FirstOrDefault();
}

public sealed class SolutionMedia { public Guid Id { get; set; } public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public string? StorageKey { get; set; } public string PublicUrl { get; set; } = string.Empty; public string Alt { get; set; } = string.Empty; public MediaType MediaType { get; set; } public string? MimeType { get; set; } public int? Width { get; set; } public int? Height { get; set; } public long? Bytes { get; set; } public int SortOrder { get; set; } public bool IsCover { get; set; } public DateTimeOffset CreatedAt { get; set; } }
public sealed class SolutionFeature { public Guid Id { get; set; } public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public string Title { get; set; } = string.Empty; public string? Description { get; set; } public int SortOrder { get; set; } }
public sealed class Tag { public Guid Id { get; set; } public string Name { get; set; } = string.Empty; public string Slug { get; set; } = string.Empty; public bool IsActive { get; set; } = true; public ICollection<SolutionTag> SolutionTags { get; } = new List<SolutionTag>(); }
public sealed class SolutionTag { public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public Guid TagId { get; set; } public Tag Tag { get; set; } = null!; }
public sealed class UseCase { public Guid Id { get; set; } public string Name { get; set; } = string.Empty; public string Slug { get; set; } = string.Empty; public int SortOrder { get; set; } public bool IsActive { get; set; } = true; public ICollection<SolutionUseCase> SolutionUseCases { get; } = new List<SolutionUseCase>(); }
public sealed class SolutionUseCase { public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public Guid UseCaseId { get; set; } public UseCase UseCase { get; set; } = null!; }
public sealed class Modality { public Guid Id { get; set; } public string Name { get; set; } = string.Empty; public string Slug { get; set; } = string.Empty; public int SortOrder { get; set; } public bool IsActive { get; set; } = true; public ICollection<SolutionModality> SolutionModalities { get; } = new List<SolutionModality>(); }
public sealed class SolutionModality { public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public Guid ModalityId { get; set; } public Modality Modality { get; set; } = null!; }
public sealed class SolutionRelation { public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public Guid RelatedSolutionId { get; set; } public Solution RelatedSolution { get; set; } = null!; public int SortOrder { get; set; } }
public sealed class SolutionSeo { public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!; public string? MetaTitle { get; set; } public string? MetaDescription { get; set; } public string? CanonicalUrl { get; set; } public string? Robots { get; set; } public string[] Keywords { get; set; } = []; }
