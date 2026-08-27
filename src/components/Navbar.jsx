import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from './Navbar.module.css';

const links = [
  { label: 'Inicio',    href: '/#inicio'    },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Proceso',   href: '/#proceso'   },
  { label: 'Nosotros',  href: '/#nosotros'  },
  { label: 'Blog',      href: '/#blog'      },
];

const Navbar = ({ theme = 'dark', onThemeChange = () => {} }) => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>

      <a href="/#inicio" className={styles.logo}>
        <span className={styles.wordmark}>APX</span>
      </a>

      <ul
        id="mobile-navigation"
        className={`${styles.links} ${menuOpen ? styles.open : ''}`}
      >
        {links.map(({ label, href }) => (
          <li key={href}>
            <a href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <div className={styles.themeToggle} aria-label="Cambiar tema del sitio">
          <button
            type="button"
            className={theme === 'dark' ? styles.themeActive : ''}
            onClick={() => onThemeChange('dark')}
            aria-pressed={theme === 'dark'}
          >
            Oscuro
          </button>
          <button
            type="button"
            className={theme === 'light' ? styles.themeActive : ''}
            onClick={() => onThemeChange('light')}
            aria-pressed={theme === 'light'}
          >
            Claro
          </button>
        </div>
        <button
          type="button"
          className={styles.mobileThemeButton}
          onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          aria-pressed={theme === 'light'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a href="/#contacto" className={styles.cta}>Hablemos</a>
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span /><span /><span />
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
