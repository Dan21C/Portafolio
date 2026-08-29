using APX.Application.Common;

namespace APX.Application.Catalog;

public sealed class MediaService(IMediaRepository repository, IObjectStorage storage, MediaValidationOptions options)
{
    private static readonly IReadOnlyDictionary<string, string> AllowedTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp",
        ["image/avif"] = ".avif"
    };

    public async Task<Result<MediaDto>> UploadAsync(Guid solutionId, MediaUploadRequest request, CancellationToken ct)
    {
        var errors = ValidateUpload(request);
        if (errors.Count > 0) return Result<MediaDto>.Failure(Errors.Validation("Media upload validation failed.", errors));
        if (!await repository.SolutionExistsAsync(solutionId, ct)) return Result<MediaDto>.Failure(Errors.NotFound("solution_not_found", "Solution was not found."));

        var mediaId = Guid.NewGuid();
        var key = $"solutions/{solutionId:D}/{mediaId:D}{AllowedTypes[request.ContentType]}";
        ObjectStorageUpload uploaded;
        try
        {
            uploaded = await storage.UploadAsync(key, request.Content, request.ContentType, ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            return Result<MediaDto>.Failure(new AppError(ErrorType.Unexpected, "media_upload_failed", "The media file could not be stored."));
        }

        try
        {
            var result = await repository.CreateMediaAsync(new(mediaId, solutionId, uploaded.Key, uploaded.PublicUrl, request.Alt.Trim(), request.ContentType, request.Length, request.Order, request.IsCover), ct);
            if (!result.Succeeded) await CompensateAsync(uploaded.Key);
            return result;
        }
        catch
        {
            await CompensateAsync(uploaded.Key);
            throw;
        }
    }

    public Task<Result<MediaDto>> UpdateAsync(Guid solutionId, Guid mediaId, UpdateMediaRequest request, CancellationToken ct)
    {
        var errors = new Dictionary<string, string[]>();
        if (string.IsNullOrWhiteSpace(request.Alt) || request.Alt.Trim().Length > 300) errors["alt"] = ["Alt text is required and must not exceed 300 characters."];
        if (request.Order < 0) errors["order"] = ["Order must be non-negative."];
        return errors.Count > 0
            ? Task.FromResult(Result<MediaDto>.Failure(Errors.Validation("Media validation failed.", errors)))
            : repository.UpdateMediaAsync(solutionId, mediaId, request with { Alt = request.Alt.Trim() }, ct);
    }

    public Task<Result<MediaDto>> SetCoverAsync(Guid solutionId, Guid mediaId, CancellationToken ct) => repository.SetCoverAsync(solutionId, mediaId, ct);

    public async Task<Result> DeleteAsync(Guid solutionId, Guid mediaId, CancellationToken ct)
    {
        var media = await repository.GetMediaAsync(solutionId, mediaId, ct);
        if (media is null) return Result.Failure(Errors.NotFound("media_not_found", "Media was not found."));

        // Storage-first prevents known database rows from silently leaving billable orphan objects.
        // A rare database failure after this point is surfaced so an operator can repair the row.
        if (!string.IsNullOrWhiteSpace(media.StorageKey))
        {
            try { await storage.DeleteAsync(media.StorageKey, ct); }
            catch (Exception ex) when (ex is not OperationCanceledException)
            { return Result.Failure(new AppError(ErrorType.Unexpected, "media_delete_failed", "The media file could not be deleted from storage.")); }
        }
        return await repository.DeleteMediaAsync(solutionId, mediaId, ct);
    }

    private Dictionary<string, string[]> ValidateUpload(MediaUploadRequest request)
    {
        var errors = new Dictionary<string, string[]>();
        if (request.Length <= 0) errors["file"] = ["A non-empty file is required."];
        else if (request.Length > options.MaxBytes) errors["file"] = [$"File size must not exceed {options.MaxBytes} bytes."];
        if (!AllowedTypes.ContainsKey(request.ContentType)) errors["file"] = ["Only JPEG, PNG, WebP and AVIF images are accepted."];
        if (string.IsNullOrWhiteSpace(request.Alt) || request.Alt.Trim().Length > 300) errors["alt"] = ["Alt text is required and must not exceed 300 characters."];
        if (request.Order < 0) errors["order"] = ["Order must be non-negative."];
        return errors;
    }

    private async Task CompensateAsync(string key)
    {
        try { await storage.DeleteAsync(key, CancellationToken.None); }
        catch { /* Preserve the original persistence failure; orphan cleanup is operational. */ }
    }
}
