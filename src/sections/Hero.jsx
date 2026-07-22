import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

const darkHeroVideo = '/Assets/Hero/Hero_showreel.mp4';
const lightHeroVideo = '/Assets/Hero/Hero_showreel.mp4';
const heroStaticImage = '/Assets/Hero/herobg.png';
const videoLoopsBeforeFreeze = 1;
const defaultPointer = { x: 0.68, y: 0.45 };

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Blog', href: '#blog' },
];

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const scrollToTarget = (event, href) => {
  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.replaceState(null, '', href);
};

const Hero = ({ theme = 'dark', onThemeChange = () => {} }) => {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const loopCountRef = useRef(0);
  const [showStaticImage, setShowStaticImage] = useState(false);

  const heroVideoSrc = theme === 'dark' ? darkHeroVideo : lightHeroVideo;

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    let frame = 0;

    const syncPointer = (event) => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

        section.style.setProperty('--mouse-x', x.toFixed(3));
        section.style.setProperty('--mouse-y', y.toFixed(3));
      });
    };

    const resetPointer = () => {
      section.style.setProperty('--mouse-x', String(defaultPointer.x));
      section.style.setProperty('--mouse-y', String(defaultPointer.y));
    };

    window.addEventListener('pointermove', syncPointer, { passive: true });
    window.addEventListener('pointerleave', resetPointer);
    resetPointer();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', syncPointer);
      window.removeEventListener('pointerleave', resetPointer);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    loopCountRef.current = 0;
    setShowStaticImage(false);
    video.currentTime = 0;
    video.play().catch(() => {
      // Autoplay can be blocked until the user interacts with the page; ignored.
    });
  }, [heroVideoSrc]);

  const handleVideoEnded = () => {
    loopCountRef.current += 1;
    const video = videoRef.current;

    if (loopCountRef.current >= videoLoopsBeforeFreeze) {
      setShowStaticImage(true);
      return;
    }

    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  return (
    <section ref={heroRef} className={styles.hero} id="inicio" data-mode={theme}>
      <div className={styles.shell}>
        <nav className={styles.nav} aria-label="Navegación principal">
          <a href="#inicio" className={styles.logo} onClick={(event) => scrollToTarget(event, '#inicio')}>APX</a>

          <div className={styles.navLinks}>
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={label === 'Inicio' ? styles.navActive : ''}
                onClick={(event) => scrollToTarget(event, href)}
              >
                {label}
              </a>
            ))}
          </div>

          <div className={styles.navActions}>
            <div className={styles.themeSwitch} aria-label="Cambiar tema">
              <button
                type="button"
                className={theme === 'dark' ? styles.themeActive : ''}
                onClick={() => onThemeChange('dark')}
              >
                Oscuro
              </button>
              <button
                type="button"
                className={theme === 'light' ? styles.themeActive : ''}
                onClick={() => onThemeChange('light')}
              >
                Claro
              </button>
            </div>
            <a href="#contacto" className={styles.talkBtn} onClick={(event) => scrollToTarget(event, '#contacto')}>
              Hablemos
            </a>
          </div>
        </nav>

        <aside className={styles.sideRail} aria-hidden="true">
          <span>APX</span>
          <span>IA</span>
          <span>Data</span>
          <span>Automatización</span>
          <span>Experiencias</span>
          <strong>01</strong>
        </aside>

        <aside className={styles.sideRailRight} aria-hidden="true">
          <span>APX</span>
          <span>Producción</span>
          <span>Activaciones</span>
          <span>Eventos</span>
          <strong>02</strong>
        </aside>

        <div className={`${styles.content} ${showStaticImage ? styles.contentRaised : ''}`}>
          <h1 className={styles.title}>
            Experiencias que conectan.<br />
            <strong>Datos que impulsan.</strong>
          </h1>

          <p className={styles.copy}>
            Diseñamos, desarrollamos e implementamos soluciones de gamificación,
            analítica e inteligencia artificial para transformar marcas y operaciones.
          </p>

          <div className={styles.ctas}>
            <a href="#servicios" className={styles.primaryBtn} onClick={(event) => scrollToTarget(event, '#servicios')}>
              Ver catálogo <Arrow />
            </a>
            <a href="#contacto" className={styles.secondaryBtn} onClick={(event) => scrollToTarget(event, '#contacto')}>
              Hablemos <Arrow />
            </a>
          </div>
        </div>

        <p className={styles.trust}>
          <img src="https://flagcdn.com/16x12/co.png" width="16" height="12" alt="Colombia" />
          Marca colombiana conectando experiencias en toda Latinoamérica
        </p>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.lightBeam} />
          <div className={styles.videoStage}>
            <video
              key={heroVideoSrc}
              ref={videoRef}
              className={`${styles.heroVideo} ${showStaticImage ? styles.heroVideoHidden : ''}`}
              src={heroVideoSrc}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleVideoEnded}
            />
            <img
              src={heroStaticImage}
              alt=""
              className={`${styles.heroStatic} ${showStaticImage ? styles.heroStaticVisible : ''}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
