import styles from './Cases.module.css';

const stats = [
  { num: '+120', label: 'Proyectos exitosos' },
  { num: '+35%', label: 'Promedio de mejora en engagement' },
  { num: '+80', label: 'Marcas que confían en APX' },
];

const cases = [
  { badge: 'Gamificación', title: 'Programa de lealtad gamificado', desc: 'Aumento del 47% en participación de usuarios con mecánicas de retos y recompensas en tiempo real.', metric: '+47%', metricLabel: 'participación' },
  { badge: 'Análisis de datos', title: 'Reducción de costos operativos', desc: 'Pipeline de datos con dashboards automatizados que redujeron 32% los costos de operación.', metric: '-32%', metricLabel: 'costos' },
  { badge: 'IA + Automatización', title: 'Automatización de procesos clave', desc: 'Implementación de IA generativa y flujos automáticos generando +28% eficiencia operativa.', metric: '+28%', metricLabel: 'eficiencia' },
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const Cases = () => (
  <section id="casos" className={styles.section}>
    <div className="section-label">Casos de éxito</div>
    <h2 className="section-title">Resultados reales.<br />Impacto medible.</h2>
    <div className={styles.inner}>
      <div className={styles.stats}>
        {stats.map(({ num, label }) => (
          <div key={label} className={styles.statBlock}>
            <p className={styles.statNum}>{num}</p>
            <p className={styles.statLabel}>{label}</p>
          </div>
        ))}
        <a href="#contacto" className="btn-primary">Ver casos completos <Arrow /></a>
      </div>
      <div className={styles.cards}>
        {cases.map(({ badge, title, desc, metric, metricLabel }) => (
          <div key={title} className={styles.card}>
            <span className={styles.badge}>{badge}</span>
            <div className={styles.cardBody}>
              <h4 className={styles.cardTitle}>{title}</h4>
              <p className={styles.cardDesc}>{desc}</p>
            </div>
            <div className={styles.metric}>
              {metric}
              <span>{metricLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Cases;
