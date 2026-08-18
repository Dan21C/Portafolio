using APX.Application.Dashboard;
namespace APX.Tests;
public sealed class DashboardServiceTests
{
    private static readonly DateTimeOffset Now=new(2026,8,18,17,0,0,TimeSpan.Zero);
    [Fact]public async Task Defaults_to_last_30_days_and_passes_attention_threshold(){var repo=new FakeRepository();var result=await Service(repo).GetAsync(new(null,null),default);Assert.True(result.Succeeded);Assert.Equal(Now.AddDays(-30),repo.From);Assert.Equal(Now,repo.To);Assert.Equal(24,repo.AttentionHours);}
    [Fact]public async Task Rejects_inverted_future_and_excessive_ranges(){var service=Service(new());Assert.False((await service.GetAsync(new(Now,Now.AddDays(-1)),default)).Succeeded);Assert.False((await service.GetAsync(new(Now.AddDays(-367),Now),default)).Succeeded);Assert.False((await service.GetAsync(new(null,Now.AddHours(1)),default)).Succeeded);}
    [Fact]public async Task Preserves_repository_metrics_including_zero_denominators_and_empty_lists(){var result=await Service(new()).GetAsync(new(Now.AddDays(-7),Now),default);Assert.True(result.Succeeded);Assert.Equal(0,result.Value!.Summary.TotalRequests);Assert.Equal(0,result.Value.Conversion.WonRate);Assert.Empty(result.Value.TopSolutions);Assert.Empty(result.Value.Trend);}
    private static DashboardService Service(FakeRepository repo)=>new(repo,new(24,366),new FixedTimeProvider(Now));
    private sealed class FixedTimeProvider(DateTimeOffset now):TimeProvider{public override DateTimeOffset GetUtcNow()=>now;}
    private sealed class FakeRepository:IDashboardRepository
    {
        public DateTimeOffset From{get;private set;}public DateTimeOffset To{get;private set;}public int AttentionHours{get;private set;}
        public Task<DashboardDto> GetAsync(DateTimeOffset from,DateTimeOffset to,DateTimeOffset now,int attentionHours,CancellationToken ct){From=from;To=to;AttentionHours=attentionHours;return Task.FromResult(new DashboardDto(new(from,to,attentionHours),new(0,0,0,0,0,0,0,0),[],new(0,0,0),new(null,null),new(0,null),[],new(0,0,null,null),[],[],[],[],new(0,[])));}
    }
}
