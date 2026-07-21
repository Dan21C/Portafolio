import BrainLogo from '../components/BrainLogo';
import styles from './Footer.module.css';

const navLinks = ['Inicio', 'Servicios', 'Proceso', 'Nosotros', 'Blog', 'Preguntas frecuentes'];
const serviceLinks = ['Experiencias', 'Gamificación', 'Análisis de datos', 'Inteligencia artificial', 'Desarrollo de software', 'Automatización'];

const socials = [
  { label: 'LinkedIn', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  { label: 'Instagram', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { label: 'Twitter', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'TikTok', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
  { label: 'YouTube', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#08091A"/></svg> },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.grid}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          <BrainLogo size={28} />
          <span className={styles.wordmark}>APX</span>
        </div>
        <p className={styles.brandDesc}>
          Experiencias, tecnología e inteligencia para impulsar marcas y negocios hacia el futuro.
        </p>
        <div className={styles.socials}>
          {socials.map(({ label, icon }) => (
            <a key={label} href="#" aria-label={label} className={styles.social}>{icon}</a>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className={styles.col}>
        <h5 className={styles.colTitle}>Navegación</h5>
        {navLinks.map(l => <a key={l} href="#" className={styles.link}>{l}</a>)}
      </div>

      {/* Services */}
      <div className={styles.col}>
        <h5 className={styles.colTitle}>Servicios</h5>
        {serviceLinks.map(l => <a key={l} href="#servicios" className={styles.link}>{l}</a>)}
      </div>

      {/* Contact */}
      <div className={styles.col}>
        <h5 className={styles.colTitle}>Contacto</h5>
        <div className={styles.contactItem}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          hola@apx.com
        </div>
        <div className={styles.contactItem}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>
          +57 300 123 4567
        </div>
        <div className={styles.contactItem}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Latinoamérica
        </div>
        <a href="#contacto" className={`btn-primary ${styles.ctaSmall}`}>
          Hablemos
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>

    <div className={styles.bottom}>
      <span>© 2024 APX. Todos los derechos reservados.</span>
      <div className={styles.legal}>
        <a href="#">Política de privacidad</a>
        <a href="#">Términos y condiciones</a>
      </div>
    </div>
  </footer>
);

export default Footer;
