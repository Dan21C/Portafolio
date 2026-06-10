import { useState, useEffect } from 'react';
import BrainLogo from './BrainLogo';
import styles from './Navbar.module.css';

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Casos', href: '#casos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Blog', href: '#blog' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#inicio" className={styles.logo}>
        <BrainLogo size={34} />
        <span className={styles.wordmark}>APX</span>
      </a>

      <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
        {links.map(({ label, href }) => (
          <li key={href}>
            <a href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          </li>
        ))}
      </ul>

      <a href="#contacto" className={`btn-primary ${styles.cta}`}>
        Hablemos
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>

      <button className={styles.burger} onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  );
};

export default Navbar;
