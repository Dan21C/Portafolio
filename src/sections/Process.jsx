import { useEffect, useRef, useState } from 'react';
import styles from './Process.module.css';

const SERVICE_SCENES = [
  {
    number: '01',
    category: 'EFICIENCIA OPERATIVA',
    name: 'Automatizar tareas',
    image: '/Assets/About/automatizacion-integraciones.png',
    imageAlt: 'Automatización e integraciones APX',
  },
  {
    number: '02',
    category: 'EXPERIENCIAS DE MARCA',
    name: 'Activar mi marca',
    image: '/Assets/About/experiencias-interactivas.png',
    imageAlt: 'Experiencias interactivas para activar una marca',
  },
  {
    number: '03',
    category: 'PRODUCCIÓN 360',
    name: 'Producir un evento',
    image: '/Assets/About/hardware-displays.png',
    imageAlt: 'Hardware, displays y producción para eventos APX',
  },
  {
    number: '04',
    category: 'ANALÍTICA',
    name: 'Entender mis datos',
    image: '/Assets/About/analitica-datos.png',
    imageAlt: 'Analítica y visualización de datos APX',
  },
  {
    number: '05',
    category: 'SOFTWARE A LA MEDIDA',
    name: 'Crear una plataforma',
    image: '/Assets/About/software-operacion.png',
    imageAlt: 'Software y plataformas a la medida APX',
  },
  {
    number: '06',
    category: 'SOLUCIÓN INTEGRAL',
    name: 'Conectar varias necesidades',
    image: '/Assets/About/ia-aplicada.png',
    imageAlt: 'Inteligencia artificial aplicada al ecosistema APX',
  },
];

const Process = () => {
  const wrapperRef = useRef(null);
  const rowRef = useRef(null);
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      frameRef.current = null;
      const wrapper = wrapperRef.current;
      const row = rowRef.current;
      const section = sectionRef.current;
      if (!wrapper || !row || !section) return;

      if (window.matchMedia('(max-width: 900px)').matches) {
        setTranslateX(0);
        return;
      }

      const totalScrollable = wrapper.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = Math.max(0, -wrapper.getBoundingClientRect().top);
      const progress = Math.min(1, scrolled / totalScrollable);
      const overhang = Math.max(0, row.scrollWidth - section.clientWidth);

      setTranslateX(-progress * overhang);
      setActiveIndex(
        Math.min(
          SERVICE_SCENES.length - 1,
          Math.round(progress * (SERVICE_SCENES.length - 1)),
        ),
      );
    };

    const requestUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleRowScroll = () => {
    if (!window.matchMedia('(max-width: 900px)').matches) return;

    const row = rowRef.current;
    if (!row) return;

    const scenes = Array.from(row.querySelectorAll('[data-service-scene]'));
    const viewportCenter = row.scrollLeft + row.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    scenes.forEach((scene, index) => {
      const sceneCenter = scene.offsetLeft + scene.offsetWidth / 2;
      const distance = Math.abs(sceneCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  return (
    <div ref={wrapperRef} id="servicios" className={styles.wrapper}>
      <section
        ref={sectionRef}
        id="proceso"
        className={`${styles.section} ${visible ? styles.visible : ''}`}
      >
        <video
          className={styles.backgroundVideo}
          src="/Assets/Animation/luminous-threads-horizon.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.backgroundWash} />

        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span />
            ENCUENTRA TU PUNTO DE PARTIDA
          </div>
          <h2>¿Qué quieres mejorar hoy?</h2>
          <p>Explora nuestras capacidades y encuentra el mejor punto de partida para tu negocio.</p>
        </header>

        <div
          ref={rowRef}
          className={styles.row}
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          onScroll={handleRowScroll}
        >
          {SERVICE_SCENES.map((scene, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                key={scene.number}
                data-service-scene
                className={`${styles.scene} ${isActive ? styles.sceneActive : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <img src={scene.image} alt={scene.imageAlt} />
                <div className={styles.imageShade} />
                <span className={styles.sceneNumber}>{scene.number}</span>
                <div className={styles.sceneLabel}>
                  <small>{scene.category}</small>
                  <h3>{scene.name}</h3>
                </div>
              </article>
            );
          })}

          <div className={styles.rowSpacer} aria-hidden="true" />
        </div>

        <div className={styles.progress} aria-label="Progreso de servicios">
          <span className={styles.progressCount}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(SERVICE_SCENES.length).padStart(2, '0')}
          </span>
          <div className={styles.progressDots}>
            {SERVICE_SCENES.map((scene, index) => (
              <span
                key={scene.number}
                className={`${styles.progressDot} ${index === activeIndex ? styles.progressDotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;
