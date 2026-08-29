import { useEffect, useRef, useState } from 'react';
import styles from './Process.module.css';

const SERVICE_SCENES = [
  {
    number: '01',
    category: 'EFICIENCIA OPERATIVA',
    name: 'Automatizar tareas',
    image: '/Assets/Ecosystem/01-automatizacion.png',
    imageAlt: 'Automatización e integraciones APX',
  },
  {
    number: '02',
    category: 'EXPERIENCIAS DE MARCA',
    name: 'Activar mi marca',
    image: '/Assets/Ecosystem/02-experiencias-clean.png',
    imageAlt: 'Experiencias interactivas para activar una marca',
  },
  {
    number: '03',
    category: 'PRODUCCIÓN 360',
    name: 'Producir un evento',
    image: '/Assets/Ecosystem/03-hardware-clean.png',
    imageAlt: 'Hardware, displays y producción para eventos APX',
  },
  {
    number: '04',
    category: 'ANALÍTICA',
    name: 'Entender mis datos',
    image: '/Assets/Ecosystem/04-analitica-clean.png',
    imageAlt: 'Analítica y visualización de datos APX',
  },
  {
    number: '05',
    category: 'SOFTWARE A LA MEDIDA',
    name: 'Crear una plataforma',
    image: '/Assets/Ecosystem/05-plataforma.png',
    imageAlt: 'Software y plataformas a la medida APX',
  },
  {
    number: '06',
    category: 'SOLUCIÓN INTEGRAL',
    name: 'Conectar varias necesidades',
    image: '/Assets/Ecosystem/06-ia.png',
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

      const totalScrollable = wrapper.offsetHeight - section.offsetHeight;
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
                <img
                  src={scene.image}
                  alt={scene.imageAlt}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
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
