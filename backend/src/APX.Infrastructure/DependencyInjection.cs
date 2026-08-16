using APX.Infrastructure.Persistence;
using APX.Application.Catalog;
using APX.Infrastructure.Catalog;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace APX.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("ApxDatabase");
        var effectiveConnection = string.IsNullOrWhiteSpace(connectionString)
            ? "Host=localhost;Port=5432;Database=apx_unconfigured;Username=apx"
            : connectionString;
        services.AddDbContext<ApxDbContext>(options => options.UseNpgsql(effectiveConnection));
        services.AddScoped<ICatalogRepository, EfCatalogRepository>();
        return services;
    }
}
