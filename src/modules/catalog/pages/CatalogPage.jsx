import { useEffect, useState } from 'react';
import { CatalogError, CatalogLoading, CatalogShell } from '../components/CatalogComponents';
import { AreaFilters, CatalogToolbar, CustomBanner, HelpStrip, MarketplaceHero, Pagination, SavedSummary, SolutionGrid } from '../components/Marketplace';
import { useCatalog } from '../hooks/CatalogContext';
import styles from '../marketplace.module.css';

const PAGE_SIZE = 8;

export default function CatalogPage() {
  const { categories, loading: categoriesLoading, error: categoriesError, retryCategories, loadSolutions } = useCatalog();
  const [query, setQuery] = useState(''); const [debouncedQuery, setDebouncedQuery] = useState(''); const [active, setActive] = useState('all'); const [sort, setSort] = useState('featured'); const [page, setPage] = useState(1);
  const [view, setView] = useState('grid'); const [filtersOpen, setFiltersOpen] = useState(true); const [catalogTotal, setCatalogTotal] = useState(null);
  const [result, setResult] = useState({ items: [], page: 1, pageSize: PAGE_SIZE, totalItems: 0, totalPages: 0 }); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); const [reload, setReload] = useState(0);
  useEffect(() => { const next = query.trim(); if (next === debouncedQuery) return undefined; const timer = window.setTimeout(() => { setDebouncedQuery(next); setPage(1); setLoading(true); setError(null); }, 320); return () => window.clearTimeout(timer); }, [query, debouncedQuery]);
  useEffect(() => { const controller = new AbortController(); loadSolutions({ search: debouncedQuery || undefined, categorySlug: active === 'all' ? undefined : active, sort, page, pageSize: PAGE_SIZE }, controller.signal).then((next) => { setResult(next); if (active === 'all' && !debouncedQuery) setCatalogTotal(next.totalItems); }).catch((reason) => { if (reason?.name !== 'AbortError') setError(reason); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, [active, debouncedQuery, loadSolutions, page, reload, sort]);
  const changeCategory = (value) => { setActive(value); setPage(1); setLoading(true); setError(null); }; const changeSort = (value) => { setSort(value); setPage(1); setLoading(true); setError(null); }; const changePage = (value) => { setPage(value); setLoading(true); setError(null); document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' }); }; const retry = () => { setLoading(true); setError(null); setReload((value) => value + 1); };
  const activeCategory = categories.find((category) => category.slug === active);
  const chips = [activeCategory && { key: 'area', label: activeCategory.name, onRemove: () => changeCategory('all') }, debouncedQuery && { key: 'search', label: `“${debouncedQuery}”`, onRemove: () => setQuery('') }].filter(Boolean);
  const clearFilters = () => { setQuery(''); changeCategory('all'); };
  const total = catalogTotal ?? result.totalItems;
  return <CatalogShell header={false}><div className={styles.page}>
    <MarketplaceHero query={query} setQuery={setQuery} areas={categories.length || 6} total={total}/>
    <section className={styles.filters} aria-labelledby="explora-area">
      <p className={styles.label} id="explora-area">EXPLORA POR ÁREA</p>
      {categoriesError ? <CatalogError message="No pudimos cargar las categorías." onRetry={() => retryCategories().catch(() => {})}/> : filtersOpen && !categoriesLoading && <AreaFilters categories={categories} active={active} onChange={changeCategory}/>}
      <CatalogToolbar chips={chips} onClear={clearFilters} shown={loading ? 0 : result.items.length} total={result.totalItems} view={view} setView={setView} sort={sort} setSort={changeSort} filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}/>
    </section>
    <div className={styles.heading}><p className={styles.label}>SOLUCIONES APX</p><h2>{total} soluciones para<br/>convertir ideas en experiencias.</h2></div>
    <section className={styles.results} id="soluciones" aria-label="Soluciones" aria-busy={loading}>
      {error ? <CatalogError message="No pudimos cargar las soluciones." onRetry={retry}/> : loading ? <CatalogLoading cards={PAGE_SIZE}/> : result.items.length ? <SolutionGrid items={result.items} view={view}/> : <p className={styles.empty}>No encontramos soluciones con esos criterios.</p>}
    </section>
    <div className={styles.pageFoot}>{!loading && !error && <Pagination page={result.page} totalPages={result.totalPages} onChange={changePage}/>}<SavedSummary/></div>
    <HelpStrip/>
    <CustomBanner/>
  </div></CatalogShell>;
}
