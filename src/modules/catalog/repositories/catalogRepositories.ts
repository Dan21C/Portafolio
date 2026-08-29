import { categories, solutions } from '../../../../catalog-core/seed';
import type { CatalogSolutionQuery, CreateMediaUploadRequest, CreateProjectRequestDto, MediaUploadResultDto, ProjectRequestCreatedDto } from '../../../../catalog-core/contracts';
import type { CatalogRepository, MediaRepository, ProjectRequestRepository } from '../../../../catalog-core/repositories';
import type { ServiceCategory, Solution, SolutionMedia } from '../../../../catalog-core/models';

const clone = <T>(value: T): T => structuredClone(value);
export class MockCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<ServiceCategory[]> { return clone(categories.filter((item) => item.isActive).sort((a, b) => a.order - b.order)); }
  async getCategoryBySlug(slug: string): Promise<ServiceCategory | null> { return (await this.getCategories()).find((item) => item.slug === slug) ?? null; }
  async getSolutions(query: CatalogSolutionQuery = {}): Promise<Solution[]> {
    let result = clone(solutions.filter((item) => item.status === 'published'));
    if (query.categorySlug) { const category = categories.find((item) => item.slug === query.categorySlug); result = result.filter((item) => item.categoryId === category?.id); }
    if (query.search) { const term = query.search.toLocaleLowerCase(); result = result.filter((item) => `${item.name} ${item.shortDescription} ${item.tags.join(' ')}`.toLocaleLowerCase().includes(term)); }
    if (query.featured !== undefined) result = result.filter((item) => item.featured === query.featured);
    return result.sort((a, b) => a.order - b.order);
  }
  async getSolutionsByCategory(categoryId: string): Promise<Solution[]> { return (await this.getSolutions()).filter((item) => item.categoryId === categoryId); }
  async getSolutionBySlug(slug: string): Promise<Solution | null> { return (await this.getSolutions()).find((item) => item.slug === slug) ?? null; }
  async getFeaturedSolutions(): Promise<Solution[]> { return this.getSolutions({ featured: true }); }
}
export class ApiCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<ServiceCategory[]> { throw new Error('TODO BACKEND PHASE'); }
  async getCategoryBySlug(_slug: string): Promise<ServiceCategory | null> { throw new Error('TODO BACKEND PHASE'); }
  async getSolutions(_query?: CatalogSolutionQuery): Promise<Solution[]> { throw new Error('TODO BACKEND PHASE'); }
  async getSolutionsByCategory(_categoryId: string): Promise<Solution[]> { throw new Error('TODO BACKEND PHASE'); }
  async getSolutionBySlug(_slug: string): Promise<Solution | null> { throw new Error('TODO BACKEND PHASE'); }
  async getFeaturedSolutions(): Promise<Solution[]> { throw new Error('TODO BACKEND PHASE'); }
}
export class MockProjectRequestRepository implements ProjectRequestRepository { async create(_request: CreateProjectRequestDto): Promise<ProjectRequestCreatedDto> { return { id: crypto.randomUUID(), status: 'received', createdAt: new Date().toISOString() }; } }
export class ApiProjectRequestRepository implements ProjectRequestRepository { async create(_request: CreateProjectRequestDto): Promise<ProjectRequestCreatedDto> { throw new Error('TODO BACKEND PHASE'); } }
export class ApiMediaRepository implements MediaRepository { async createUpload(_request: CreateMediaUploadRequest): Promise<MediaUploadResultDto> { throw new Error('TODO BACKEND PHASE'); } async saveMetadata(_media: SolutionMedia[]): Promise<SolutionMedia[]> { throw new Error('TODO BACKEND PHASE'); } }
// Contract switch point: replace these defaults with API adapters in the backend phase.
export const catalogRepository: CatalogRepository = new MockCatalogRepository();
export const projectRequestRepository: ProjectRequestRepository = new MockProjectRequestRepository();
