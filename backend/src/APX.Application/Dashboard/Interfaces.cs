namespace APX.Application.Dashboard;
public interface IDashboardRepository { Task<DashboardDto> GetAsync(DateTimeOffset from, DateTimeOffset to, DateTimeOffset now, int attentionHours, CancellationToken ct); }
