import BrainLogo from '../components/BrainLogo';
import styles from './Hero.module.css';

const bullets = [
  { icon: '🖥️', text: 'Experiencias digitales y físicas' },
  { icon: '📊', text: 'Decisiones basadas en datos' },
  { icon: '🤖', text: 'IA aplicada al negocio' },
  { icon: '⚡', text: 'Automatización de procesos' },
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const Hero = () => (
  <section className={styles.hero} id="inicio">
    <div className={styles.grid} />
    <div className={styles.glow} />

    {/* LEFT */}
    <div className={styles.left}>
      <p className={styles.eyebrow}>Experiencias · IA · Datos</p>
      <h1 className={styles.headline}>
        Experiencias que<br />conectan.<br />
        <span className="accent">Datos</span> que impulsan.
      </h1>
      <p className={styles.sub}>
        Diseñamos, desarrollamos e implementamos soluciones de gamificación,
        analítica e inteligencia artificial para transformar marcas y operaciones.
      </p>
      <div className={styles.bullets}>
        {bullets.map(({ icon, text }) => (
          <span key={text} className={styles.bullet}>
            <span className={styles.bulletIcon}>{icon}</span>
            {text}
          </span>
        ))}
      </div>
      <div className={styles.actions}>
        <a href="#contacto" className="btn-primary">Agendar demo <Arrow /></a>
        <a href="#servicios" className="btn-secondary">Ver soluciones</a>
      </div>
    </div>

    {/* RIGHT — big logo */}
    <div className={styles.right}>
      <div className={styles.logoWrap}>
        <div className={styles.brainWrap}>
          <BrainLogo size={130} />
        </div>
        <p className={styles.bigWordmark}>
          AP<span className={styles.xAccent}>X</span>
        </p>
        <div className={styles.serviceIcons}>
          {[
            { icon: '🎮', label: 'Experiencias' },
            { icon: '📈', label: 'Gamificación' },
            { icon: '🔍', label: 'Análisis' },
            { icon: '🧠', label: 'IA' },
            { icon: '</>', label: 'Desarrollo' },
            { icon: '⚙️', label: 'Automatización' },
          ].map(({ icon, label }) => (
            <div key={label} className={styles.serviceChip}>
              <span className={styles.chipIcon}>{icon}</span>
              <span className={styles.chipLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
