using APX.Infrastructure.Storage;

namespace APX.Tests;

public sealed class SupabaseStorageFactAttribute : FactAttribute
{
    public SupabaseStorageFactAttribute()
    {
        if (!string.Equals(Environment.GetEnvironmentVariable("APX_RUN_SUPABASE_STORAGE_TESTS"), "true", StringComparison.OrdinalIgnoreCase))
            Skip = "Set APX_RUN_SUPABASE_STORAGE_TESTS=true and the Supabase__* variables to test real Storage.";
    }
}

public sealed class SupabaseStorageIntegrationTests
{
    [SupabaseStorageFact]
    [Trait("Category", "Integration")]
    public async Task UploadPublicReadAndDelete_CleansRemoteObject()
    {
        var url = Required("Supabase__Url"); var bucket = Required("Supabase__StorageBucket"); var key = Required("Supabase__ServiceRoleKey");
        using var client = new HttpClient { BaseAddress = new Uri(url.TrimEnd('/') + "/") };
        client.DefaultRequestHeaders.UserAgent.ParseAdd("APX.Backend.Tests/1.0");
        var storage = new SupabaseObjectStorage(client, new(url, bucket, key));
        var objectKey = $"integration-tests/{Guid.NewGuid():N}.png";
        try
        {
            await using var content = new MemoryStream(Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="));
            var uploaded = await storage.UploadAsync(objectKey, content, "image/png", default);
            using var response = await client.GetAsync(uploaded.PublicUrl);
            Assert.True(response.IsSuccessStatusCode, $"Public read returned {(int)response.StatusCode}.");
        }
        finally
        {
            await storage.DeleteAsync(objectKey, default);
        }
    }

    private static string Required(string name) => Environment.GetEnvironmentVariable(name) ?? throw new InvalidOperationException($"{name} is required.");
}
