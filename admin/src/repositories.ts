import { categories as seedCategories, solutions as seedSolutions, slugify, CATEGORY_IDS } from '../../catalog-core/seed';
import { getSolutionCover } from '../../catalog-core/mappers';
import type { AdminCatalogRepository, AuthRepository, MediaRepository } from '../../catalog-core/repositories';
import type { AdminSolutionListItem, AdminSolutionQuery, CreateCategoryInput, CreateMediaUploadRequest, CreateSolutionInput, MediaUploadResultDto, OtpChallengeDto, PagedResult, ReorderCategoryItem, RequestOtpDto, UpdateCategoryInput, UpdateMediaMetadataRequest, UpdateSolutionInput, VerifyOtpDto } from '../../catalog-core/contracts';
import type { AuthSession, ServiceCategory, Solution, SolutionMedia } from '../../catalog-core/models';
import { AdminApiError, adminApiConfigured, apiRequest } from './api/apiClient';

const SOLUTIONS = 'apx-admin-solutions'; const CATEGORIES = 'apx-admin-categories';
const read = <T>(key: string, seed: T): T => { try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) as T : structuredClone(seed); } catch { return structuredClone(seed); } };
const save = <T>(key: string, value: T): T => { localStorage.setItem(key, JSON.stringify(value)); return structuredClone(value); };
const LEGACY_CATEGORY_IDS: Record<string, string> = { experiencias: CATEGORY_IDS.experiencias, hardware: CATEGORY_IDS.hardware, automatizacion: CATEGORY_IDS.automatizacion, ia: CATEGORY_IDS.ia, datos: CATEGORY_IDS.datos, software: CATEGORY_IDS.software };
const normalizeSolution = (value: Solution & { published?: boolean; coverImage?: string }): Solution => ({ ...value, categoryId: LEGACY_CATEGORY_IDS[value.categoryId] ?? value.categoryId, status: value.status ?? (value.published === false ? 'draft' : 'published'), gallery: value.gallery?.map((media, index) => ({ ...media, isCover: media.isCover ?? index === 0 })) ?? (value.coverImage ? [{ id: crypto.randomUUID(), url: value.coverImage, alt: value.name, type: 'image', order: 1, isCover: true }] : []) });
const allSolutions = (): Solution[] => read<(Solution & { published?: boolean; coverImage?: string })[]>(SOLUTIONS, seedSolutions).map(normalizeSolution);

export class MockAuthRepository implements AuthRepository {
  private session: AuthSession | null = null;
  async requestCode(request: RequestOtpDto): Promise<OtpChallengeDto> { return { challengeId: crypto.randomUUID(), expiresAt: new Date(Date.now() + 300_000).toISOString(), maskedDestination: request.destination }; }
  async verifyCode(request: VerifyOtpDto): Promise<AuthSession> { this.session = request.code === '123456' ? { authenticated: true, userId: 'mock-admin', displayName: 'Admin APX', roles: ['Admin'], permissions: ['admin.read', 'content.write', 'content.publish', 'content.delete', 'category.manage', 'media.write'] } : null; return this.session ?? { authenticated: false, roles: [], permissions: [] }; }
  async getCurrentSession(): Promise<AuthSession | null> { return this.session; }
  async logout(): Promise<void> { this.session = null; }
}
export class ApiAuthRepository implements AuthRepository {
  requestCode(request: RequestOtpDto): Promise<OtpChallengeDto> { return apiRequest('/api/v1/auth/otp/request', { method: 'POST', body: JSON.stringify(request), skipUnauthorizedHandler: true }); }
  async verifyCode(request: VerifyOtpDto): Promise<AuthSession> { await apiRequest<AuthSession>('/api/v1/auth/otp/verify', { method: 'POST', body: JSON.stringify(request), skipUnauthorizedHandler: true }); return (await this.getCurrentSession())!; }
  async getCurrentSession(): Promise<AuthSession | null> { try { return await apiRequest('/api/v1/auth/me', { skipUnauthorizedHandler: true }); } catch (error) { if (error instanceof AdminApiError && error.status === 401) return null; throw error; } }
  logout(): Promise<void> { return apiRequest('/api/v1/auth/logout', { method: 'POST' }); }
}
export class MockAdminCatalogRepository implements AdminCatalogRepository {
  async getSolutions(query: AdminSolutionQuery = {}): Promise<PagedResult<AdminSolutionListItem>> { let result = allSolutions(); if (query.search) result = result.filter((item) => item.name.toLocaleLowerCase().includes(query.search!.toLocaleLowerCase())); if (query.categoryId) result = result.filter((item) => item.categoryId === query.categoryId); if (query.status) result = result.filter((item) => item.status === query.status); const page = query.page ?? 1; const pageSize = query.pageSize ?? Math.max(result.length, 1); const items = result.slice((page - 1) * pageSize, page * pageSize).map((item) => ({ id: item.id, name: item.name, slug: item.slug, categoryId: item.categoryId, status: item.status, featured: item.featured, coverMedia: getSolutionCover(item) })); return { items, page, pageSize, totalItems: result.length, totalPages: Math.ceil(result.length / pageSize) }; }
  async getSolutionById(id: string): Promise<Solution | null> { return allSolutions().find((item) => item.id === id) ?? null; }
  async createSolution(input: CreateSolutionInput): Promise<Solution> { const all = allSolutions(); const item: Solution = { ...input, id: crypto.randomUUID(), slug: input.slug || slugify(input.name), order: input.order ?? all.length + 1 }; save(SOLUTIONS, [...all, item]); return item; }
  async updateSolution(id: string, input: UpdateSolutionInput): Promise<Solution> { const all = allSolutions(); const current = all.find((item) => item.id === id); if (!current) throw new Error(`Solution ${id} not found`); const item = { ...current, ...input }; save(SOLUTIONS, all.map((entry) => entry.id === id ? item : entry)); return item; }
  async deleteSolution(id: string): Promise<void> { save(SOLUTIONS, allSolutions().filter((item) => item.id !== id)); }
  async duplicateSolution(id: string): Promise<Solution> { const item = await this.getSolutionById(id); if (!item) throw new Error(`Solution ${id} not found`); const { id: _id, order: _order, publishedAt: _publishedAt, ...copy } = item; return this.createSolution({ ...copy, name: `${item.name} (copia)`, slug: `${item.slug}-copia`, status: 'draft' }); }
  async publishSolution(id: string): Promise<Solution> { return this.updateSolution(id, { status: 'published', publishedAt: new Date().toISOString() }); }
  async unpublishSolution(id: string): Promise<Solution> { return this.updateSolution(id, { status: 'draft', publishedAt: undefined }); }
  async getCategories(): Promise<ServiceCategory[]> { return read<ServiceCategory[]>(CATEGORIES, seedCategories).map((item) => ({ ...item, id: LEGACY_CATEGORY_IDS[item.id] ?? item.id })); }
  async createCategory(input: CreateCategoryInput): Promise<ServiceCategory> { const all = await this.getCategories(); const item = { ...input, id: crypto.randomUUID(), order: input.order ?? all.length + 1 }; save(CATEGORIES, [...all, item]); return item; }
  async updateCategory(id: string, input: UpdateCategoryInput): Promise<ServiceCategory> { const all = await this.getCategories(); const current = all.find((item) => item.id === id); if (!current) throw new Error(`Category ${id} not found`); const item = { ...current, ...input }; save(CATEGORIES, all.map((entry) => entry.id === id ? item : entry)); return item; }
  async deleteCategory(id: string): Promise<void> { save(CATEGORIES, (await this.getCategories()).filter((item) => item.id !== id)); }
  async reorderCategories(items: ReorderCategoryItem[]): Promise<void> { const orders = new Map(items.map((item) => [item.id, item.order])); save(CATEGORIES, (await this.getCategories()).map((item) => ({ ...item, order: orders.get(item.id) ?? item.order })).sort((a, b) => a.order - b.order)); }
}
export class ApiAdminCatalogRepository implements AdminCatalogRepository {
  getSolutions(query: AdminSolutionQuery = {}): Promise<PagedResult<AdminSolutionListItem>> { const p = new URLSearchParams(); if (query.search) p.set('search', query.search); if (query.categoryId) p.set('category', query.categoryId); if (query.status) p.set('status', query.status); if (query.featured !== undefined) p.set('featured', String(query.featured)); if (query.sort) p.set('sort', query.sort); p.set('page', String(query.page ?? 1)); p.set('pageSize', String(query.pageSize ?? 12)); return apiRequest(`/api/v1/admin/solutions?${p}`); }
  async getSolutionById(id: string): Promise<Solution | null> { try { return await apiRequest(`/api/v1/admin/solutions/${id}`); } catch (error) { if (error instanceof AdminApiError && error.status === 404) return null; throw error; } }
  createSolution(input: CreateSolutionInput): Promise<Solution> { return apiRequest('/api/v1/admin/solutions', { method: 'POST', body: JSON.stringify(solutionPayload(input)) }); }
  updateSolution(id: string, input: UpdateSolutionInput): Promise<Solution> { return apiRequest(`/api/v1/admin/solutions/${id}`, { method: 'PUT', body: JSON.stringify(solutionPayload(input, true)) }); }
  deleteSolution(id: string): Promise<void> { return apiRequest(`/api/v1/admin/solutions/${id}`, { method: 'DELETE' }); }
  duplicateSolution(id: string): Promise<Solution> { return apiRequest(`/api/v1/admin/solutions/${id}/duplicate`, { method: 'POST', body: '{}' }); }
  publishSolution(id: string): Promise<Solution> { return apiRequest(`/api/v1/admin/solutions/${id}/publish`, { method: 'POST' }); }
  unpublishSolution(id: string): Promise<Solution> { return apiRequest(`/api/v1/admin/solutions/${id}/unpublish`, { method: 'POST' }); }
  getCategories(): Promise<ServiceCategory[]> { return apiRequest('/api/v1/admin/categories'); }
  createCategory(input: CreateCategoryInput): Promise<ServiceCategory> { return apiRequest('/api/v1/admin/categories', { method: 'POST', body: JSON.stringify(input) }); }
  updateCategory(id: string, input: UpdateCategoryInput): Promise<ServiceCategory> { return apiRequest(`/api/v1/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(input) }); }
  deleteCategory(id: string): Promise<void> { return apiRequest(`/api/v1/admin/categories/${id}`, { method: 'DELETE' }); }
  reorderCategories(items: ReorderCategoryItem[]): Promise<void> { return apiRequest('/api/v1/admin/categories/reorder', { method: 'PUT', body: JSON.stringify({ items }) }); }
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const solutionPayload = (input: CreateSolutionInput | UpdateSolutionInput, updating = false) => ({
  ...(updating ? { rowVersion: (input as Solution).rowVersion ?? '' } : {}), name: input.name ?? '', slug: input.slug ?? '', categoryId: input.categoryId, eyebrow: input.eyebrow ?? null,
  shortDescription: input.shortDescription ?? '', description: input.description ?? '', features: (input.features ?? []).map(({ title, description }) => ({ title, description: description ?? null })),
  useCaseIds: (input.useCases ?? []).filter((value) => uuid.test(value)), tagIds: (input.tags ?? []).filter((value) => uuid.test(value)), modalityIds: (input.modalities ?? []).filter((value) => uuid.test(value)),
  implementationTime: input.implementationTime ?? null, priceMode: input.priceMode ?? 'quote', priceFrom: input.priceFrom ?? null, priceTo: input.priceTo ?? null, currency: input.currency ?? null,
  featured: input.featured ?? false, status: input.status ?? 'draft', seo: input.seo ?? null,
  media: (input.gallery ?? []).filter((media) => media.storageKey && !media.url.startsWith('blob:')).map((media) => ({ url: media.url, alt: media.alt, type: media.type, order: media.order, isCover: media.isCover, storageKey: media.storageKey, mimeType: media.mimeType ?? null, width: media.width ?? null, height: media.height ?? null, bytes: media.bytes ?? null })), order: input.order ?? 0
});

export class MockMediaRepository implements MediaRepository { async createUpload(_request: CreateMediaUploadRequest): Promise<MediaUploadResultDto> { throw new Error('Mock uploads use URL.createObjectURL in the editor'); } async updateMetadata(_solutionId: string, _mediaId: string, request: UpdateMediaMetadataRequest): Promise<SolutionMedia> { throw new Error(`Mock metadata: ${request.alt}`); } async setCover(): Promise<SolutionMedia> { throw new Error('Mock cover is local'); } async delete(): Promise<void> {} }
export class ApiMediaRepository implements MediaRepository {
  createUpload(request: CreateMediaUploadRequest): Promise<MediaUploadResultDto> { const form = new FormData(); form.append('file', request.file); form.append('alt', request.alt); form.append('isCover', String(request.isCover ?? false)); form.append('order', String(request.order ?? 0)); return apiRequest(`/api/v1/admin/solutions/${request.solutionId}/media`, { method: 'POST', body: form }); }
  updateMetadata(solutionId: string, mediaId: string, request: UpdateMediaMetadataRequest): Promise<SolutionMedia> { return apiRequest(`/api/v1/admin/solutions/${solutionId}/media/${mediaId}`, { method: 'PUT', body: JSON.stringify(request) }); }
  setCover(solutionId: string, mediaId: string): Promise<SolutionMedia> { return apiRequest(`/api/v1/admin/solutions/${solutionId}/media/${mediaId}/cover`, { method: 'PUT' }); }
  delete(solutionId: string, mediaId: string): Promise<void> { return apiRequest(`/api/v1/admin/solutions/${solutionId}/media/${mediaId}`, { method: 'DELETE' }); }
}
export const authRepository: AuthRepository = adminApiConfigured ? new ApiAuthRepository() : new MockAuthRepository();
export const adminRepository: AdminCatalogRepository = adminApiConfigured ? new ApiAdminCatalogRepository() : new MockAdminCatalogRepository();
export const mediaRepository: MediaRepository = adminApiConfigured ? new ApiMediaRepository() : new MockMediaRepository();
