import { useEffect, useRef, useState } from 'react';
import styles from './Process.module.css';

/* ─── Data ───────────────────────────────────────────────────── */

const CHALLENGES = [
  {
    num: '01',
    accent: '#FF464D', rgb: '255,70,77',
    quote: 'Tenemos datos pero nadie los entiende.',
    solution: 'Construimos dashboards ejecutivos en tiempo real que convierten números crudos en decisiones de negocio.',
    metric: 72, metricPrefix: '−', metricSuffix: '%',
    metricLabel: 'tiempo en reportes manuales',
    tags: ['Power BI', 'Pipelines', 'Real-time'],
  },
  {
    num: '02',
    accent: '#E4585E', rgb: '228,88,94',
    quote: 'Nuestros sistemas no se hablan entre sí.',
    solution: 'Integramos tu ecosistema completo: ERP, bases de datos, APIs y cloud en un flujo 100% automatizado.',
    metric: null, metricText: 'Cero',
    metricLabel: 'intervenciones manuales en el proceso',
    tags: ['APIs REST', 'WebSocket', 'Supabase'],
  },
  {
    num: '03',
    accent: '#C9353D', rgb: '201,53,61',
    quote: 'Necesitamos software pero no sabemos por dónde empezar.',
    solution: 'Del briefing a producción en semanas. Software construido para tu proceso exacto, no una plantilla adaptada.',
    metric: null, metricText: '3–6 sem',
    metricLabel: 'de concepto a producción',
    tags: ['React + Vite', 'C# .NET', 'IoT / ESP32'],
  },
  {
    num: '04',
    accent: '#B6BEC8', rgb: '182,190,200',
    quote: 'Hacemos eventos pero no capturamos datos ni generamos leads.',
    solution: 'Integramos tecnología en cada punto del evento: registro digital, activaciones medibles y análisis post-evento accionable.',
    metric: null, metricText: '+3x',
    metricLabel: 'conversión de asistentes a leads',
    tags: ['Registro digital', 'Lead capture', 'Analytics'],
  },
  {
    num: '05',
    accent: '#FF6B70', rgb: '255,107,112',
    quote: 'La gente asiste, pero no interactúa con la marca.',
    solution: 'Pantallas táctiles, gamificación y activaciones interactivas que convierten espectadores en participantes comprometidos.',
    metric: 35, metricPrefix: '+', metricSuffix: '%',
    metricLabel: 'engagement en activaciones de marca',
    tags: ['Gamificación', 'Pantallas táctiles', 'Activaciones'],
  },
  {
    num: '06',
    accent: '#8A939E', rgb: '138,147,158',
    quote: 'Nuestro equipo pierde horas en tareas que debería automatizar.',
    solution: 'Identificamos qué consume más tiempo y lo automatizamos con IA: reportes, clasificación, respuestas y flujos de trabajo.',
    metric: 80, metricPrefix: '−', metricSuffix: '%',
    metricLabel: 'tiempo en tareas repetitivas',
    tags: ['RPA', 'IA & Agentes', 'Workflows'],
  },
];

/* ─── Count-up hook ──────────────────────────────────────────── */

function useCountUp(target, active, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || target == null) return;
    let raf;
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p    = Math.min((ts - t0) / duration, 1);
      const ease = 1 - (1 - p) ** 3;
      setVal(Math.round(target * ease));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

/* ─── Metric ─────────────────────────────────────────────────── */

const Metric = ({ ch, active }) => {
  const count = useCountUp(ch.metric, active);
  return (
    <div className={styles.metricWrap} style={{ '--rgb': ch.rgb }}>
      <span className={styles.metricNum}>
        {ch.metricText
          ? ch.metricText
          : `${ch.metricPrefix}${count}${ch.metricSuffix}`}
      </span>
      <span className={styles.metricLabel}>{ch.metricLabel}</span>
    </div>
  );
};

/* ─── Component ──────────────────────────────────────────────── */

const Process = () => {
  const wrapperRef = useRef(null);
  const rowRef     = useRef(null);
  const secRef     = useRef(null);

  const [activeIdx,  setActiveIdx]  = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visible,    setVisible]    = useState(false);

  /* Section enters viewport → reveal animations fire */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  /* Scroll-driven carousel */
  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      const row     = rowRef.current;
      const sec     = secRef.current;
      if (!wrapper || !row || !sec) return;

      const rect            = wrapper.getBoundingClientRect();
      const totalScrollable = wrapper.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const rawP     = Math.min(1, scrolled / totalScrollable);

      /* Translate row left as scroll progresses */
      const overhang = Math.max(0, row.scrollWidth - sec.clientWidth);
      setTranslateX(-rawP * overhang);

      /* Active card index */
      setActiveIdx(
        Math.min(CHALLENGES.length - 1, Math.floor(rawP * CHALLENGES.length))
      );
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <section
        ref={secRef}
        id="proceso"
        className={`${styles.section} ${visible ? styles.visible : ''}`}
      >
        <div className={styles.bgNebula}  />
        <div className={styles.bgNebula2} />
        <div className={styles.bgScan}    />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            RETOS QUE RESOLVEMOS
          </div>
          <h2 className={styles.headline}>
            Los problemas reales<br />
            que traen a <span className={styles.gradWord}>APX</span>.
          </h2>
          <p className={styles.sub}>
            No vendemos tecnología. Resolvemos los retos que más le cuestan a tu negocio.
          </p>
        </div>

        {/* Scroll-driven card row */}
        <div
          ref={rowRef}
          className={styles.row}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {CHALLENGES.map((c, i) => (
            <div
              key={c.num}
              className={`${styles.card} ${i === activeIdx ? styles.cardActive : ''}`}
              style={{ '--accent': c.accent, '--rgb': c.rgb, '--delay': `${i * 60}ms` }}
            >
              <div className={styles.cardGlow} />
              <div
                className={styles.accentBar}
                style={{ background: `linear-gradient(90deg, ${c.accent}CC, transparent)` }}
              />

              <div className={styles.cardNum} style={{ color: `rgba(${c.rgb},.18)` }}>
                {c.num}
              </div>

              <div className={styles.quoteWrap}>
                <span className={styles.quoteDecor} style={{ color: `rgba(${c.rgb},.18)` }}>"</span>
                <p className={styles.quoteText}>{c.quote}</p>
              </div>

              <div
                className={styles.cardDivider}
                style={{ background: `linear-gradient(90deg, rgba(${c.rgb},.35), transparent)` }}
              />

              <p className={styles.solution}>{c.solution}</p>

              <Metric ch={c} active={visible} />

              <div className={styles.tagWrap}>
                {c.tags.map((t, ti) => (
                  <span
                    key={t}
                    className={styles.tag}
                    style={{
                      borderColor:   `rgba(${c.rgb},.22)`,
                      background:    `rgba(${c.rgb},.07)`,
                      '--tag-delay': `${i * 60 + ti * 70 + 400}ms`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {/* Spacer: last card ends centered, not flush against the edge */}
          <div className={styles.rowSpacer} aria-hidden="true" />
        </div>

        {/* Progress dots */}
        <div className={styles.progressBar} aria-hidden="true">
          {CHALLENGES.map((c, i) => (
            <span
              key={i}
              className={`${styles.progressDot} ${i === activeIdx ? styles.progressDotActive : ''} ${i < activeIdx ? styles.progressDotDone : ''}`}
              style={{ '--rgb': c.rgb }}
            />
          ))}
        </div>

      </section>
    </div>
  );
};

export default Process;
