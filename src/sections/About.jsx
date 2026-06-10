import styles from './About.module.css';

const pillars = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/></svg>,
    title: 'Enfoque estratégico',
    desc: 'Alineamos cada solución con tus objetivos de negocio, no solo con los requerimientos técnicos.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Equipo multidisciplinario',
    desc: 'Expertos en datos, diseño, desarrollo e innovación trabajando como un sistema cohesionado.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Tecnología escalable',
    desc: 'Soluciones robustas que crecen contigo. Arquitectura pensada para el largo plazo desde el día uno.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    title: 'Mejora continua',
    desc: 'Iteramos, medimos y optimizamos siempre. Los resultados mejoran con el tiempo, no se estancan.',
  },
];

const About = () => (
  <section id="nosotros" className={styles.section}>
    <div className="section-label">Nuestro enfoque</div>
    <h2 className="section-title">Tecnología que potencia.<br />Personas que transforman.</h2>
    <p className="section-sub">
      No somos agencia. No somos consultora.<br />
      Somos un sistema integrado de experiencia, datos e inteligencia.
    </p>
    <div className={styles.grid}>
      {pillars.map(({ icon, title, desc }) => (
        <div key={title} className={styles.card}>
          <div className={styles.iconWrap}>{icon}</div>
          <h4 className={styles.cardTitle}>{title}</h4>
          <p className={styles.cardDesc}>{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default About;
