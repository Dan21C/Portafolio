using APX.Application.Common;
namespace APX.Application.Dashboard;
public sealed class DashboardService(IDashboardRepository repository, DashboardOptions options, TimeProvider timeProvider)
{
    public Task<Result<DashboardDto>> GetAsync(DashboardQuery query,CancellationToken ct)
    {
        var now=timeProvider.GetUtcNow();var to=query.DateTo?.ToUniversalTime()??now;var from=query.DateFrom?.ToUniversalTime()??to.AddDays(-30);
        var errors=new Dictionary<string,string[]>();if(from>to)errors["dateFrom"]=["Must be earlier than or equal to dateTo."];if(to-from>TimeSpan.FromDays(options.MaxRangeDays))errors["dateFrom"] = [$"Range cannot exceed {options.MaxRangeDays} days."];if(to>now.AddMinutes(5))errors["dateTo"]=["Cannot be in the future."];
        return errors.Count>0?Task.FromResult(Result<DashboardDto>.Failure(Errors.Validation("Review the dashboard date range.",errors))):Load(from,to,now,ct);
    }
    private async Task<Result<DashboardDto>> Load(DateTimeOffset from,DateTimeOffset to,DateTimeOffset now,CancellationToken ct)=>Result<DashboardDto>.Success(await repository.GetAsync(from,to,now,options.LeadAttentionHours,ct));
}
