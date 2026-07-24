import { useEffect, useRef, useState } from 'react';
import styles from './Process.module.css';

const CHALLENGES = [
  {
    num: '01',
    accent: '#C8D1DD',
    rgb: '200,209,221',
    kicker: 'DATOS & BI',
    title: 'Tenemos datos, pero nadie los entiende.',
    description: 'Reunimos tus números en un tablero que cualquiera del equipo lee de un vistazo y usa para decidir.',
    metricText: '18 min',
    metricLabel: 'para el reporte que antes tomaba media semana',
    chips: ['Decisiones al instante', 'Todo en un tablero', 'Adiós Excel manual'],
    icon: '◐',
  },
  {
    num: '02',
    accent: '#B8C4D2',
    rgb: '184,196,210',
    kicker: 'INTEGRACIÓN',
    title: 'Nuestros sistemas no se hablan entre sí.',
    description: 'Conectamos ERP, base de datos, APIs y cloud para que el dato se capture una sola vez y viaje solo.',
    metricText: '1 sola vez',
    metricLabel: 'capturas el dato; el resto es automático',
    chips: ['Cero doble captura', 'Todo sincronizado', 'Sin errores'],
    icon: '⇄',
  },
  {
    num: '03',
    accent: '#D5DDE8',
    rgb: '213,221,232',
    kicker: 'DESARROLLO',
    title: 'Necesitamos software pero no sabemos por dónde empezar.',
    description: 'Del brief a la primera versión en producción en semanas. Hecho para tu proceso, no una plantilla adaptada.',
    metricText: '5 semanas',
    metricLabel: 'promedio del brief al primer lanzamiento',
    chips: ['Hecho a tu medida', 'Listo en semanas', 'Crece contigo'],
    icon: '◇',
  },
  {
    num: '04',
    accent: '#B6BEC8',
    rgb: '182,190,200',
    kicker: 'EVENTOS',
    title: 'Hacemos eventos pero no capturamos datos ni leads.',
    description: 'Registro digital, activaciones medibles y un reporte post-evento que te dice a quién seguir y por qué.',
    metricText: '2.7×',
    metricLabel: 'más leads calificados por evento',
    chips: ['Cada lead cuenta', 'Datos en vivo', 'Seguimiento claro'],
    icon: '◎',
  },
  {
    num: '05',
    accent: '#C4CEDA',
    rgb: '196,206,218',
    kicker: 'ACTIVACIÓN',
    title: 'La gente asiste, pero no interactúa con la marca.',
    description: 'Pantallas táctiles y dinámicas de juego que convierten a quien pasa de largo en alguien que participa.',
    metricText: '4 de 10',
    metricLabel: 'asistentes se detienen a interactuar',
    chips: ['Que jueguen', 'Marca memorable', 'Interacción real'],
    icon: '◈',
  },
  {
    num: '06',
    accent: '#8A939E',
    rgb: '138,147,158',
    kicker: 'AUTOMATIZACIÓN',
    title: 'El equipo pierde horas en tareas que debería automatizar.',
    description: 'Detectamos lo repetitivo y lo resolvemos con IA: reportes, clasificación, respuestas y flujos completos.',
    metricText: '11 h',
    metricLabel: 'devueltas al equipo cada semana',
    chips: ['Menos tareas', 'IA que trabaja sola', 'Horas de vuelta'],
    icon: '⚙',
  },
];

const Metric = ({ ch }) => (
  <div className={styles.metricWrap} style={{ '--rgb': ch.rgb }}>
    <span className={styles.metricNum}>{ch.metricText}</span>
    <span className={styles.metricLabel}>{ch.metricLabel}</span>
  </div>
);

const Process = () => {
  const wrapperRef = useRef(null);
  const rowRef = useRef(null);
  const secRef = useRef(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );

    if (secRef.current) obs.observe(secRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      const row = rowRef.current;
      const sec = secRef.current;
      if (!wrapper || !row || !sec) return;

      const rect = wrapper.getBoundingClientRect();
      const totalScrollable = wrapper.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const rawP = Math.min(1, scrolled / totalScrollable);

      const overhang = Math.max(0, row.scrollWidth - sec.clientWidth);
      setTranslateX(-rawP * overhang);

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
        <video
          className={styles.bgVideo}
          src="/Assets/Animation/luminous-threads-horizon.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.bgNebula} />
        <div className={styles.bgNebula2} />
        <div className={styles.bgScan} />

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

              <div className={styles.ribbon} aria-hidden="true">
                <span className={styles.cardNum}>{c.num}</span>
              </div>

              <div className={styles.cardBody}>
                <span className={styles.kicker}>{c.kicker}</span>
                <h3 className={styles.quoteText}>{c.title}</h3>
                <p className={styles.solution}>{c.description}</p>

                <Metric ch={c} />

                <div className={styles.tagWrap}>
                  {c.chips.map((t, ti) => (
                    <span
                      key={t}
                      className={styles.tag}
                      style={{
                        '--tag-delay': `${i * 60 + ti * 70 + 400}ms`,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className={styles.rowSpacer} aria-hidden="true" />
        </div>

        <div className={styles.progressBar} aria-hidden="true">
          {CHALLENGES.map((c, i) => (
            <span
              key={c.num}
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
