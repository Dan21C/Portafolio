namespace APX.Application.Dashboard;

public sealed record DashboardQuery(DateTimeOffset? DateFrom, DateTimeOffset? DateTo);
public sealed record DashboardRangeDto(DateTimeOffset DateFrom, DateTimeOffset DateTo, int AttentionHours);
public sealed record DashboardSummaryDto(int TotalRequests, int NewRequests, int InReviewRequests, int ContactedRequests, int QualifiedRequests, int WonRequests, int LostRequests, int ArchivedRequests);
public sealed record DashboardPipelineItemDto(string Status, int Count, double PercentageOfTotal);
public sealed record DashboardConversionDto(double QualifiedRate, double WonRate, double LostRate);
public sealed record DashboardResponseSpeedDto(double? AverageTimeToFirstContactMinutes, double? MedianTimeToFirstContactMinutes);
public sealed record DashboardBacklogDto(int UncontactedCount, double? OldestUncontactedAgeMinutes);
public sealed record DashboardTrendItemDto(DateOnly Date, int Count);
public sealed record DashboardComparisonDto(int PreviousTotalRequests, int PreviousWonRequests, double? TotalRequestsChangePercent, double? WonRequestsChangePercent);
public sealed record DashboardTopSolutionDto(string SolutionName, string SolutionSlug, string CategoryName, int RequestCount);
public sealed record DashboardTopCategoryDto(string CategoryName, int RequestCount);
public sealed record DashboardTopCityDto(string City, int RequestCount);
public sealed record DashboardRequestListItemDto(Guid Id, string RequestNumber, string Name, string? Company, string City, string Status, DateTimeOffset CreatedAt);
public sealed record DashboardNeedsAttentionDto(int Count, IReadOnlyList<DashboardRequestListItemDto> Items);
public sealed record DashboardDto(DashboardRangeDto Range, DashboardSummaryDto Summary, IReadOnlyList<DashboardPipelineItemDto> Pipeline, DashboardConversionDto Conversion, DashboardResponseSpeedDto ResponseSpeed, DashboardBacklogDto Backlog, IReadOnlyList<DashboardTrendItemDto> Trend, DashboardComparisonDto Comparison, IReadOnlyList<DashboardTopSolutionDto> TopSolutions, IReadOnlyList<DashboardTopCategoryDto> TopCategories, IReadOnlyList<DashboardTopCityDto> TopCities, IReadOnlyList<DashboardRequestListItemDto> RecentRequests, DashboardNeedsAttentionDto NeedsAttention);
public sealed record DashboardOptions(int LeadAttentionHours = 24, int MaxRangeDays = 366);
