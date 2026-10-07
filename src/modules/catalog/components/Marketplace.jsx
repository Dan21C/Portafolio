import { ArrowLeft, ArrowRight, BarChart3, Box, ChevronDown, Cpu, Gamepad2, LayoutGrid, Link2, List, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSolutionCover } from '../../../../catalog-core/mappers';
import { useCatalog } from '../hooks/CatalogContext';
import styles from '../marketplace.module.css';

const ASSETS = '/Assets/Catalog';
const AREA_ICONS = { 'experiencias-interactivas': Gamepad2, 'hardware-tecnologico': Cpu, 'automatizacion-integraciones': Link2, 'ia-aplicada': Sparkles, 'analitica-datos': BarChart3, 'software-medida': Box };
const SORT_OPTIONS = [['featured', 'Destacados'], ['order', 'Orden APX'], ['name', 'Nombre'], ['newest', 'Más recientes']];
const NEW_WINDOW_MS = 1000 * 60 * 60 * 24 * 60;

const formatAmount = (value) => { const text = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value); return value >= 1_000_000 ? text.replace('.', '’') : text; };
function formatPrice(solution) {
  const { priceMode, priceFrom, priceTo, currency = 'COP' } = solution;
  if (priceMode === 'range' && priceFrom && priceTo) return `$${formatAmount(priceFrom)} – $${formatAmount(priceTo)} ${currency}`;
  if (priceMode === 'startingAt' && priceFrom) return `Desde $${formatAmount(priceFrom)} ${currency}`;
  if (priceMode === 'fixed' && priceFrom) return `$${formatAmount(priceFrom)} ${currency}`;
  return 'Precio a cotizar';
}
function badgeFor(solution) {
  if (solution.featured) return { label: 'Popular', tone: 'blue' };
  if (/personaliz/i.test(solution.name)) return { label: 'Personalizable', tone: 'blue' };
  if (solution.publishedAt && Date.now() - Date.parse(solution.publishedAt) < NEW_WINDOW_MS) return { label: 'Nuevo', tone: 'green' };
  return { label: 'Listo', tone: 'green' };
}

export function MarketplaceHero({ query, setQuery, areas, total }) {
  const { selection, setDrawerOpen } = useCatalog();
  return <section className={styles.hero}>
    <img className={styles.heroImage} src={`${ASSETS}/hero.webp`} alt="" fetchPriority="high"/>
    <header className={styles.heroNav}>
      <Link to="/" className={styles.logo} aria-label="APX, inicio">APX</Link>
      <nav aria-label="Catálogo"><Link to="/productos" aria-current="page">Soluciones</Link><Link to="/solicitar-propuesta">Solicitar propuesta</Link></nav>
      <button type="button" className={styles.projectPill} onClick={() => setDrawerOpen(true)}>Mi proyecto <span>{selection.length}</span></button>
    </header>
    <div className={styles.heroContent}>
      <p className={styles.crumbs}><Link to="/">Inicio</Link><span aria-hidden="true">/</span><span>Soluciones</span></p>
      <p className={styles.eyebrow}>CATÁLOGO APX • 2026</p>
      <h1>Encuentra la tecnología<br/>que necesita tu idea.</h1>
      <p className={styles.lead}>Explora soluciones para experiencias, operaciones y productos digitales.</p>
      <form className={styles.search} role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById('soluciones')?.scrollIntoView({ behavior: 'smooth' }); }}>
        <label className={styles.srOnly} htmlFor="catalog-search">Buscar soluciones</label>
        <input id="catalog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar soluciones, tecnologías o experiencias..."/>
        <button type="submit" aria-label="Ver resultados"><ArrowRight/></button>
      </form>
      <p className={styles.stats}>{String(areas).padStart(2, '0')} ÁREAS <i>•</i> {total} SOLUCIONES <i>•</i> COLOMBIA / LATAM</p>
    </div>
    <aside className={styles.heroCaption}><p>Tecnología para ideas reales.</p><span/><small>Experiencias.<br/>Operaciones.<br/>Productos.</small></aside>
  </section>;
}

export function AreaFilters({ categories, active, onChange }) {
  return <div className={styles.areas} role="group" aria-label="Filtrar por área">
    <button type="button" className={active === 'all' ? styles.areaActive : ''} aria-pressed={active === 'all'} onClick={() => onChange('all')}><SlidersHorizontal/>Todos</button>
    {categories.map((category) => { const Icon = AREA_ICONS[category.slug] ?? Box; return <button type="button" key={category.id} className={active === category.slug ? styles.areaActive : ''} aria-pressed={active === category.slug} onClick={() => onChange(category.slug)}><Icon/>{category.name}</button>; })}
  </div>;
}

export function CatalogToolbar({ chips, onClear, shown, total, view, setView, sort, setSort, filtersOpen, setFiltersOpen }) {
  return <div className={styles.toolbar}>
    <div className={styles.activeFilters}>
      <span>Filtros activos:</span>
      {chips.length ? chips.map((chip) => <button type="button" className={styles.chip} key={chip.key} onClick={chip.onRemove} aria-label={`Quitar filtro ${chip.label}`}>{chip.label}<X/></button>) : <em>Ninguno</em>}
      {chips.length > 0 && <button type="button" className={styles.clear} onClick={onClear}>Limpiar filtros</button>}
    </div>
    <div className={styles.toolbarEnd}>
      <p className={styles.count}>Mostrando {shown} de {total} soluciones</p>
      <div className={styles.viewToggle} role="group" aria-label="Vista">
        <button type="button" className={view === 'grid' ? styles.viewActive : ''} aria-pressed={view === 'grid'} aria-label="Vista en cuadrícula" onClick={() => setView('grid')}><LayoutGrid/></button>
        <button type="button" className={view === 'list' ? styles.viewActive : ''} aria-pressed={view === 'list'} aria-label="Vista en lista" onClick={() => setView('list')}><List/></button>
      </div>
      <div className={styles.sortBox}>
        <button type="button" className={styles.filterButton} aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal/>Filtrar</button>
        <label className={styles.sort}><span>Ordenar por</span><span className={styles.select}><select value={sort} onChange={(event) => setSort(event.target.value)}>{SORT_OPTIONS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><ChevronDown aria-hidden="true"/></span></label>
      </div>
    </div>
  </div>;
}

export function SolutionCard({ solution }) {
  const { categories, selection, add, remove, compare, toggleCompare } = useCatalog();
  const category = categories.find((item) => item.id === solution.categoryId);
  const cover = getSolutionCover(solution); const badge = badgeFor(solution); const href = `/productos/${solution.slug}`;
  const saved = selection.some((item) => item.solutionId === solution.id); const compared = compare.includes(solution.id);
  return <article className={styles.card}>
    <div className={styles.cardMedia}>
      <Link to={href} tabIndex={-1} aria-hidden="true">{cover ? <img src={cover.url} alt="" loading="lazy"/> : <span className={styles.cardPlaceholder}>APX</span>}</Link>
      <span className={`${styles.badge} ${badge.tone === 'green' ? styles.badgeGreen : ''}`}><i/>{badge.label}</span>
      <div className={styles.cardActions}>
        <button type="button" aria-pressed={saved} aria-label={saved ? `Quitar ${solution.name} de Mi proyecto` : `Guardar ${solution.name} en Mi proyecto`} onClick={() => saved ? remove(solution.id) : add(solution.id, { openDrawer: false })}><img src={`${ASSETS}/icon-heart.webp`} alt=""/></button>
        <button type="button" aria-pressed={compared} aria-label={compared ? `Quitar ${solution.name} de comparar` : `Comparar ${solution.name}`} onClick={() => toggleCompare(solution.id)}><img src={`${ASSETS}/icon-compare.webp`} alt=""/></button>
      </div>
    </div>
    <div className={styles.cardBody}>
      <small>{category?.name}</small>
      <h3><Link to={href}>{solution.name}</Link></h3>
      <p>{solution.shortDescription}</p>
      <div className={styles.cardFoot}><b>{formatPrice(solution)}</b><Link to={href} className={styles.cardArrow} aria-label={`Ver ${solution.name}`}><ArrowRight/></Link></div>
    </div>
  </article>;
}

export function SolutionGrid({ items, view = 'grid' }) {
  return <div className={`${styles.grid} ${view === 'list' ? styles.list : ''}`}>{items.map((item) => <SolutionCard solution={item} key={item.id}/>)}</div>;
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return <nav className={styles.pagination} aria-label="Paginación">
    <button type="button" className={styles.pageStep} disabled={page <= 1} onClick={() => onChange(page - 1)}><ArrowLeft/>Anterior</button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => <button type="button" className={`${styles.pageNumber} ${value === page ? styles.pageCurrent : ''}`} aria-current={value === page ? 'page' : undefined} onClick={() => onChange(value)} key={value}>{value}</button>)}
    <button type="button" className={styles.pageStep} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente<ArrowRight/></button>
  </nav>;
}

export function SavedSummary() {
  const { selection, compare, setDrawerOpen } = useCatalog();
  return <button type="button" className={styles.saved} onClick={() => setDrawerOpen(true)}>
    <img src={`${ASSETS}/icon-bookmark.webp`} alt=""/>
    <span>{selection.length} {selection.length === 1 ? 'solución agregada' : 'soluciones agregadas'}</span><i>•</i>
    <span>{compare.length ? `${compare.length} para comparar` : 'Puedes guardar y comparar'}</span>
  </button>;
}

const BENEFITS = [['icon-bolt', 'Implementación', 'Acompañamiento de principio a fin.'], ['icon-gear', 'Personalización', 'Adaptamos cada solución a tu contexto.'], ['icon-headset', 'Soporte', 'Equipo experto en todo momento.'], ['icon-cube', 'Integración', 'Compatible con tus sistemas actuales.']];
export function HelpStrip() {
  return <section className={styles.help} aria-label="Ayuda y beneficios">
    <div className={styles.helpBar}>
      <img src={`${ASSETS}/icon-headset.webp`} alt=""/>
      <p><b>¿No encuentras lo que buscas?</b> <span>Te ayudamos a elegir la solución ideal.</span></p>
      <Link to="/solicitar-propuesta">Hablar con un experto <img src={`${ASSETS}/icon-arrow.webp`} alt=""/></Link>
    </div>
    <ul className={styles.benefits}>{BENEFITS.map(([icon, title, text]) => <li key={title}><img src={`${ASSETS}/${icon}.webp`} alt=""/><p><b>{title}</b><span>{text}</span></p></li>)}</ul>
  </section>;
}

export function CustomBanner() {
  return <section className={styles.banner}>
    <img className={styles.bannerImage} src={`${ASSETS}/banner-waves.webp`} alt="" loading="lazy"/>
    <div className={styles.bannerContent}>
      <p className={styles.bannerEyebrow}>SOLUCIONES A LA MEDIDA</p>
      <h2>Diseñamos una experiencia<br/>alrededor de tu idea.</h2>
      <p>Desde conceptos hasta soluciones reales, la tecnología al servicio de personas.</p>
      <Link to="/solicitar-propuesta" className={styles.bannerCta}>Solicitar una solución personalizada <ArrowRight/></Link>
    </div>
    <p className={styles.bannerWords}><span/>IDEAS<br/>PERSONAS<br/>TECNOLOGÍA<br/>RESULTADOS</p>
  </section>;
}

const SocialIcon = ({ d }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} fill="currentColor"/></svg>;
export function CatalogFooter() {
  const { categories } = useCatalog();
  return <footer className={styles.footer}>
    <div className={styles.footBrand}><b>APX</b><p>Tecnología diseñada<br/>alrededor de ideas reales.</p></div>
    <nav aria-label="Soluciones"><h3>Soluciones</h3>{categories.map((category) => <Link key={category.id} to={`/productos/categoria/${category.slug}`}>{category.name}</Link>)}</nav>
    <nav aria-label="APX"><h3>APX</h3><Link to="/">Inicio</Link><Link to="/productos">Soluciones</Link><a href="/#productos">Proyectos</a><a href="/#nosotros">Nosotros</a></nav>
    <nav aria-label="Soporte"><h3>Soporte</h3><a href="/#preguntas-frecuentes">Centro de ayuda</a><Link to="/terminos-y-condiciones">Términos y condiciones</Link><a href="mailto:apxtechlab@gmail.com">Contacto</a><Link to="/solicitar-propuesta">Solicitar propuesta</Link></nav>
    <div className={styles.footSocial}>
      <div>
        <a href="https://www.linkedin.com/in/apxtech" target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></a>
        <a href="https://www.youtube.com/@APXTechL" target="_blank" rel="noreferrer" aria-label="YouTube"><SocialIcon d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .4 5.6 2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6zM9.8 15V9l5.7 3z"/></a>
        <a href="https://www.instagram.com/apxtechlab/" target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></a>
      </div>
      <p>Colombia / LATAM</p>
    </div>
  </footer>;
}
