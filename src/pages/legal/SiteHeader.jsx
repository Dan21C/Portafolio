import { Link } from 'react-router-dom';
import styles from './Legal.module.css';

export const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const SiteHeader = () => (
  <header className={styles.header}>
    <Link to="/" className={styles.logo} aria-label="APX, inicio">APX</Link>
    <nav aria-label="Principal">
      <Link to="/">Inicio</Link>
      <a href="/#servicios">Servicios</a>
      <Link to="/productos">Soluciones</Link>
      <a href="/#preguntas-frecuentes">Preguntas</a>
    </nav>
    <a href="/#contacto" className={styles.cta}>Hablemos <ArrowIcon /></a>
  </header>
);

export default SiteHeader;
