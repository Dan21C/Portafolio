import { useEffect, useRef, useState } from 'react';
import styles from './Services.module.css';

/* ─── Shared ─────────────────────────────────────────────────── */

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ─── Visualizations ────────────────────────────────────────── */

const NeuralViz = () => {
  const l1 = [[38,22],[38,58],[38,94]];
  const l2 = [[128,10],[128,38],[128,66],[128,94]];
  const l3 = [[218,10],[218,38],[218,66],[218,94]];
  const l4 = [[308,22],[308,58],[308,94]];
  const hot = [[38,58],[128,38],[218,66],[308,58]];
  const lines = (a, b, op) => a.flatMap(([x1,y1]) =>
    b.map(([x2,y2]) => <line key={`${x1}${y1}${x2}${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(16,185,129,1)" strokeWidth=".7" opacity={op} />)
  );
  return (
    <svg viewBox="0 0 346 106" fill="none" className={styles.neuralSvg}>
      <defs>
        <filter id="nglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {lines(l1,l2,.10)}{lines(l2,l3,.08)}{lines(l3,l4,.10)}
      {hot.slice(0,-1).map(([x1,y1],i)=>{const[x2,y2]=hot[i+1];return<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10B981" strokeWidth="1.5" opacity=".55" filter="url(#nglow)"/>;})}
      {[...l1,...l2,...l3,...l4].map(([cx,cy])=>(
        <circle key={`n${cx}${cy}`} cx={cx} cy={cy} r="3.5" fill="rgba(16,185,129,.10)" stroke="rgba(16,185,129,.38)" strokeWidth=".8"/>
      ))}
      {hot.map(([cx,cy])=>(
        <circle key={`h${cx}${cy}`} cx={cx} cy={cy} r="5" fill="rgba(16,185,129,.20)" stroke="#10B981" strokeWidth="1.5" filter="url(#nglow)"/>
      ))}
    </svg>
  );
};

const StageViz = () => (
  <svg viewBox="0 0 160 190" fill="none" className={styles.stageViz}>
    <defs>
      <linearGradient id="sl1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#06B6D4" stopOpacity=".55"/><stop offset="100%" stopColor="#06B6D4" stopOpacity="0"/>
      </linearGradient>
      <linearGradient id="sl2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" stopOpacity=".38"/><stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="8,0 28,0 96,190 0,190"  fill="url(#sl1)" opacity=".22"/>
    <polygon points="68,0 88,0 160,190 68,190" fill="url(#sl2)" opacity=".16"/>
    <circle cx="18" cy="5" r="5" fill="rgba(6,182,212,.55)" filter="url(#nglow)"/>
    <circle cx="78" cy="5" r="5" fill="rgba(99,102,241,.50)" filter="url(#nglow)"/>
    {[16,36,56,76,96,116,136].map(x=><circle key={x} cx={x} cy={152} r="2.5" fill="rgba(255,255,255,.10)"/>)}
    {[8,28,48,68,88,108,128,148].map(x=><circle key={`r2${x}`} cx={x} cy={163} r="2" fill="rgba(255,255,255,.06)"/>)}
    <rect x="14" y="172" width="132" height="14" rx="3" fill="rgba(6,182,212,.04)" stroke="rgba(6,182,212,.18)" strokeWidth="1"/>
    <rect x="20" y="177" width="56" height="3" rx="1.5" fill="rgba(6,182,212,.28)"/>
    <rect x="20" y="182" width="38" height="2.5" rx="1.5" fill="rgba(6,182,212,.14)"/>
  </svg>
);

const WaveViz = () => (
  <svg viewBox="0 0 260 58" fill="none" className={styles.waveViz}>
    <defs>
      <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6366F1" stopOpacity=".32"/><stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="0,52 38,38 76,46 114,22 152,34 190,10 228,20 260,6 260,58 0,58" fill="url(#wg1)"/>
    <polyline points="0,52 38,38 76,46 114,22 152,34 190,10 228,20 260,6" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="0,44 38,48 76,40 114,44 152,42 190,46 228,36 260,40" stroke="rgba(99,102,241,.18)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    {[[114,22],[190,10],[260,6]].map(([cx,cy])=><circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3" fill="#6366F1" opacity=".85"/>)}
  </svg>
);

const BadgeViz = () => (
  <svg viewBox="0 0 190 52" fill="none" className={styles.badgeViz}>
    {[{cx:26,cy:26,r:22,op:1},{cx:86,cy:26,r:18,op:.62},{cx:142,cy:26,r:14,op:.38}].map(({cx,cy,r,op},i)=>(
      <g key={i} opacity={op}>
        <circle cx={cx} cy={cy} r={r} fill="rgba(139,92,246,.06)" stroke="rgba(139,92,246,.26)" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={r*.5} fill="rgba(139,92,246,.13)"/>
        <text x={cx} y={cy+4} textAnchor="middle" fill="#A78BFA" fontSize="10" fontWeight="700" fontFamily="sans-serif">#{i+1}</text>
      </g>
    ))}
    {[[26,50],[86,46],[142,42]].map(([x,y],i)=>(
      <text key={i} x={x} y={y} textAnchor="middle" fill="rgba(245,158,11,.45)" fontSize="7" fontFamily="sans-serif">{'★'.repeat(5-i)}</text>
    ))}
  </svg>
);

const CodeViz = () => (
  <svg viewBox="0 0 400 64" fill="none" className={styles.codeViz}>
    {[
      {x:18, y:10,w:65, c:'#06B6D4',op:.48},{x:38, y:22,w:105,c:'#6366F1',op:.32},
      {x:38, y:34,w:76, c:'#94A3B8',op:.16},{x:56, y:46,w:96, c:'#94A3B8',op:.11},
      {x:204,y:10,w:60, c:'#10B981',op:.44},{x:224,y:22,w:86, c:'#6366F1',op:.28},
      {x:224,y:34,w:124,c:'#94A3B8',op:.14},{x:244,y:46,w:66, c:'#06B6D4',op:.20},
    ].map(({x,y,w,c,op})=><rect key={`${x}${y}`} x={x} y={y} width={w} height="5" rx="2.5" fill={c} opacity={op}/>)}
    <rect x="148" y="6"  width="44" height="54" rx="6" fill="rgba(6,182,212,.04)"  stroke="rgba(6,182,212,.13)"  strokeWidth="1"/>
    <rect x="336" y="6"  width="52" height="54" rx="6" fill="rgba(99,102,241,.04)" stroke="rgba(99,102,241,.13)" strokeWidth="1"/>
    <path d="M122 33 L148 33" stroke="rgba(6,182,212,.20)"  strokeWidth="1" strokeDasharray="3 3"/>
    <path d="M192 33 L336 33" stroke="rgba(6,182,212,.16)"  strokeWidth="1" strokeDasharray="3 3"/>
  </svg>
);

const FlowViz = () => (
  <svg viewBox="0 0 250 56" fill="none" className={styles.flowViz}>
    <defs>
      <marker id="farr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
        <path d="M0,0 L5,2.5 L0,5 Z" fill="rgba(245,158,11,.55)"/>
      </marker>
    </defs>
    {[[26,28],[94,12],[94,44],[178,28],[238,28]].map(([cx,cy],i)=>(
      <g key={i}>
        <circle cx={cx} cy={cy} r="13" fill="rgba(245,158,11,.07)" stroke="rgba(245,158,11,.26)" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r="4.5" fill="rgba(245,158,11,.35)"/>
      </g>
    ))}
    <line x1="39"  y1="23" x2="81"  y2="14" stroke="rgba(245,158,11,.30)" strokeWidth="1.2" markerEnd="url(#farr)"/>
    <line x1="39"  y1="33" x2="81"  y2="42" stroke="rgba(245,158,11,.30)" strokeWidth="1.2" markerEnd="url(#farr)"/>
    <line x1="107" y1="12" x2="165" y2="26" stroke="rgba(245,158,11,.30)" strokeWidth="1.2" markerEnd="url(#farr)"/>
    <line x1="107" y1="44" x2="165" y2="30" stroke="rgba(245,158,11,.30)" strokeWidth="1.2" markerEnd="url(#farr)"/>
    <line x1="191" y1="28" x2="225" y2="28" stroke="rgba(245,158,11,.30)" strokeWidth="1.2" markerEnd="url(#farr)"/>
  </svg>
);

/* ─── Icons ──────────────────────────────────────────────────── */

const IconAI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
    <path d="M9 6V4M12 6V4M15 6V4M9 20v-2M12 20v-2M15 20v-2M6 9H4M6 12H4M6 15H4M20 9h-2M20 12h-2M20 15h-2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity=".45"/>
  </svg>
);

const IconExp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 18v3M9 10l-2 2 2 2M15 10l2 2-2 2"/>
  </svg>
);

const IconData = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13C5 10.5 7 16 9 13C11 10 13 16 15 11.5C17 7 19 9.5 21 7.5"/>
    <circle cx="9" cy="13" r="1.5" fill="currentColor" opacity=".45"/>
    <circle cx="15" cy="11.5" r="1.5" fill="currentColor" opacity=".45"/>
    <circle cx="21" cy="7.5"  r="1.5" fill="currentColor" opacity=".65"/>
    <path d="M3 20h18" opacity=".18"/>
  </svg>
);

const IconGamif = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17.3l-6.2 4 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

const IconDev = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
    <path d="M12 4v16" opacity=".30"/>
  </svg>
);

const IconAuto = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ─── Data ───────────────────────────────────────────────────── */

const SERVICES = [
  {
    id: 'ai',    accent: '#10B981', rgb: '16,185,129',
    pill: 'IA Empresarial', Icon: IconAI, Viz: NeuralViz,
    title: 'Inteligencia Artificial',
    desc: 'Implementamos IA para personalización, predicción y optimización. LLMs, computer vision y automatización inteligente aplicada al negocio.',
    metric: { num: '94.6%', label: 'precisión promedio de modelos' },
  },
  {
    id: 'exp',   accent: '#06B6D4', rgb: '6,182,212',
    pill: 'Activaciones', Icon: IconExp, Viz: StageViz,
    title: 'Experiencias',
    desc: 'Experiencias interactivas que conectan con usuarios y generan engagement medible. Tótems, pantallas y activaciones en vivo.',
  },
  {
    id: 'gamif', accent: '#8B5CF6', rgb: '139,92,246',
    pill: 'Engagement', Icon: IconGamif, Viz: BadgeViz,
    title: 'Gamificación',
    desc: 'Mecánicas que aumentan participación, retención y conversión. Rankings, retos y recompensas que motivan e involucran.',
  },
  {
    id: 'data',  accent: '#6366F1', rgb: '99,102,241',
    pill: 'Analytics', Icon: IconData, Viz: WaveViz,
    title: 'Análisis de datos',
    desc: 'Transformamos datos en decisiones accionables. Dashboards, pipelines y reportería automatizada para operar con inteligencia real.',
  },
  {
    id: 'dev',   accent: '#06B6D4', rgb: '6,182,212',
    pill: 'Plataformas', Icon: IconDev, Viz: CodeViz,
    title: 'Desarrollo de software',
    desc: 'Construimos plataformas, apps y soluciones a medida. Código limpio, escalable y optimizado para cada dispositivo y escala de operación.',
  },
  {
    id: 'auto',  accent: '#F59E0B', rgb: '245,158,11',
    pill: 'Operaciones', Icon: IconAuto, Viz: FlowViz,
    title: 'Automatización',
    desc: 'Eliminamos fricción operativa y escalamos procesos. Workflows inteligentes para operaciones más eficientes y rentables.',
  },
];

/* ─── Component ──────────────────────────────────────────────── */

const Services = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="servicios" className={`${styles.section} ${visible ? styles.visible : ''}`}>

      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />
      <div className={styles.bgStreak} />

      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          SERVICIOS
        </div>
        <h2 className={styles.headline}>
          Soluciones que combinan<br />
          creatividad, tecnología e{' '}
          <span className={styles.gradWord}>inteligencia</span>.
        </h2>
        <p className={styles.sub}>
          No listamos entregables. Posicionamos valor real para tu negocio.
          Cada solución está diseñada para escalar con tu operación.
        </p>
      </div>

      <div className={styles.bento}>
        {SERVICES.map(({ id, accent, rgb, pill, Icon, Viz, title, desc, metric }, i) => (
          <div
            key={id}
            className={`${styles.card} ${styles[`card_${id}`]}`}
            style={{ '--accent': accent, '--rgb': rgb, '--delay': `${i * 80}ms` }}
          >
            <div className={styles.cardGlow} />
            <div className={styles.accentBar} style={{ background: `linear-gradient(90deg, ${accent}CC, transparent)` }} />

            {Viz && <div className={styles.vizWrap}><Viz /></div>}

            <div
              className={styles.pill}
              style={{ color: accent, borderColor: `rgba(${rgb},.22)`, background: `rgba(${rgb},.08)` }}
            >
              {pill}
            </div>

            <div
              className={styles.iconWrap}
              style={{ borderColor: `rgba(${rgb},.22)`, background: `rgba(${rgb},.08)`, color: accent }}
            >
              <Icon />
            </div>

            <div className={styles.content}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDesc}>{desc}</p>
            </div>

            {metric && (
              <div className={styles.metricBlock}>
                <span className={styles.metricNum} style={{ color: accent, textShadow: `0 0 22px rgba(${rgb},.50)` }}>
                  {metric.num}
                </span>
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            )}

            <a href="#contacto" className={styles.link} style={{ color: accent }}>
              Explorar <span className={styles.arrowWrap}><Arrow /></span>
            </a>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Services;
