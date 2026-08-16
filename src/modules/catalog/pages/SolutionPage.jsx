import { ArrowRight, Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getSolutionCover } from '../../../../catalog-core/mappers';
import { CatalogShell, SolutionGrid } from '../components/CatalogComponents';
import { useCatalog } from '../hooks/CatalogContext';
import styles from '../catalog.module.css';

export default function SolutionPage() {
  const { slug } = useParams(); const { categories, solutions, selection, add } = useCatalog();
  const solution = solutions.find((item) => item.slug === slug);
  if (!solution) return <CatalogShell><div className={styles.notFound}><h1>Solución no encontrada</h1><Link to="/productos">Volver al catálogo</Link></div></CatalogShell>;
  const category = categories.find((item) => item.id === solution.categoryId); const cover = getSolutionCover(solution);
  const added = selection.some((item) => item.solutionId === solution.id); const related = solutions.filter((item) => item.categoryId === solution.categoryId && item.id !== solution.id).slice(0, 4);
  return <CatalogShell><section className={styles.detail}><div className={styles.gallery}>{cover ? <img src={cover.url} alt={cover.alt || solution.name}/> : <div className={styles.detailPlaceholder}><b>APX</b><span>{solution.name}</span></div>}<div className={styles.thumbs}>{(solution.gallery.length ? solution.gallery : [{ id: 'placeholder' }]).map((media, index) => <button key={media.id} aria-label={`Ver imagen ${index + 1}`}>{media.url ? <img src={media.url} alt=""/> : <span>APX</span>}</button>)}</div></div><div className={styles.detailInfo}><p className={styles.eyebrow}>{category?.name}</p><h1>{solution.name}</h1><p className={styles.lead}>{solution.description}</p><div className={styles.tags}>{solution.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p className={styles.quote}>Cotización según alcance</p><button className={styles.primary} onClick={() => add(solution.id)} disabled={added}>{added ? <><Check/> Agregado a Mi proyecto</> : <>Agregar a mi proyecto <ArrowRight/></>}</button><Link className={styles.secondary} to="/solicitar-propuesta">Solicitar propuesta</Link></div></section><section className={styles.infoGrid}><div><p className={styles.eyebrow}>LO ESENCIAL</p><h2>Una solución lista para adaptarse.</h2></div><div><h3>Beneficios</h3>{solution.features.map((feature) => <p key={feature.id}><Check/>{feature.title}</p>)}</div><div><h3>Ideal para</h3><p>{solution.useCases.join(' · ')}</p><h3>Modalidad</h3><p>{solution.modalities?.join(' · ')}</p><h3>Implementación</h3><p>{solution.implementationTime}</p></div></section><section className={styles.section}><div className={styles.sectionTitle}><p>TAMBIÉN PUEDE INTERESARTE</p><h2>Soluciones relacionadas</h2></div><SolutionGrid items={related}/></section></CatalogShell>;
}
