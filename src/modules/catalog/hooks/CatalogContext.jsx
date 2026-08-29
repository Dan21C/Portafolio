import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { catalogRepository } from '../repositories/catalogRepositories';
import { projectStorage } from '../services/projectStorage';

const CatalogContext = createContext(null);
export function CatalogProvider({ children }) {
  const [categories, setCategories] = useState([]); const [solutions, setSolutions] = useState([]);
  const [selection, setSelection] = useState(projectStorage.get); const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => { Promise.all([catalogRepository.getCategories(), catalogRepository.getSolutions()]).then(([c, s]) => { setCategories(c); setSolutions(s); }); }, []);
  useEffect(() => projectStorage.save(selection), [selection]);
  const add = useCallback((solutionId) => { setSelection((items) => items.some(i => i.solutionId === solutionId) ? items : [...items, { solutionId, quantity: 1, addedAt: new Date().toISOString() }]); setDrawerOpen(true); }, []);
  const remove = useCallback((id) => setSelection(items => items.filter(i => i.solutionId !== id)), []);
  const clearProject = useCallback(() => { setSelection([]); projectStorage.clear(); setDrawerOpen(false); }, []);
  const value = useMemo(() => ({ categories, solutions, selection, add, remove, clearProject, drawerOpen, setDrawerOpen }), [categories, solutions, selection, add, remove, clearProject, drawerOpen]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
// The provider and its companion hook intentionally live together as one module boundary.
// eslint-disable-next-line react-refresh/only-export-components
export const useCatalog = () => useContext(CatalogContext);
