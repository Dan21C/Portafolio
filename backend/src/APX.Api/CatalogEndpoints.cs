using APX.Application.Catalog;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace APX.Api;

internal static class CatalogEndpoints
{
    public static IEndpointRouteBuilder MapCatalogApi(this IEndpointRouteBuilder endpoints)
    {
        var catalog = endpoints.MapGroup("/api/v1/catalog").WithTags("Public Catalog");
        catalog.MapGet("/categories", async (CatalogQueryService service, CancellationToken ct) => Results.Ok(await service.GetCategoriesAsync(ct))).Produces<IReadOnlyList<CategoryListDto>>();
        catalog.MapGet("/categories/{slug}", async (string slug, CatalogQueryService service, CancellationToken ct) => (await service.GetCategoryAsync(slug, ct)).ToHttp()).Produces<CategoryDetailDto>().ProducesProblem(404);
        catalog.MapGet("/solutions", async ([AsParameters] PublicSolutionQuery query, CatalogQueryService service, CancellationToken ct) => (await service.GetSolutionsAsync(query, ct)).ToHttp()).Produces<PagedResult<SolutionCardDto>>().ProducesProblem(400);
        catalog.MapGet("/solutions/{slug}", async (string slug, CatalogQueryService service, CancellationToken ct) => (await service.GetSolutionAsync(slug, ct)).ToHttp()).Produces<SolutionDetailDto>().ProducesProblem(404);
        catalog.MapGet("/featured", async (CatalogQueryService service, CancellationToken ct) => Results.Ok(await service.GetFeaturedAsync(ct))).Produces<IReadOnlyList<SolutionCardDto>>();
        return endpoints;
    }

    public static IEndpointRouteBuilder MapAdminApi(this IEndpointRouteBuilder endpoints)
    {
        var admin = endpoints.MapGroup("/api/v1/admin").WithTags("Admin Catalog").RequireAuthorization(AdminAuth.Read);
        admin.MapGet("/solutions", async ([AsParameters] AdminSolutionQuery query, AdminSolutionService service, CancellationToken ct) => (await service.GetAsync(query, ct)).ToHttp()).Produces<PagedResult<AdminSolutionListDto>>();
        admin.MapGet("/solutions/{id:guid}", async (Guid id, AdminSolutionService service, CancellationToken ct) => (await service.GetByIdAsync(id, ct)).ToHttp()).Produces<AdminSolutionDetailDto>().ProducesProblem(404);
        admin.MapPost("/solutions", async (CreateSolutionRequest request, AdminSolutionService service, CancellationToken ct) => (await service.CreateAsync(request, ct)).ToHttp(value => Results.Created($"/api/v1/admin/solutions/{value.Id}", value))).RequireAuthorization(AdminAuth.ContentWrite).Produces<AdminSolutionDetailDto>(201).ProducesProblem(400).ProducesProblem(409);
        admin.MapPut("/solutions/{id:guid}", async (Guid id, UpdateSolutionRequest request, AdminSolutionService service, CancellationToken ct) => (await service.UpdateAsync(id, request, ct)).ToHttp()).RequireAuthorization(AdminAuth.ContentWrite).Produces<AdminSolutionDetailDto>().ProducesProblem(409);
        admin.MapDelete("/solutions/{id:guid}", async (Guid id, AdminSolutionService service, CancellationToken ct) => (await service.DeleteAsync(id, ct)).ToHttp()).RequireAuthorization(AdminAuth.Delete).Produces(204).ProducesProblem(404);
        admin.MapPost("/solutions/{id:guid}/duplicate", async (Guid id, DuplicateSolutionRequest request, AdminSolutionService service, CancellationToken ct) => (await service.DuplicateAsync(id, request, ct)).ToHttp(value => Results.Created($"/api/v1/admin/solutions/{value.Id}", value))).RequireAuthorization(AdminAuth.ContentWrite).Produces<AdminSolutionDetailDto>(201).ProducesProblem(409);
        admin.MapPost("/solutions/{id:guid}/publish", async (Guid id, AdminSolutionService service, CancellationToken ct) => (await service.PublishAsync(id, true, ct)).ToHttp()).RequireAuthorization(AdminAuth.Publish).Produces<AdminSolutionDetailDto>();
        admin.MapPost("/solutions/{id:guid}/unpublish", async (Guid id, AdminSolutionService service, CancellationToken ct) => (await service.PublishAsync(id, false, ct)).ToHttp()).RequireAuthorization(AdminAuth.Publish).Produces<AdminSolutionDetailDto>();
        admin.MapGet("/categories", async (AdminCategoryService service, CancellationToken ct) => Results.Ok(await service.GetAsync(ct))).Produces<IReadOnlyList<AdminCategoryDto>>();
        admin.MapPost("/categories", async (CreateCategoryRequest request, AdminCategoryService service, CancellationToken ct) => (await service.CreateAsync(request, ct)).ToHttp(value => Results.Created($"/api/v1/admin/categories/{value.Id}", value))).RequireAuthorization(AdminAuth.CategoryManage).Produces<AdminCategoryDto>(201);
        admin.MapPut("/categories/reorder", async (ReorderCategoriesRequest request, AdminCategoryService service, CancellationToken ct) => (await service.ReorderAsync(request, ct)).ToHttp()).RequireAuthorization(AdminAuth.CategoryManage).Produces(204);
        admin.MapPut("/categories/{id:guid}", async (Guid id, UpdateCategoryRequest request, AdminCategoryService service, CancellationToken ct) => (await service.UpdateAsync(id, request, ct)).ToHttp()).RequireAuthorization(AdminAuth.CategoryManage).Produces<AdminCategoryDto>();
        admin.MapDelete("/categories/{id:guid}", async (Guid id, AdminCategoryService service, CancellationToken ct) => (await service.DeleteAsync(id, ct)).ToHttp()).RequireAuthorization(AdminAuth.Delete).Produces(204).ProducesProblem(409);
        admin.MapPost("/solutions/{solutionId:guid}/media", async (Guid solutionId, [FromForm] IFormFile file, [FromForm] string alt, [FromForm] bool? isCover, [FromForm] int? order, MediaService service, CancellationToken ct) =>
        {
            await using var content = file.OpenReadStream();
            var request = new MediaUploadRequest(content, file.FileName, file.ContentType, file.Length, alt, isCover ?? false, order ?? 0);
            return (await service.UploadAsync(solutionId, request, ct)).ToHttp(value => Results.Created($"/api/v1/admin/solutions/{solutionId}/media/{value.Id}", value));
        }).DisableAntiforgery().RequireAuthorization(AdminAuth.MediaWrite).Accepts<IFormFile>("multipart/form-data").Produces<MediaDto>(201).ProducesProblem(400).ProducesProblem(404);
        admin.MapPut("/solutions/{solutionId:guid}/media/{mediaId:guid}/cover", async (Guid solutionId, Guid mediaId, MediaService service, CancellationToken ct) => (await service.SetCoverAsync(solutionId, mediaId, ct)).ToHttp()).RequireAuthorization(AdminAuth.MediaWrite).Produces<MediaDto>().ProducesProblem(404);
        admin.MapPut("/solutions/{solutionId:guid}/media/{mediaId:guid}", async (Guid solutionId, Guid mediaId, UpdateMediaRequest request, MediaService service, CancellationToken ct) => (await service.UpdateAsync(solutionId, mediaId, request, ct)).ToHttp()).RequireAuthorization(AdminAuth.MediaWrite).Produces<MediaDto>().ProducesProblem(400).ProducesProblem(404);
        admin.MapDelete("/solutions/{solutionId:guid}/media/{mediaId:guid}", async (Guid solutionId, Guid mediaId, MediaService service, CancellationToken ct) => (await service.DeleteAsync(solutionId, mediaId, ct)).ToHttp()).RequireAuthorization(AdminAuth.MediaWrite).Produces(204).ProducesProblem(404);
        return endpoints;
    }

    private static RouteHandlerBuilder ProducesProblem(this RouteHandlerBuilder builder, int status) => builder.Produces<ProblemDetails>(status, "application/problem+json");
}
