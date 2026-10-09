import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SiteHeader, { ArrowIcon } from './SiteHeader';
import { LandingFooter } from '../../sections/landing/Landing';
import styles from './Legal.module.css';

const LEGAL_PAGES = [
  { to: '/terminos-y-condiciones', label: 'Términos y condiciones' },
  { to: '/politica-de-privacidad', label: 'Política de privacidad' },
];

const LegalLayout = ({ title, lead, updated, sections }) => {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    sections.forEach(({ id }) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className={styles.page}>
      <SiteHeader />

      <main>
        <section className={styles.hero}>
          <img className={styles.heroWave} src="/Assets/Figma/faq-wave.webp" alt="" fetchPriority="high" />
          <div className={styles.heroText}>
            <p className={styles.crumbs}><Link to="/">Inicio</Link><span aria-hidden="true">/</span><span>Legal</span></p>
            <p className={styles.eyebrow}>LEGAL <i>•</i> APX</p>
            <h1>{title}</h1>
            <p className={styles.lead}>{lead}</p>
            <p className={styles.updated}>Última actualización: {updated}</p>
            <nav className={styles.tabs} aria-label="Documentos legales">
              {LEGAL_PAGES.map((page) => (
                <NavLink key={page.to} to={page.to} className={({ isActive }) => (isActive ? styles.tabActive : '')}>{page.label}</NavLink>
              ))}
            </nav>
          </div>
        </section>

        <div className={styles.body}>
          <aside className={styles.index} aria-label="Contenido">
            <p className={styles.eyebrow}>CONTENIDO</p>
            <ol>
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={active === section.id ? styles.indexActive : ''} aria-current={active === section.id ? 'true' : undefined}>
                    <span>{String(index + 1).padStart(2, '0')}</span>{section.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className={styles.content}>
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} className={styles.block}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.body}
                </div>
              </section>
            ))}

            <aside className={styles.contact}>
              <img src="/Assets/Catalog/banner-waves.webp" alt="" loading="lazy" />
              <div>
                <p className={styles.eyebrow}>¿TIENES PREGUNTAS?</p>
                <h2>Hablemos sobre tus datos<br />y tus proyectos.</h2>
                <p>Escríbenos y te respondemos lo antes posible.</p>
                <div className={styles.contactActions}>
                  <a href="mailto:apxtechlab@gmail.com" className={styles.contactPrimary}>apxtechlab@gmail.com <ArrowIcon /></a>
                  <a href="https://wa.me/573107700619" target="_blank" rel="noreferrer" className={styles.contactSecondary}>WhatsApp +57 310 7700619</a>
                </div>
              </div>
            </aside>
          </article>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default LegalLayout;
