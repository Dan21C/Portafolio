import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { CatalogShell, SolutionGrid } from '../components/CatalogComponents';
import { useCatalog } from '../hooks/CatalogContext';
import { CATEGORY_IDS } from '../../../../catalog-core/seed';
import styles from '../catalog.module.css';

export default function CategoryPage() {
  const { slug } = useParams(); const { categories, solutions } = useCatalog();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return <CatalogShell><div className={styles.notFound}><h1>Categoría no encontrada</h1><Link to="/productos">Volver al catálogo</Link></div></CatalogShell>;
  const items = solutions.filter((item) => item.categoryId === category.id);
  const capabilities = category.id === CATEGORY_IDS.experiencias ? ['Activaciones', 'Participación', 'Recuerdo'] : ['Estrategia', 'Implementación', 'Evolución'];
  return <CatalogShell><section className={styles.categoryHero}><div><p>ÁREA APX · 0{category.order}</p><h1>{category.name}</h1><h2>{category.shortDescription}</h2></div><img src={category.image} alt={category.name}/></section><section className={styles.section}><div className={styles.capabilities}>{capabilities.map((name, index) => <article key={name}><span>0{index + 1}</span><h3>{name}</h3><p>Una capacidad modular diseñada para adaptarse al contexto de cada proyecto.</p><a href="#soluciones">Explorar <ArrowRight/></a></article>)}</div></section><section className={styles.section} id="soluciones"><div className={styles.sectionTitle}><p>SOLUCIONES</p><h2>Diseñadas para activar ideas</h2></div><SolutionGrid items={items}/></section></CatalogShell>;
}
