import { ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSolutionCover } from '../../../../catalog-core/mappers';
import { useCatalog } from '../hooks/CatalogContext';
import styles from '../catalog.module.css';
import marketplace from '../marketplace.module.css';
import { CatalogFooter } from './Marketplace';

export { Pagination, SolutionCard, SolutionGrid } from './Marketplace';

export function CatalogHeader() {
  const { selection, setDrawerOpen } = useCatalog();
  return <header className={styles.header}><Link to="/" className={styles.logo} aria-label="APX, inicio">APX</Link><nav aria-label="Catálogo"><Link to="/productos">Soluciones</Link><Link to="/solicitar-propuesta">Solicitar propuesta</Link></nav><button className={styles.projectButton} onClick={() => setDrawerOpen(true)}>Mi proyecto <span>{selection.length}</span></button></header>;
}
export function CatalogLoading({ cards = 8 }) { return <div className={styles.skeletonGrid} aria-label="Cargando catálogo">{Array.from({ length: cards }, (_, index) => <div className={styles.skeletonCard} key={index}><span/><i/><i/></div>)}</div>; }
export function CatalogError({ message, onRetry }) { return <div className={styles.errorState} role="alert"><p>{message}</p><button type="button" onClick={onRetry}>Reintentar</button></div>; }
export function ProjectDrawer() { const { drawerOpen, setDrawerOpen, selection, solutions, remove } = useCatalog(); const selected = selection.map(i => solutions.find(s => s.id === i.solutionId)).filter(Boolean); return <><button className={`${styles.scrim} ${drawerOpen ? styles.open : ''}`} aria-label="Cerrar Mi proyecto" onClick={() => setDrawerOpen(false)}/><aside className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`} aria-hidden={!drawerOpen}><div className={styles.drawerHead}><div><small>SELECCIÓN</small><h2>Mi proyecto</h2></div><button onClick={() => setDrawerOpen(false)} aria-label="Cerrar"><X/></button></div><div className={styles.drawerItems}>{selected.length ? selected.map(item => { const cover = getSolutionCover(item); return <div className={styles.projectItem} key={item.id}><div>{cover ? <img src={cover.url} alt=""/> : <span>APX</span>}</div><p><b>{item.name}</b><small>{item.shortDescription}</small></p><button onClick={() => remove(item.id)} aria-label={`Quitar ${item.name}`}><X/></button></div>; }) : <p className={styles.empty}>Agrega soluciones para construir el alcance de tu proyecto.</p>}</div><div className={styles.drawerFoot}><p><b>{selected.length}</b> {selected.length === 1 ? 'solución' : 'soluciones'}</p><Link className={styles.primary} to="/solicitar-propuesta" onClick={() => setDrawerOpen(false)}>Continuar <ArrowRight/></Link></div></aside></>; }
export function CatalogShell({ children, header = true }) { return <div className={`${styles.catalog} ${marketplace.tokens}`}>{header && <CatalogHeader/>}<main>{children}</main><CatalogFooter/><ProjectDrawer/></div>; }
