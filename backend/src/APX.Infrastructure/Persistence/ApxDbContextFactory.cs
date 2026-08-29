using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
namespace APX.Infrastructure.Persistence;
public sealed class ApxDbContextFactory : IDesignTimeDbContextFactory<ApxDbContext>
{
    public ApxDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__ApxDatabase")
            ?? "Host=localhost;Port=5432;Database=apx_design;Username=apx";
        var options = new DbContextOptionsBuilder<ApxDbContext>().UseNpgsql(connectionString).Options;
        return new ApxDbContext(options);
    }
}
