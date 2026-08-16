import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CatalogError, CatalogLoading, CatalogShell, SolutionGrid } from '../components/CatalogComponents';
import { useCatalog } from '../hooks/CatalogContext';
import styles from '../catalog.module.css';

export default function CategoryPage() {
  const { slug } = useParams(); const { loadCategory, loadSolutions } = useCatalog(); const [category, setCategory] = useState(null); const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null); const [notFound, setNotFound] = useState(false); const [reload, setReload] = useState(0);
  useEffect(() => { const controller = new AbortController(); Promise.all([loadCategory(slug, controller.signal), loadSolutions({ categorySlug: slug, page: 1, pageSize: 100, sort: 'order' }, controller.signal)]).then(([categoryResult, solutionResult]) => { if (!categoryResult) { setNotFound(true); return; } setCategory(categoryResult); setItems(solutionResult.items); }).catch((reason) => { if (reason?.name !== 'AbortError') setError(reason); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); }, [loadCategory, loadSolutions, reload, slug]);
  if (loading) return <CatalogShell><section className={styles.section}><CatalogLoading cards={6}/></section></CatalogShell>;
  if (notFound) return <CatalogShell><div className={styles.notFound}><h1>Categoría no encontrada</h1><Link to="/productos">Volver al catálogo</Link></div></CatalogShell>;
  if (error || !category) return <CatalogShell><div className={styles.notFound}><CatalogError message="No pudimos cargar esta categoría." onRetry={() => { setLoading(true); setError(null); setNotFound(false); setReload((value) => value + 1); }}/></div></CatalogShell>;
  const capabilities = category.slug === 'experiencias-interactivas' ? ['Activaciones', 'Participación', 'Recuerdo'] : ['Estrategia', 'Implementación', 'Evolución'];
  return <CatalogShell><section className={styles.categoryHero}><div><p>ÁREA APX · 0{category.order}</p><h1>{category.name}</h1><h2>{category.shortDescription}</h2></div>{category.image && <img src={category.image} alt={category.name}/>}</section><section className={styles.section}><div className={styles.capabilities}>{capabilities.map((name, index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>Una capacidad modular diseñada para adaptarse al contexto de cada proyecto.</p><a href="#soluciones">Explorar <ArrowRight/></a></article>)}</div></section><section className={styles.section} id="soluciones"><div className={styles.sectionTitle}><p>SOLUCIONES</p><h2>Diseñadas para activar ideas</h2></div><SolutionGrid items={items}/></section></CatalogShell>;
}
