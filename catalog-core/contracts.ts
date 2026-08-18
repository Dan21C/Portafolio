import type { PriceMode, ProjectSelection, ProjectRequestStatus, ServiceCategory, Solution, SolutionFeature, SolutionMedia, SolutionSeo, SolutionStatus } from './models';
export interface PagedResult<T> { items: T[]; page: number; pageSize: number; totalItems: number; totalPages: number; }
export interface CatalogSolutionQuery { categorySlug?: string; search?: string; featured?: boolean; tags?: string[]; useCase?: string; modality?: string; sort?: 'featured' | 'name' | 'order' | 'newest'; page?: number; pageSize?: number; }
export interface AdminSolutionQuery { categoryId?: string; search?: string; status?: SolutionStatus; featured?: boolean; sort?: 'featured' | 'name' | 'order' | 'newest'; page?: number; pageSize?: number; }
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
export interface CreateProjectRequestItemDto { solutionId: string; }
export interface CreateProjectRequestDto { name: string; company?: string; email: string; phone: string; city: string; approximateDate?: string | null; attendees?: number | null; message?: string; acceptedPrivacy: boolean; privacyPolicyVersion: string; website?: string; items: CreateProjectRequestItemDto[]; }
export interface ProjectRequestCreatedDto { id: string; requestNumber: string; status: 'New'; createdAt: string; }
export interface AdminProjectRequestQuery { status?: ProjectRequestStatus; search?: string; dateFrom?: string; dateTo?: string; city?: string; sort?: 'newest' | 'oldest'; page?: number; pageSize?: number; }
export interface AdminProjectRequestListDto { id: string; requestNumber: string; name: string; company?: string; email: string; phone: string; city: string; status: ProjectRequestStatus; createdAt: string; }
export interface ProjectRequestItemSnapshotDto { solutionId: string; solutionName: string; solutionSlug: string; categoryName: string; solutionDescription?: string; }
export interface ProjectRequestHistoryDto { id: string; previousStatus?: ProjectRequestStatus; newStatus: ProjectRequestStatus; changedByAdminUserId?: string; createdAt: string; }
export interface AdminProjectRequestDetailDto extends AdminProjectRequestListDto { approximateDate?: string; attendees?: number; message?: string; privacyAcceptedAt: string; privacyPolicyVersion: string; privacyPolicyUrl?: string; updatedAt: string; lastContactedAt?: string; qualifiedAt?: string; wonAt?: string; lostAt?: string; archivedAt?: string; items: ProjectRequestItemSnapshotDto[]; statusHistory: ProjectRequestHistoryDto[]; rowVersion: string; }
export interface RequestOtpDto { channel: 'email' | 'whatsapp'; destination: string; }
export interface OtpChallengeDto { challengeId: string; expiresAt: string; maskedDestination: string; }
export interface VerifyOtpDto { challengeId: string; code: string; }
export interface AuthSessionDto { authenticated: boolean; userId?: string; displayName?: string; email?: string; roles: string[]; permissions: string[]; expiresAt?: string; }
export interface CreateMediaUploadRequest { solutionId: string; file: File; alt: string; isCover?: boolean; order?: number; }
export interface MediaUploadResultDto extends MediaDto {}
export interface UpdateMediaMetadataRequest { alt: string; order: number; }
export interface SolutionEditorData { name: string; slug: string; categoryId: string; shortDescription: string; description: string; gallery: SolutionMedia[]; features: SolutionFeature[]; useCases: string[]; tags: string[]; modalities?: string[]; implementationTime?: string; priceMode: PriceMode; featured: boolean; status: SolutionStatus; seo?: SolutionSeo; }
export type AdminOperationalRole = 'Admin' | 'Editor' | 'Viewer';
export type AdminUserStatus = 'Active' | 'Disabled';
export interface AdminUserQuery { search?: string; role?: AdminOperationalRole; status?: AdminUserStatus; page?: number; pageSize?: number; }
export interface AdminUserListDto { id: string; displayName: string; email: string; role: AdminOperationalRole; status: AdminUserStatus; lastLoginAt?: string; }
export interface AdminUserDetailDto { id: string; displayName: string; email: string; status: AdminUserStatus; roles: AdminOperationalRole[]; createdAt: string; updatedAt: string; lastLoginAt?: string; activeSessionsCount: number; rowVersion: string; }
export interface CreateAdminUserDto { displayName: string; email: string; role: AdminOperationalRole; }
export interface CreateAdminUserResultDto { user: AdminUserDetailDto; invitationSent: boolean; }
export interface UpdateAdminUserDto { displayName: string; role: AdminOperationalRole; rowVersion: string; }
