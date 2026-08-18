using APX.Infrastructure.Persistence;
using APX.Application.Catalog;
using APX.Infrastructure.Catalog;
using APX.Infrastructure.Storage;
using APX.Application.Authentication;
using APX.Infrastructure.Authentication;
using APX.Application.Requests;
using APX.Infrastructure.Requests;
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
        services.AddScoped<IMediaRepository>(provider => provider.GetRequiredService<ICatalogRepository>() as IMediaRepository ?? throw new InvalidOperationException("Catalog repository must implement media persistence."));
        services.AddScoped<IAuthRepository, EfAuthRepository>();
        services.AddScoped<IProjectRequestRepository, EfProjectRequestRepository>();
        var supabase = new SupabaseStorageOptions(
            configuration["Supabase:Url"] ?? string.Empty,
            configuration["Supabase:StorageBucket"] ?? string.Empty,
            configuration["Supabase:ServiceRoleKey"] ?? string.Empty);
        services.AddSingleton(supabase);
        services.AddSingleton<IObjectStorage>(_ =>
        {
            var client = new HttpClient();
            if (Uri.TryCreate(supabase.Url.TrimEnd('/') + "/", UriKind.Absolute, out var baseAddress)) client.BaseAddress = baseAddress;
            client.DefaultRequestHeaders.UserAgent.ParseAdd("APX.Backend/1.0");
            client.Timeout = TimeSpan.FromSeconds(60);
            return new SupabaseObjectStorage(client, supabase);
        });
        return services;
    }
}
