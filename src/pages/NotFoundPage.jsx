import { Link } from 'react-router-dom';
import { LandingFooter } from '../sections/landing/Landing';
import SiteHeader, { ArrowIcon } from './legal/SiteHeader';
import legal from './legal/Legal.module.css';
import styles from './NotFoundPage.module.css';

const SHORTCUTS = [
  { href: '/productos', label: 'Soluciones', text: 'Explora el catálogo de experiencias y tecnología.' },
  { href: '/#servicios', label: 'Servicios', text: 'Conoce las áreas en las que trabajamos.' },
  { href: '/#preguntas-frecuentes', label: 'Preguntas frecuentes', text: 'Resolvemos las dudas más comunes.' },
  { href: '/#contacto', label: 'Contacto', text: 'Cuéntanos tu idea y la hacemos real.' },
];

const NotFoundPage = () => (
  <div className={legal.page}>
    <SiteHeader />
    <main className={styles.main}>
      <img className={styles.wave} src="/Assets/Figma/faq-wave.webp" alt="" />
      <div className={styles.inner}>
        <p className={legal.eyebrow}>ERROR <i>•</i> 404</p>
        <p className={styles.code} aria-hidden="true">404</p>
        <h1>Esta página no existe.</h1>
        <p className={styles.lead}>Puede que el enlace esté roto o que la página se haya movido. Te ayudamos a volver al camino.</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primary}>Volver al inicio <ArrowIcon /></Link>
          <Link to="/productos" className={styles.secondary}>Ver soluciones</Link>
        </div>
      </div>
      <nav className={styles.shortcuts} aria-label="Accesos rápidos">
        {SHORTCUTS.map((item) => (
          <a key={item.href} href={item.href}>
            <b>{item.label}</b>
            <span>{item.text}</span>
            <i aria-hidden="true"><ArrowIcon /></i>
          </a>
        ))}
      </nav>
    </main>
    <LandingFooter />
  </div>
);

export default NotFoundPage;
