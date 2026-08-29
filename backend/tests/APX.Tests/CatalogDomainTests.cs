using APX.Domain.Catalog;
using APX.Infrastructure.Persistence.Seed;

namespace APX.Tests;

public sealed class CatalogDomainTests
{
    [Fact]
    public void CreateSolution_WithValidData_CreatesDraft()
    {
        var solution = Solution.Create(Guid.NewGuid(), Guid.NewGuid(), "Solution", "solution", "Short", "Description");
        Assert.Equal(SolutionStatus.Draft, solution.Status); Assert.Equal("solution", solution.Slug); Assert.Null(solution.PublishedAt);
    }

    [Fact]
    public void CreateSolution_WithoutSlug_IsRejected() => Assert.Throws<ArgumentException>(() => Solution.Create(Guid.NewGuid(), Guid.NewGuid(), "Solution", " ", "Short", "Description"));

    [Fact]
    public void SetStatus_PublishedAndDraft_ControlsPublishedAt()
    {
        var solution = Solution.Create(Guid.NewGuid(), Guid.NewGuid(), "Solution", "solution", "Short", "Description"); var now = DateTimeOffset.UtcNow;
        solution.SetStatus(SolutionStatus.Published, now); Assert.Equal(now, solution.PublishedAt);
        solution.SetStatus(SolutionStatus.Draft, now.AddMinutes(1)); Assert.Null(solution.PublishedAt);
    }

    [Fact]
    public void GetCover_ReturnsMediaMarkedAsCover()
    {
        var solution = Solution.Create(Guid.NewGuid(), Guid.NewGuid(), "Solution", "solution", "Short", "Description");
        solution.Media.Add(new SolutionMedia { Id = Guid.NewGuid(), PublicUrl = "/secondary.png", SortOrder = 1 }); solution.Media.Add(new SolutionMedia { Id = Guid.NewGuid(), PublicUrl = "/cover.png", SortOrder = 2, IsCover = true });
        Assert.Equal("/cover.png", solution.GetCover()?.PublicUrl);
    }

    [Theory]
    [InlineData(SolutionStatus.Draft, "draft")]
    [InlineData(SolutionStatus.Published, "published")]
    [InlineData(SolutionStatus.Archived, "archived")]
    public void SolutionStatus_MapsToFrontendContract(SolutionStatus status, string contract) { Assert.Equal(contract, status.ToContract()); Assert.Equal(status, CatalogEnumMappings.ParseSolutionStatus(contract)); }

    [Fact]
    public void Seed_MatchesFrozenFrontendCatalog()
    {
        var categories = CatalogSeedData.Categories; var solutions = CatalogSeedData.Solutions;
        Assert.Equal(6, categories.Count); Assert.Equal(36, solutions.Count); Assert.All(solutions, solution => Assert.Contains(categories, category => category.Id == solution.CategoryId)); Assert.All(solutions, solution => Assert.Equal(SolutionStatus.Published, solution.Status));
        Assert.Equal(Guid.Parse("00000000-0000-4000-8000-000000000001"), categories[0].Id);
        Assert.Equal(Guid.Parse("10000000-0000-4000-8001-000000000001"), solutions[0].Id);
        Assert.Equal(Guid.Parse("10000000-0000-4000-8006-000000000006"), solutions[^1].Id);
    }
}
