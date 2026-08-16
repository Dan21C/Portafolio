using APX.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace APX.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("ApxDatabase");
        if (!string.IsNullOrWhiteSpace(connectionString)) services.AddDbContext<ApxDbContext>(options => options.UseNpgsql(connectionString));
        return services;
    }
}
