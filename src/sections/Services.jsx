import styles from './Services.module.css';

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Experiencias',
    desc: 'Creamos experiencias interactivas que conectan con usuarios y generan engagement medible. Tótems, pantallas y activaciones en vivo.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3"/><circle cx="8" cy="12" r="1.5"/><path d="M16 10v4M14 12h4"/>
      </svg>
    ),
    title: 'Gamificación',
    desc: 'Diseñamos mecánicas que aumentan participación, retención y conversión. Rankings, retos y recompensas que motivan e involucran.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Análisis de datos',
    desc: 'Transformamos datos en decisiones accionables. Dashboards, pipelines y reportería automatizada para operar con inteligencia real.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    title: 'Inteligencia artificial',
    desc: 'Implementamos IA para personalización, predicción y optimización. LLMs, computer vision y automatización inteligente aplicada al negocio.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Desarrollo de software',
    desc: 'Construimos plataformas, apps y soluciones a medida. Código limpio, escalable y optimizado para cada dispositivo.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
    title: 'Automatización',
    desc: 'Eliminamos fricción operativa y escalamos procesos. Workflows inteligentes que hacen tu operación más eficiente y rentable.',
  },
];

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const Services = () => (
  <section id="servicios" className={styles.section}>
    <div className="section-label">Servicios</div>
    <h2 className="section-title">Soluciones que combinan<br />creatividad, tecnología e inteligencia.</h2>
    <p className="section-sub">No listamos entregables. Posicionamos valor real para tu negocio.</p>
    <div className={styles.grid}>
      {services.map(({ icon, title, desc }) => (
        <div key={title} className={styles.card}>
          <div className={styles.topBar} />
          <div className={styles.iconWrap}>{icon}</div>
          <h3 className={styles.cardTitle}>{title}</h3>
          <p className={styles.cardDesc}>{desc}</p>
          <a href="#contacto" className={styles.link}>Ver más <Arrow /></a>
        </div>
      ))}
    </div>
  </section>
);

export default Services;
