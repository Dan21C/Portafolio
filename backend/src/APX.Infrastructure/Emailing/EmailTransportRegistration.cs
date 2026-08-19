using System.Net.Http.Headers;
using APX.Application.Emailing;
using APX.Application.Authentication;
using APX.Infrastructure.Authentication;
using Microsoft.Extensions.DependencyInjection;

namespace APX.Infrastructure.Emailing;

public static class EmailTransportRegistration
{
    public static IServiceCollection AddEmailTransport(this IServiceCollection services, string provider, TransactionalEmailOptions options)
    {
        if (provider.Equals("Smtp", StringComparison.OrdinalIgnoreCase))
        {
            services.AddScoped<IEmailTransport, SmtpEmailTransport>();
            services.AddScoped<IEmailSender, TransportOtpEmailSender>();
        }
        else if (provider.Equals("Resend", StringComparison.OrdinalIgnoreCase))
        {
            services.AddHttpClient<IEmailTransport, ResendEmailTransport>(client =>
            {
                client.BaseAddress = new Uri(options.Resend!.BaseUrl.TrimEnd('/') + "/");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", options.Resend.ApiKey);
                client.DefaultRequestHeaders.UserAgent.ParseAdd("APX.Api/1.0");
                client.Timeout = TimeSpan.FromSeconds(Math.Clamp(options.Resend.TimeoutSeconds, 5, 60));
            });
            services.AddScoped<IEmailSender, TransportOtpEmailSender>();
        }
        else
        {
            services.AddScoped<IEmailTransport, DevelopmentEmailTransport>();
            services.AddScoped<IEmailSender, DevelopmentEmailSender>();
        }
        return services;
    }
}
