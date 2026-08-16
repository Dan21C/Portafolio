import { describe, expect, it, vi } from 'vitest';
import { ApiCatalogRepository } from './catalogRepositories';
import { CatalogApiError } from './apiClient';

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
const media = { id: '20000000-0000-4000-8000-000000000001', url: '/Assets/cover.webp', alt: 'Cover', type: 'image', order: 0, isCover: true };

describe('ApiCatalogRepository', () => {
  it('maps categories to domain models', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(json([{ id: '00000000-0000-4000-8000-000000000001', name: 'Experiencias', slug: 'experiencias', shortDescription: 'Short', image: '/Assets/category.webp', order: 1 }]));
    const result = await new ApiCatalogRepository('https://api.test', fetchMock).getCategories();
    expect(result[0]).toMatchObject({ slug: 'experiencias', isActive: true });
  });

  it('sends supported query parameters and maps solution cards', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(json({ items: [{ id: '10000000-0000-4000-8000-000000000001', categoryId: '00000000-0000-4000-8000-000000000001', name: 'APX', slug: 'apx', shortDescription: 'Short', coverMedia: media, tags: ['eventos'], featured: true }], page: 2, pageSize: 12, totalItems: 20, totalPages: 2 }));
    const result = await new ApiCatalogRepository('https://api.test/', fetchMock).getSolutionsPage({ categorySlug: 'experiencias', search: 'APX', featured: true, tags: ['eventos', 'retail'], useCase: 'eventos', modality: 'renta', sort: 'newest', page: 2, pageSize: 12 });
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(Object.fromEntries(url.searchParams)).toMatchObject({ category: 'experiencias', search: 'APX', featured: 'true', tags: 'eventos,retail', useCase: 'eventos', modality: 'renta', sort: 'newest', page: '2', pageSize: '12' });
    expect(result.items[0]?.gallery[0]).toMatchObject({ url: '/Assets/cover.webp', isCover: true });
  });

  it('maps solution detail instead of exposing the payload object', async () => {
    const payload = { id: '10000000-0000-4000-8000-000000000001', categoryId: '00000000-0000-4000-8000-000000000001', name: 'APX', slug: 'apx', shortDescription: 'Short', description: 'Detail', gallery: [media], features: [], useCases: [], tags: [], modalities: [], priceMode: 'quote', featured: false, status: 'published', relatedSolutionIds: [], order: 1 };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(json(payload)); const result = await new ApiCatalogRepository('https://api.test', fetchMock).getSolutionBySlug('apx');
    expect(result).not.toBe(payload); expect(result?.gallery).not.toBe(payload.gallery); expect(result?.description).toBe('Detail');
  });

  it('converts a detail 404 to null', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(json({ code: 'solution_not_found', detail: 'Missing', traceId: 'trace' }, 404));
    await expect(new ApiCatalogRepository('https://api.test', fetchMock).getSolutionBySlug('missing')).resolves.toBeNull();
  });

  it('preserves ProblemDetails on API errors', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(json({ code: 'validation_error', detail: 'Invalid page', traceId: 'trace-1', errors: { page: ['Invalid'] } }, 400));
    const promise = new ApiCatalogRepository('https://api.test', fetchMock).getSolutions({ page: -1 });
    await expect(promise).rejects.toMatchObject({ kind: 'validation', status: 400, code: 'validation_error', traceId: 'trace-1', detail: 'Invalid page' } satisfies Partial<CatalogApiError>);
  });
});

describe.skipIf(!import.meta.env.VITE_REAL_API_URL)('ApiCatalogRepository real smoke', () => {
  it('loads the frozen public routes through ASP.NET Core and PostgreSQL', async () => {
    const repository = new ApiCatalogRepository(import.meta.env.VITE_REAL_API_URL);
    const [categories, page, category, categoryPage, detail] = await Promise.all([repository.getCategories(), repository.getSolutionsPage({ page: 1, pageSize: 12, sort: 'order' }), repository.getCategoryBySlug('experiencias-interactivas'), repository.getSolutionsPage({ categorySlug: 'experiencias-interactivas', page: 1, pageSize: 12 }), repository.getSolutionBySlug('apx-reflex-matrix')]);
    expect(categories).toHaveLength(6); expect(page.items).toHaveLength(12); expect(page.totalItems).toBe(36); expect(page.totalPages).toBe(3);
    expect(category?.slug).toBe('experiencias-interactivas'); expect(categoryPage.items.length).toBeGreaterThan(0); expect(detail?.slug).toBe('apx-reflex-matrix'); expect(detail?.gallery[0]?.url.startsWith('/')).toBe(true);
  }, 60_000);
});
