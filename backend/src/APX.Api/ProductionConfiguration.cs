using System.Net;

namespace APX.Api;

public sealed record CookieSecurityOptions(SameSiteMode SameSite = SameSiteMode.Lax);
public sealed record DataRetentionOptions(int ConsumedOtpDays = 7, int RevokedSessionDays = 30, int EmailDeliveryDays = 180, int AuditLogDays = 730);

public static class ProductionConfigurationValidator
{
    public static void Validate(IConfiguration configuration,IWebHostEnvironment environment)
    {
        if(!environment.IsProduction())return;var missing=new List<string>();
        RequiredConnection(configuration,"ConnectionStrings:ApxDatabase",missing);Required(configuration,"Auth:OtpPepper",missing,value=>value.Length>=32,"must contain at least 32 characters");
        Required(configuration,"Email:Provider",missing,value=>value.Equals("Smtp",StringComparison.OrdinalIgnoreCase)||value.Equals("Resend",StringComparison.OrdinalIgnoreCase),"must be Smtp or Resend");
        foreach(var key in new[]{"Email:FromAddress","Supabase:Url","Supabase:StorageBucket","AppUrls:PublicBaseUrl","AppUrls:AdminBaseUrl"})Required(configuration,key,missing);
        if((configuration["Email:Provider"]??string.Empty).Equals("Resend",StringComparison.OrdinalIgnoreCase))
        {
            Required(configuration,"Email:Resend:ApiKey",missing);
            if(configuration["Email:Resend:BaseUrl"] is{Length:>0} resendBaseUrl&&!ProductionHttps(resendBaseUrl))missing.Add("Email:Resend:BaseUrl must be an absolute HTTPS URL without localhost");
        }
        else foreach(var key in new[]{"Email:Smtp:Host","Email:Smtp:Username","Email:Smtp:Password"})Required(configuration,key,missing);
        if(string.IsNullOrWhiteSpace(configuration["Supabase:SecretKey"])&&string.IsNullOrWhiteSpace(configuration["Supabase:ServiceRoleKey"]))missing.Add("Supabase:SecretKey is required");
        var origins=configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()??[];if(origins.Length==0)missing.Add("Cors:AllowedOrigins requires at least one explicit origin");foreach(var origin in origins)if(!ProductionHttps(origin))missing.Add("Cors:AllowedOrigins entries must be absolute HTTPS origins without localhost");
        foreach(var key in new[]{"AppUrls:PublicBaseUrl","AppUrls:AdminBaseUrl","Supabase:Url"})if(configuration[key] is{Length:>0} value&&!ProductionHttps(value))missing.Add($"{key} must be an absolute HTTPS URL without localhost");
        if(configuration.GetValue("Auth:EnableDevelopmentOtpDisclosure",false))missing.Add("Auth:EnableDevelopmentOtpDisclosure must be false");if(configuration.GetValue("Database:InitializeOnStartup",false))missing.Add("Database:InitializeOnStartup must be false in Production");
        var sameSite=configuration["Auth:CookieSameSite"]??"Lax";if(!Enum.TryParse<SameSiteMode>(sameSite,true,out var parsed)||parsed is SameSiteMode.Unspecified)missing.Add("Auth:CookieSameSite must be Lax, Strict or None");
        if(missing.Count>0)throw new InvalidOperationException("Production configuration is invalid: "+string.Join("; ",missing));
    }
    private static void Required(IConfiguration c,string key,List<string> errors,Func<string,bool>? predicate=null,string? requirement=null){var value=c[key];if(string.IsNullOrWhiteSpace(value))errors.Add($"{key} is required");else if(predicate is not null&&!predicate(value))errors.Add($"{key} {requirement}");}
    private static void RequiredConnection(IConfiguration c,string key,List<string> errors){var value=c.GetConnectionString("ApxDatabase");if(string.IsNullOrWhiteSpace(value))errors.Add($"{key} is required");}
    private static bool ProductionHttps(string value)=>Uri.TryCreate(value,UriKind.Absolute,out var uri)&&uri.Scheme==Uri.UriSchemeHttps&&!uri.IsLoopback&&string.IsNullOrEmpty(uri.Query)&&string.IsNullOrEmpty(uri.Fragment);
}
