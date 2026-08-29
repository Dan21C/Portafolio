import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { catalogRepository } from '../repositories/catalogRepositories';
import { projectStorage } from '../services/projectStorage';

const CatalogContext = createContext(null);
const mergeById = (current, incoming) => [...new Map([...current, ...incoming].map((item) => [item.id, item])).values()];

export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]); const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  const [selection, setSelection] = useState(projectStorage.get); const [drawerOpen, setDrawerOpen] = useState(false);
  const loadCategories = useCallback(async (signal) => { try { const items = await catalogRepository.getCategories(signal); setCategories(items); setError(null); return items; } catch (reason) { if (reason?.name !== 'AbortError') setError(reason); throw reason; } finally { if (!signal?.aborted) setLoading(false); } }, []);
  useEffect(() => { const controller = new AbortController(); catalogRepository.getCategories(controller.signal).then((items) => { setCategories(items); setError(null); }).catch((reason) => { if (reason?.name !== 'AbortError') setError(reason); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, []);
  useEffect(() => projectStorage.save(selection), [selection]);
  const rememberSolutions = useCallback((items) => setSolutions((current) => mergeById(current, items)), []);
  const loadSolutions = useCallback(async (query, signal) => { const result = await catalogRepository.getSolutionsPage(query, signal); rememberSolutions(result.items); return result; }, [rememberSolutions]);
  const loadCategory = useCallback((slug, signal) => catalogRepository.getCategoryBySlug(slug, signal), []);
  const loadSolution = useCallback(async (slug, signal) => { const item = await catalogRepository.getSolutionBySlug(slug, signal); if (item) rememberSolutions([item]); return item; }, [rememberSolutions]);
  const add = useCallback((solutionId) => { setSelection((items) => items.some(i => i.solutionId === solutionId) ? items : [...items, { solutionId, quantity: 1, addedAt: new Date().toISOString() }]); setDrawerOpen(true); }, []);
  const remove = useCallback((id) => setSelection(items => items.filter(i => i.solutionId !== id)), []);
  const clearProject = useCallback(() => { setSelection([]); projectStorage.clear(); setDrawerOpen(false); }, []);
  const value = useMemo(() => ({ categories, solutions, loading, error, retryCategories: loadCategories, loadSolutions, loadCategory, loadSolution, rememberSolutions, selection, add, remove, clearProject, drawerOpen, setDrawerOpen }), [categories, solutions, loading, error, loadCategories, loadSolutions, loadCategory, loadSolution, rememberSolutions, selection, add, remove, clearProject, drawerOpen]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCatalog = () => useContext(CatalogContext);
