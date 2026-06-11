import { useEffect, useRef, useState } from 'react';
import styles from './Process.module.css';

/* ─── Icons ──────────────────────────────────────────────────── */

const ISearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IPen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const ICode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const IChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IGear = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IRocket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2l2.5-2.5-5-5L4.5 16.5z"/>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

/* ─── Chevron ────────────────────────────────────────────────── */

const Chevron = () => (
  <div className={styles.chevron} aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.20)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </div>
);

/* ─── Row connector SVG ──────────────────────────────────────── */

const RowConnector = ({ visible }) => (
  <div className={styles.connWrap} aria-hidden="true">
    <svg className={styles.connSvg} viewBox="0 0 1200 52" preserveAspectRatio="none">
      <path
        d="M 1160 8 C 1080 8 1040 44 960 44 L 240 44 C 160 44 120 8 40 8"
        stroke="rgba(6,182,212,.22)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="10 7"
        className={`${styles.connPath} ${visible ? styles.connAnimate : ''}`}
      />
      <circle cx="1160" cy="8"  r="4" fill="#06B6D4" opacity=".55" className={`${styles.connDot} ${visible ? styles.connDotAnimate : ''}`} />
      <circle cx="40"   cy="8"  r="4" fill="#6366F1" opacity=".55" className={`${styles.connDot} ${visible ? styles.connDotAnimateR : ''}`} />
    </svg>
  </div>
);

/* ─── Step data ──────────────────────────────────────────────── */

const STEPS = [
  { n:'01', accent:'#06B6D4', rgb:'6,182,212',   Icon:ISearch, title:'Descubrimos',   desc:'Entendemos tu negocio, objetivos y audiencia a profundidad.' },
  { n:'02', accent:'#8B5CF6', rgb:'139,92,246',   Icon:IPen,    title:'Diseñamos',     desc:'Definimos experiencia, arquitectura y estrategia alineada a tus metas.' },
  { n:'03', accent:'#06B6D4', rgb:'6,182,212',    Icon:ICode,   title:'Desarrollamos', desc:'Construimos soluciones robustas, escalables y orientadas a resultados.' },
  { n:'04', accent:'#6366F1', rgb:'99,102,241',   Icon:IChart,  title:'Analizamos',    desc:'Medimos, interpretamos datos y generamos insights que impulsan decisiones.' },
  { n:'05', accent:'#10B981', rgb:'16,185,129',   Icon:IGear,   title:'Automatizamos', desc:'Optimizamos procesos, implementamos automatización y reducimos fricción.' },
  { n:'06', accent:'#F59E0B', rgb:'245,158,11',   Icon:IRocket, title:'Impulsamos',    desc:'Iteramos, escalamos y aseguramos impacto sostenible en el tiempo.' },
];

const PROOF = [
  { dot: '#06B6D4', text: 'Entregables desde el sprint 1' },
  { dot: '#8B5CF6', text: 'Ciclos de 2 semanas'           },
  { dot: '#10B981', text: '+80 marcas implementadas'      },
];

/* ─── Component ──────────────────────────────────────────────── */

const Process = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const row1 = STEPS.slice(0, 3);
  const row2 = STEPS.slice(3, 6);

  return (
    <section ref={ref} id="proceso" className={`${styles.section} ${visible ? styles.visible : ''}`}>

      {/* Background */}
      <div className={styles.bgNebula}  />
      <div className={styles.bgNebula2} />
      <div className={styles.bgScan}    />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          PROCESO
        </div>
        <h2 className={styles.headline}>
          Un método ágil.<br />
          Resultados <span className={styles.gradWord}>medibles</span>.
        </h2>
        <p className={styles.sub}>
          Un sistema probado para generar impacto desde el primer sprint.
        </p>
      </div>

      {/* Row 1 */}
      <p className={styles.rowLabel} style={{ color: 'rgba(6,182,212,.50)' }}>
        ESTRATEGIA &amp; CONSTRUCCIÓN
      </p>
      <div className={styles.row}>
        {row1.map((s, i) => (
          <>
            <div
              key={s.n}
              className={styles.card}
              style={{ '--accent': s.accent, '--rgb': s.rgb, '--delay': `${200 + i * 90}ms` }}
            >
              <div className={styles.cardGlow} />
              <div className={styles.accentBar} style={{ background: `linear-gradient(90deg, ${s.accent}BB, transparent)` }} />

              <div className={styles.cardTop}>
                <span className={styles.stepNum}>{s.n}</span>
                <div
                  className={styles.iconBox}
                  style={{ color: s.accent, borderColor: `rgba(${s.rgb},.22)`, background: `rgba(${s.rgb},.09)` }}
                >
                  <s.Icon />
                </div>
              </div>

              <h4 className={styles.stepTitle}>{s.title}</h4>
              <p  className={styles.stepDesc}>{s.desc}</p>
            </div>
            {i < 2 && <Chevron key={`ch${i}`} />}
          </>
        ))}
      </div>

      {/* Connector */}
      <RowConnector visible={visible} />

      {/* Row label 2 */}
      <p className={styles.rowLabel} style={{ color: 'rgba(99,102,241,.55)' }}>
        OPTIMIZACIÓN &amp; ESCALA
      </p>
      <div className={styles.row}>
        {row2.map((s, i) => (
          <>
            <div
              key={s.n}
              className={styles.card}
              style={{ '--accent': s.accent, '--rgb': s.rgb, '--delay': `${560 + i * 90}ms` }}
            >
              <div className={styles.cardGlow} />
              <div className={styles.accentBar} style={{ background: `linear-gradient(90deg, ${s.accent}BB, transparent)` }} />

              <div className={styles.cardTop}>
                <span className={styles.stepNum}>{s.n}</span>
                <div
                  className={styles.iconBox}
                  style={{ color: s.accent, borderColor: `rgba(${s.rgb},.22)`, background: `rgba(${s.rgb},.09)` }}
                >
                  <s.Icon />
                </div>
              </div>

              <h4 className={styles.stepTitle}>{s.title}</h4>
              <p  className={styles.stepDesc}>{s.desc}</p>
            </div>
            {i < 2 && <Chevron key={`ch2${i}`} />}
          </>
        ))}
      </div>

      {/* Proof bar */}
      <div className={styles.proofWrap}>
        <div className={styles.proofDivider} />
        <div className={styles.proof}>
          {PROOF.map(({ dot, text }, i) => (
            <div key={text} className={styles.proofGroup}>
              {i > 0 && <div className={styles.proofSep} />}
              <span className={styles.proofDot} style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
              <span className={styles.proofText}>{text}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Process;
