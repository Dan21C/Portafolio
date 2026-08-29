using APX.Application.Catalog;
using APX.Application.Common;

namespace APX.Tests;

public sealed class MediaServiceTests
{
    [Fact]
    public async Task Upload_RejectsUnsupportedMimeTypeWithoutCallingStorage()
    {
        var storage = new FakeStorage();
        var result = await Service(storage: storage).UploadAsync(Guid.NewGuid(), Upload("image/gif"), default);
        Assert.False(result.Succeeded); Assert.Equal(ErrorType.Validation, result.Error!.Type); Assert.Empty(storage.UploadedKeys);
    }

    [Fact]
    public async Task Upload_RejectsFilesAboveConfiguredLimit()
    {
        var result = await Service(options: new(3)).UploadAsync(Guid.NewGuid(), Upload("image/png", length: 4), default);
        Assert.False(result.Succeeded); Assert.Contains("file", result.Error!.Errors!.Keys);
    }

    [Fact]
    public async Task Upload_UsesServerGeneratedSafeKeyAndPersistsMetadata()
    {
        var repository = new FakeMediaRepository(); var storage = new FakeStorage(); var solutionId = Guid.NewGuid();
        var result = await Service(repository, storage).UploadAsync(solutionId, Upload("image/webp", fileName: "../../unsafe.exe", isCover: true), default);
        Assert.True(result.Succeeded); Assert.StartsWith($"solutions/{solutionId:D}/", storage.UploadedKeys.Single()); Assert.EndsWith(".webp", storage.UploadedKeys.Single());
        Assert.NotNull(repository.Created); Assert.True(repository.Created!.IsCover); Assert.Equal("image/webp", repository.Created.MimeType);
    }

    [Fact]
    public async Task Upload_DeletesObjectWhenDatabasePersistenceFails()
    {
        var repository = new FakeMediaRepository { CreateResult = Result<MediaDto>.Failure(Errors.Conflict("test", "failure")) }; var storage = new FakeStorage();
        var result = await Service(repository, storage).UploadAsync(Guid.NewGuid(), Upload(), default);
        Assert.False(result.Succeeded); Assert.Equal(storage.UploadedKeys.Single(), storage.DeletedKeys.Single());
    }

    [Fact]
    public async Task SetCover_DelegatesAtomicCoverChangeToRepository()
    {
        var repository = new FakeMediaRepository(); var solutionId = Guid.NewGuid(); var mediaId = Guid.NewGuid();
        var result = await Service(repository).SetCoverAsync(solutionId, mediaId, default);
        Assert.True(result.Succeeded); Assert.Equal((solutionId, mediaId), repository.CoverChange);
    }

    [Fact]
    public async Task Delete_RemovesStorageObjectBeforeDatabaseRow()
    {
        var calls = new List<string>(); var repository = new FakeMediaRepository(calls); var storage = new FakeStorage(calls);
        var result = await Service(repository, storage).DeleteAsync(repository.SolutionId, repository.MediaId, default);
        Assert.True(result.Succeeded); Assert.Equal(["storage-delete", "database-delete"], calls);
    }

    private static MediaService Service(FakeMediaRepository? repository = null, FakeStorage? storage = null, MediaValidationOptions? options = null) => new(repository ?? new(), storage ?? new(), options ?? new());
    private static MediaUploadRequest Upload(string mime = "image/png", long length = 1, string fileName = "image.png", bool isCover = false) => new(new MemoryStream(new byte[Math.Max(1, length)]), fileName, mime, length, "Useful alternative", isCover, 0);

    private sealed class FakeStorage(List<string>? calls = null) : IObjectStorage
    {
        public List<string> UploadedKeys { get; } = [];
        public List<string> DeletedKeys { get; } = [];
        public Task<ObjectStorageUpload> UploadAsync(string key, Stream content, string contentType, CancellationToken ct) { UploadedKeys.Add(key); return Task.FromResult(new ObjectStorageUpload(key, $"https://example.test/{key}")); }
        public Task DeleteAsync(string key, CancellationToken ct) { DeletedKeys.Add(key); calls?.Add("storage-delete"); return Task.CompletedTask; }
    }

    private sealed class FakeMediaRepository(List<string>? calls = null) : IMediaRepository
    {
        public Guid SolutionId { get; } = Guid.NewGuid();
        public Guid MediaId { get; } = Guid.NewGuid();
        public CreateStoredMediaRequest? Created { get; private set; }
        public (Guid SolutionId, Guid MediaId)? CoverChange { get; private set; }
        public Result<MediaDto>? CreateResult { get; init; }
        public Task<bool> SolutionExistsAsync(Guid solutionId, CancellationToken ct) => Task.FromResult(true);
        public Task<MediaDto?> GetMediaAsync(Guid solutionId, Guid mediaId, CancellationToken ct) => Task.FromResult<MediaDto?>(new(MediaId, "https://example.test/x", "alt", "image", 0, false, "solutions/x.png", "image/png", null, null, 1));
        public Task<Result<MediaDto>> CreateMediaAsync(CreateStoredMediaRequest request, CancellationToken ct) { Created = request; return Task.FromResult(CreateResult ?? Result<MediaDto>.Success(ToDto(request))); }
        public Task<Result<MediaDto>> UpdateMediaAsync(Guid solutionId, Guid mediaId, UpdateMediaRequest request, CancellationToken ct) => Task.FromResult(Result<MediaDto>.Success(new(mediaId, "url", request.Alt, "image", request.Order, false, "key", "image/png", null, null, 1)));
        public Task<Result<MediaDto>> SetCoverAsync(Guid solutionId, Guid mediaId, CancellationToken ct) { CoverChange = (solutionId, mediaId); return Task.FromResult(Result<MediaDto>.Success(new(mediaId, "url", "alt", "image", 0, true, "key", "image/png", null, null, 1))); }
        public Task<Result> DeleteMediaAsync(Guid solutionId, Guid mediaId, CancellationToken ct) { calls?.Add("database-delete"); return Task.FromResult(Result.Success()); }
        private static MediaDto ToDto(CreateStoredMediaRequest x) => new(x.Id, x.PublicUrl, x.Alt, "image", x.Order, x.IsCover, x.StorageKey, x.MimeType, null, null, x.Bytes);
    }
}
