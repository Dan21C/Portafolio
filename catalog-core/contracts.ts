import type { PriceMode, ProjectSelection, ServiceCategory, Solution, SolutionFeature, SolutionMedia, SolutionSeo, SolutionStatus } from './models';
export interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalItems: number; totalPages: number; }
export interface CatalogSolutionQuery { categorySlug?: string; search?: string; featured?: boolean; tags?: string[]; sort?: 'featured' | 'name' | 'order'; page?: number; pageSize?: number; }
export interface AdminSolutionQuery { categoryId?: string; search?: string; status?: SolutionStatus; page?: number; pageSize?: number; }
export interface MediaDto extends SolutionMedia {}
export interface CategoryListDto { id: string; name: string; slug: string; shortDescription: string; image?: string; order: number; }
export interface CategoryDetailDto extends CategoryListDto { description?: string; icon?: string; }
export interface SolutionCardDto { id: string; categoryId: string; name: string; slug: string; eyebrow?: string; shortDescription: string; coverMedia?: MediaDto; tags: string[]; featured: boolean; }
export interface SolutionDetailDto extends Omit<Solution, 'gallery'> { gallery: MediaDto[]; }
export interface AdminSolutionListItem { id: string; name: string; slug: string; categoryId: string; status: SolutionStatus; featured: boolean; coverMedia?: MediaDto; }
export interface AdminSolutionListDto extends AdminSolutionListItem {}
export type CreateSolutionInput = Omit<Solution, 'id' | 'order' | 'publishedAt'> & { order?: number; publishedAt?: string };
export type UpdateSolutionInput = Partial<Omit<Solution, 'id'>>;
export interface CreateSolutionRequest extends CreateSolutionInput {}
export interface UpdateSolutionRequest extends UpdateSolutionInput {}
export interface DuplicateSolutionRequest { name?: string; slug?: string; includeMedia?: boolean; }
export type CreateCategoryInput = Omit<ServiceCategory, 'id' | 'order'> & { order?: number };
export type UpdateCategoryInput = Partial<Omit<ServiceCategory, 'id'>>;
export interface CreateCategoryRequest extends CreateCategoryInput {}
export interface UpdateCategoryRequest extends UpdateCategoryInput {}
export interface ReorderCategoryItem { id: string; order: number; }
export interface ReorderCategoriesRequest { items: ReorderCategoryItem[]; }
export interface CreateProjectRequestItemDto extends ProjectSelection {}
export interface CreateProjectRequestDto { name: string; company: string; email: string; phone: string; projectType: string; city: string; approximateDate?: string | null; attendees?: number | null; message: string; items: CreateProjectRequestItemDto[]; }
export interface ProjectRequestCreatedDto { id: string; status: 'received'; createdAt: string; }
export interface RequestOtpDto { channel: 'email' | 'whatsapp'; destination: string; }
export interface OtpChallengeDto { challengeId: string; expiresAt: string; maskedDestination: string; }
export interface VerifyOtpDto { challengeId: string; code: string; }
export interface AuthSessionDto { authenticated: boolean; userId?: string; displayName?: string; roles: string[]; expiresAt?: string; }
export interface CreateMediaUploadRequest { fileName: string; mimeType: string; bytes: number; solutionId?: string; }
export interface MediaUploadResultDto { mediaId: string; storageKey: string; url: string; }
export interface SolutionEditorData { name: string; slug: string; categoryId: string; shortDescription: string; description: string; gallery: SolutionMedia[]; features: SolutionFeature[]; useCases: string[]; tags: string[]; modalities?: string[]; implementationTime?: string; priceMode: PriceMode; featured: boolean; status: SolutionStatus; seo?: SolutionSeo; }
