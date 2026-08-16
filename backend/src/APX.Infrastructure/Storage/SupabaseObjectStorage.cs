using System.Net.Http.Headers;
using APX.Application.Catalog;

namespace APX.Infrastructure.Storage;

public sealed record SupabaseStorageOptions(string Url, string StorageBucket, string ServiceRoleKey);

public sealed class SupabaseObjectStorage(HttpClient client, SupabaseStorageOptions options) : IObjectStorage
{
    public async Task<ObjectStorageUpload> UploadAsync(string key, Stream content, string contentType, CancellationToken ct)
    {
        using var request = CreateRequest(HttpMethod.Post, $"storage/v1/object/{Escape(options.StorageBucket)}/{EscapePath(key)}");
        request.Headers.TryAddWithoutValidation("x-upsert", "false");
        request.Content = new StreamContent(content);
        request.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
        using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
        await EnsureSuccessAsync(response, "upload", ct);
        return new ObjectStorageUpload(key, $"{options.Url.TrimEnd('/')}/storage/v1/object/public/{Escape(options.StorageBucket)}/{EscapePath(key)}");
    }

    public async Task DeleteAsync(string key, CancellationToken ct)
    {
        using var request = CreateRequest(HttpMethod.Delete, $"storage/v1/object/{Escape(options.StorageBucket)}/{EscapePath(key)}");
        using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, ct);
        await EnsureSuccessAsync(response, "delete", ct);
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string relativeUrl)
    {
        var request = new HttpRequestMessage(method, relativeUrl);
        request.Headers.TryAddWithoutValidation("apikey", options.ServiceRoleKey);
        return request;
    }

    private static async Task EnsureSuccessAsync(HttpResponseMessage response, string operation, CancellationToken ct)
    {
        if (response.IsSuccessStatusCode) return;
        var detail = await response.Content.ReadAsStringAsync(ct);
        throw new HttpRequestException($"Supabase Storage {operation} failed ({(int)response.StatusCode}): {detail}", null, response.StatusCode);
    }

    private static string Escape(string value) => Uri.EscapeDataString(value);
    private static string EscapePath(string key) => string.Join('/', key.Split('/', StringSplitOptions.RemoveEmptyEntries).Select(Uri.EscapeDataString));
}
