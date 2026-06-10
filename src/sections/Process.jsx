import styles from './Process.module.css';

const steps = [
  { n: '1', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, title: 'Descubrimos', desc: 'Entendemos tu negocio, objetivos y audiencia' },
  { n: '2', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, title: 'Diseñamos', desc: 'Definimos experiencia, arquitectura y estrategia' },
  { n: '3', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, title: 'Desarrollamos', desc: 'Construimos soluciones robustas y escalables' },
  { n: '4', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: 'Analizamos', desc: 'Medimos, interpretamos y generamos insights' },
  { n: '5', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>, title: 'Automatizamos', desc: 'Optimizamos procesos para escalar resultados' },
  { n: '6', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, title: 'Impulsamos', desc: 'Iteramos para generar impacto sostenible' },
];

const Process = () => (
  <section id="proceso" className={styles.section}>
    <div className="section-label">Proceso</div>
    <h2 className="section-title">Un método ágil.<br />Resultados medibles.</h2>
    <p className="section-sub">Un sistema probado para generar impacto desde el primer sprint.</p>
    <div className={styles.steps}>
      {steps.map(({ n, icon, title, desc }) => (
        <div key={n} className={styles.step}>
          <div className={styles.circle}>
            <span className={styles.num}>{n}</span>
            <span className={styles.icon}>{icon}</span>
          </div>
          <h4 className={styles.stepTitle}>{title}</h4>
          <p className={styles.stepDesc}>{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Process;
