import { categories, solutions } from '../../../../catalog-core/seed';
import type { CatalogSolutionQuery, CategoryDetailDto, CategoryListDto, CreateMediaUploadRequest, CreateProjectRequestDto, MediaUploadResultDto, PagedResult, ProjectRequestCreatedDto, SolutionCardDto, SolutionDetailDto } from '../../../../catalog-core/contracts';
import type { CatalogRepository, MediaRepository, ProjectRequestRepository } from '../../../../catalog-core/repositories';
import type { ServiceCategory, Solution, SolutionMedia } from '../../../../catalog-core/models';
import { mapCategoryDetail, mapCategoryList, mapSolutionCard, mapSolutionDetail } from '../../../../catalog-core/mappers';
import { ApiClient, CatalogApiError } from './apiClient';

const clone = <T>(value: T): T => structuredClone(value);
export class MockCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<ServiceCategory[]> { return clone(categories.filter((item) => item.isActive).sort((a, b) => a.order - b.order)); }
  async getCategoryBySlug(slug: string): Promise<ServiceCategory | null> { return (await this.getCategories()).find((item) => item.slug === slug) ?? null; }
  async getSolutions(query: CatalogSolutionQuery = {}): Promise<Solution[]> {
    let result = clone(solutions.filter((item) => item.status === 'published'));
    if (query.categorySlug) { const category = categories.find((item) => item.slug === query.categorySlug); result = result.filter((item) => item.categoryId === category?.id); }
    if (query.search) { const term = query.search.toLocaleLowerCase(); result = result.filter((item) => `${item.name} ${item.shortDescription} ${item.tags.join(' ')}`.toLocaleLowerCase().includes(term)); }
    if (query.featured !== undefined) result = result.filter((item) => item.featured === query.featured);
    const sorted = query.sort === 'name' ? result.sort((a, b) => a.name.localeCompare(b.name)) : query.sort === 'newest' ? result.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')) : query.sort === 'featured' ? result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order) : result.sort((a, b) => a.order - b.order);
    const start = ((query.page ?? 1) - 1) * (query.pageSize ?? 12); return sorted.slice(start, start + (query.pageSize ?? sorted.length));
  }
  async getSolutionsPage(query: CatalogSolutionQuery = {}): Promise<PagedResult<Solution>> { const unpaged = await this.getSolutions({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER }); const page = query.page ?? 1; const pageSize = query.pageSize ?? 12; const start = (page - 1) * pageSize; return { items: unpaged.slice(start, start + pageSize), page, pageSize, totalItems: unpaged.length, totalPages: Math.ceil(unpaged.length / pageSize) }; }
  async getSolutionsByCategory(categoryId: string): Promise<Solution[]> { return (await this.getSolutions()).filter((item) => item.categoryId === categoryId); }
  async getSolutionBySlug(slug: string): Promise<Solution | null> { return (await this.getSolutions()).find((item) => item.slug === slug) ?? null; }
  async getFeaturedSolutions(): Promise<Solution[]> { return this.getSolutions({ featured: true }); }
}
export class ApiCatalogRepository implements CatalogRepository {
  private readonly client: ApiClient;
  constructor(baseUrl = import.meta.env.VITE_API_URL ?? '', fetchImpl: typeof fetch = fetch) { this.client = new ApiClient(baseUrl, fetchImpl); }
  async getCategories(signal?: AbortSignal): Promise<ServiceCategory[]> { return (await this.client.get<CategoryListDto[]>('/api/v1/catalog/categories', signal)).map(mapCategoryList); }
  async getCategoryBySlug(slug: string, signal?: AbortSignal): Promise<ServiceCategory | null> { try { return mapCategoryDetail(await this.client.get<CategoryDetailDto>(`/api/v1/catalog/categories/${encodeURIComponent(slug)}`, signal)); } catch (error) { if (error instanceof CatalogApiError && error.kind === 'not_found') return null; throw error; } }
  async getSolutions(query: CatalogSolutionQuery = {}, signal?: AbortSignal): Promise<Solution[]> { return (await this.getSolutionsPage(query, signal)).items; }
  async getSolutionsPage(query: CatalogSolutionQuery = {}, signal?: AbortSignal): Promise<PagedResult<Solution>> { const params = new URLSearchParams(); if (query.categorySlug) params.set('category', query.categorySlug); if (query.search) params.set('search', query.search); if (query.featured !== undefined) params.set('featured', String(query.featured)); if (query.tags?.length) params.set('tags', query.tags.join(',')); if (query.useCase) params.set('useCase', query.useCase); if (query.modality) params.set('modality', query.modality); if (query.sort) params.set('sort', query.sort); if (query.page) params.set('page', String(query.page)); if (query.pageSize) params.set('pageSize', String(query.pageSize)); const suffix = params.size ? `?${params}` : ''; const page = await this.client.get<PagedResult<SolutionCardDto>>(`/api/v1/catalog/solutions${suffix}`, signal); return { ...page, items: page.items.map(mapSolutionCard) }; }
  async getSolutionsByCategory(categoryId: string, signal?: AbortSignal): Promise<Solution[]> { const category = (await this.getCategories(signal)).find((item) => item.id === categoryId); return category ? this.getSolutions({ categorySlug: category.slug, pageSize: 100 }, signal) : []; }
  async getSolutionBySlug(slug: string, signal?: AbortSignal): Promise<Solution | null> { try { return mapSolutionDetail(await this.client.get<SolutionDetailDto>(`/api/v1/catalog/solutions/${encodeURIComponent(slug)}`, signal)); } catch (error) { if (error instanceof CatalogApiError && error.kind === 'not_found') return null; throw error; } }
  async getFeaturedSolutions(signal?: AbortSignal): Promise<Solution[]> { return (await this.client.get<SolutionCardDto[]>('/api/v1/catalog/featured', signal)).map(mapSolutionCard); }
}
export class MockProjectRequestRepository implements ProjectRequestRepository { async create(_request: CreateProjectRequestDto): Promise<ProjectRequestCreatedDto> { return { id: crypto.randomUUID(), requestNumber: 'APX-000001', status: 'New', createdAt: new Date().toISOString() }; } }
export class ApiProjectRequestRepository implements ProjectRequestRepository { private readonly client: ApiClient; constructor(baseUrl = import.meta.env.VITE_API_URL ?? '', fetchImpl: typeof fetch = fetch) { this.client = new ApiClient(baseUrl, fetchImpl); } create(request: CreateProjectRequestDto): Promise<ProjectRequestCreatedDto> { return this.client.post('/api/v1/project-requests', request); } }
export class ApiMediaRepository implements MediaRepository { async createUpload(_request: CreateMediaUploadRequest): Promise<MediaUploadResultDto> { throw new Error('Admin-only repository'); } async updateMetadata(_solutionId: string, _mediaId: string): Promise<SolutionMedia> { throw new Error('Admin-only repository'); } async setCover(_solutionId: string, _mediaId: string): Promise<SolutionMedia> { throw new Error('Admin-only repository'); } async delete(_solutionId: string, _mediaId: string): Promise<void> { throw new Error('Admin-only repository'); } }
const useApi = import.meta.env.VITE_USE_API === 'true' && Boolean(import.meta.env.VITE_API_URL);
export const catalogRepository: CatalogRepository = useApi ? new ApiCatalogRepository() : new MockCatalogRepository();
export const projectRequestRepository: ProjectRequestRepository = useApi ? new ApiProjectRequestRepository() : new MockProjectRequestRepository();
