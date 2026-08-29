import { useMemo, useState } from 'react';
import { CatalogHero, CatalogShell, CatalogToolbar, CategoryCard, SolutionGrid } from '../components/CatalogComponents';
import { useCatalog } from '../hooks/CatalogContext';
import styles from '../catalog.module.css';
import { CATEGORY_IDS } from '../../../../catalog-core/seed';

const labels = { [CATEGORY_IDS.experiencias]: 'Experiencias', [CATEGORY_IDS.hardware]: 'Hardware', [CATEGORY_IDS.automatizacion]: 'Automatización', [CATEGORY_IDS.ia]: 'IA', [CATEGORY_IDS.datos]: 'Datos', [CATEGORY_IDS.software]: 'Software' };
export default function CatalogPage() {
  const { categories, solutions } = useCatalog(); const [query, setQuery] = useState(''); const [active, setActive] = useState('all'); const [sort, setSort] = useState('featured');
  const filtered = useMemo(() => solutions.filter(s => (active === 'all' || s.categoryId === active) && `${s.name} ${s.shortDescription} ${s.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : Number(b.featured)-Number(a.featured)), [solutions, active, query, sort]);
  return <CatalogShell><CatalogHero query={query} setQuery={setQuery}/><section className={styles.section}><div className={styles.sectionTitle}><p>DESCUBRE POR ÁREA</p><h2>Explora por categoría</h2></div><div className={styles.pills} role="group" aria-label="Filtrar por categoría"><button className={active === 'all' ? styles.active : ''} onClick={() => setActive('all')}>Todos</button>{categories.map(c => <button className={active === c.id ? styles.active : ''} onClick={() => setActive(c.id)} key={c.id}>{labels[c.id]}</button>)}</div><div className={styles.categoryRail}>{categories.map(c => <CategoryCard category={c} key={c.id}/>)}</div></section><section className={styles.section}><div className={styles.sectionTitle}><p>PORTAFOLIO</p><h2>Todas las soluciones</h2></div><CatalogToolbar sort={sort} setSort={setSort}/><SolutionGrid items={filtered}/>{!filtered.length && <p className={styles.noResults}>No encontramos soluciones con esos criterios.</p>}</section></CatalogShell>;
}
