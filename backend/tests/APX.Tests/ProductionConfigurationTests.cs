using APX.Api;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
namespace APX.Tests;
public sealed class ProductionConfigurationTests
{
    [Fact]public void Production_accepts_complete_secure_configuration(){ProductionConfigurationValidator.Validate(Configuration(),new EnvironmentStub(Environments.Production));}
    [Theory][InlineData("ConnectionStrings:ApxDatabase")][InlineData("Auth:OtpPepper")][InlineData("Email:Smtp:Password")][InlineData("Cors:AllowedOrigins:0")]
    public void Production_rejects_missing_critical_configuration(string key){var values=Values();values[key]="";var error=Assert.Throws<InvalidOperationException>(()=>ProductionConfigurationValidator.Validate(new ConfigurationBuilder().AddInMemoryCollection(values).Build(),new EnvironmentStub(Environments.Production)));Assert.Contains(key.Split(':')[0],error.Message);Assert.DoesNotContain("super-secret",error.Message);}
    [Fact]public void Production_rejects_development_email_otp_disclosure_and_local_urls(){var values=Values();values["Email:Provider"]="Development";values["Auth:EnableDevelopmentOtpDisclosure"]="true";values["AppUrls:AdminBaseUrl"]="http://localhost:5174/admin";Assert.Throws<InvalidOperationException>(()=>ProductionConfigurationValidator.Validate(new ConfigurationBuilder().AddInMemoryCollection(values).Build(),new EnvironmentStub(Environments.Production)));}
    [Fact]public void Development_keeps_local_defaults(){ProductionConfigurationValidator.Validate(new ConfigurationBuilder().Build(),new EnvironmentStub(Environments.Development));}
    private static IConfiguration Configuration()=>new ConfigurationBuilder().AddInMemoryCollection(Values()).Build();
    private static Dictionary<string,string?> Values()=>new(){{"ConnectionStrings:ApxDatabase","Host=db;Database=apx;Username=user;Password=super-secret"},{"Auth:OtpPepper",new string('x',32)},{"Auth:EnableDevelopmentOtpDisclosure","false"},{"Auth:CookieSameSite","Lax"},{"Email:Provider","Smtp"},{"Email:FromAddress","mail@example.com"},{"Email:Smtp:Host","smtp.example.com"},{"Email:Smtp:Username","user"},{"Email:Smtp:Password","super-secret"},{"Supabase:Url","https://project.supabase.co"},{"Supabase:StorageBucket","apx-catalog"},{"Supabase:SecretKey","super-secret"},{"Cors:AllowedOrigins:0","https://admin.example.com"},{"AppUrls:PublicBaseUrl","https://www.example.com"},{"AppUrls:AdminBaseUrl","https://admin.example.com/admin"},{"Database:InitializeOnStartup","false"}};
    private sealed class EnvironmentStub(string name):IWebHostEnvironment{public string EnvironmentName{get;set;}=name;public string ApplicationName{get;set;}="Tests";public string WebRootPath{get;set;}="";public IFileProvider WebRootFileProvider{get;set;}=new NullFileProvider();public string ContentRootPath{get;set;}="";public IFileProvider ContentRootFileProvider{get;set;}=new NullFileProvider();}
}
