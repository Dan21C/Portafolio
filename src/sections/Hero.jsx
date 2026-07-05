import { useEffect, useRef, useState } from 'react';
import { BarChart3, BrainCircuit, Boxes, Code2, Cpu, Hand, Hexagon, Sparkles } from 'lucide-react';
import styles from './Hero.module.css';

const darkHeroVideo = '/Assets/Animation/hazme_una_animacion_cursor.mp4';
const lightHeroVideo = '/Assets/Animation/ahora_quiero_una_naimacion_cursor.mp4';
const videoScrubStart = 2;
const videoScrubEnd = 8.15;
const defaultPointer = { x: 0.68, y: 0.45 };

const getVideoTimeFromPointer = (x) => videoScrubStart + x * (videoScrubEnd - videoScrubStart);

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Casos', href: '#casos' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Blog', href: '#blog' },
];

const metrics = [
  { value: '+80', label: 'marcas', caption: 'Confían en nosotros', icon: Hexagon },
  { value: '+35%', label: 'engagement', caption: 'Resultados medibles', icon: Hexagon },
  { value: '6', label: 'verticales', caption: 'Industrias clave', icon: Boxes },
];

const services = [
  { id: '01', label: 'IA y automatización', icon: BrainCircuit },
  { id: '02', label: 'Experiencias interactivas', icon: Hand },
  { id: '03', label: 'Eventos 360', icon: Sparkles },
  { id: '04', label: 'Analítica de datos', icon: BarChart3 },
  { id: '05', label: 'Desarrollo de software', icon: Code2 },
  { id: '06', label: 'Producción 360', icon: Cpu },
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
  const videoTargetTimeRef = useRef(getVideoTimeFromPointer(defaultPointer.x));
  const videoDisplayTimeRef = useRef(getVideoTimeFromPointer(defaultPointer.x));
  const lastVideoSetRef = useRef(0);
  const videoReadyRef = useRef(false);
  const [activeService, setActiveService] = useState(0);

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

        videoTargetTimeRef.current = getVideoTimeFromPointer(x);
        setActiveService(Math.min(services.length - 1, Math.floor(x * services.length)));
      });
    };

    const resetPointer = () => {
      section.style.setProperty('--mouse-x', String(defaultPointer.x));
      section.style.setProperty('--mouse-y', String(defaultPointer.y));
      videoTargetTimeRef.current = getVideoTimeFromPointer(defaultPointer.x);
      setActiveService(0);
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
    if (!video) return undefined;

    let raf = 0;
    const startTime = getVideoTimeFromPointer(defaultPointer.x);
    videoTargetTimeRef.current = startTime;
    videoDisplayTimeRef.current = startTime;
    lastVideoSetRef.current = 0;
    videoReadyRef.current = false;

    const primeVideo = () => {
      videoReadyRef.current = true;
      video.pause();
      try {
        video.currentTime = startTime;
      } catch {
        // Some browsers wait until enough data is buffered before allowing seeks.
      }
    };

    if (video.readyState >= 1) {
      primeVideo();
    } else {
      video.addEventListener('loadedmetadata', primeVideo, { once: true });
    }

    const animateScrub = (now) => {
      if (videoReadyRef.current) {
        const targetTime = videoTargetTimeRef.current;
        const currentTime = videoDisplayTimeRef.current;
        const distance = targetTime - currentTime;
        const nextTime = Math.abs(distance) > 1.1
          ? targetTime
          : Math.abs(distance) < 0.004
            ? targetTime
            : currentTime + distance * 0.34;

        videoDisplayTimeRef.current = nextTime;

        if (Math.abs(video.currentTime - nextTime) > 0.01 && now - lastVideoSetRef.current > 16) {
          try {
            video.currentTime = nextTime;
            lastVideoSetRef.current = now;
          } catch {
            // Ignore rare seek races while the browser is still buffering.
          }
        }
      }

      raf = requestAnimationFrame(animateScrub);
    };

    raf = requestAnimationFrame(animateScrub);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('loadedmetadata', primeVideo);
    };
  }, [heroVideoSrc]);

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
          <span>Datos</span>
          <span>Experiencias</span>
          <strong>01</strong>
        </aside>

        <div className={styles.content}>
          <p className={styles.kicker}>
            <span />
            Industrial AI partners
          </p>

          <h1 className={styles.title}>
            Experiencias<br />
            que conectan.<br />
            <strong>Datos que impulsan.</strong>
          </h1>

          <p className={styles.copy}>
            Diseñamos, desarrollamos e implementamos soluciones de gamificación,
            analítica e inteligencia artificial para transformar marcas y operaciones.
          </p>

          <div className={styles.metrics}>
            {metrics.map(({ value, label, caption, icon: Icon }) => (
              <div key={label} className={styles.metricCard}>
                <Icon size={23} strokeWidth={1.45} />
                <div>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
                <small>{caption}</small>
              </div>
            ))}
          </div>

          <div className={styles.ctas}>
            <a href="#contacto" className={styles.primaryBtn} onClick={(event) => scrollToTarget(event, '#contacto')}>
              Agendar demo <Arrow />
            </a>
            <a href="#servicios" className={styles.secondaryBtn} onClick={(event) => scrollToTarget(event, '#servicios')}>
              Ver soluciones <Arrow />
            </a>
          </div>

          <p className={styles.trust}>
            Conectado por marcas en
            <img src="https://flagcdn.com/16x12/co.png" width="16" height="12" alt="Colombia" />
            Colombia
            <img src="https://flagcdn.com/16x12/mx.png" width="16" height="12" alt="México" />
            México
            <img src="https://flagcdn.com/16x12/ar.png" width="16" height="12" alt="Argentina" />
            Argentina
          </p>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.lightBeam} />
          <div className={styles.platform} />
          <svg className={styles.connectorLines} viewBox="0 0 720 760" preserveAspectRatio="none">
            <defs>
              <marker id="hero-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                <path d="M 0 0 L 9 4.5 L 0 9 Z" />
              </marker>
            </defs>
            <path className={styles.connectorOrbit} d="M 126 80 C 276 16 462 36 602 126" />
            <path className={styles.connectorOrbit} d="M 122 696 C 292 742 488 714 604 612" />
            <path className={styles.connectorScan} d="M 132 130 L 318 130 L 482 108" />
            <path className={styles.connectorScan} d="M 166 250 L 346 250 L 482 215" />
            <path className={styles.connectorScan} d="M 198 365 L 376 365 L 482 326" />
            <path className={styles.connectorScan} d="M 198 468 L 376 468 L 482 434" />
            <path className={styles.connectorScan} d="M 166 585 L 346 585 L 482 542" />
            <path className={styles.connectorScan} d="M 132 675 L 318 675 L 482 650" />
            <path className={styles.connectorStrong} d="M 318 130 L 472 130 L 530 108" markerEnd="url(#hero-arrow)" />
            <path className={styles.connectorStrong} d="M 346 250 L 482 250 L 530 216" markerEnd="url(#hero-arrow)" />
            <path className={styles.connectorStrong} d="M 376 365 L 494 365 L 530 325" markerEnd="url(#hero-arrow)" />
            <path className={styles.connectorStrong} d="M 376 468 L 494 468 L 530 433" markerEnd="url(#hero-arrow)" />
            <path className={styles.connectorStrong} d="M 346 585 L 482 585 L 530 542" markerEnd="url(#hero-arrow)" />
            <path className={styles.connectorStrong} d="M 318 675 L 472 675 L 530 650" markerEnd="url(#hero-arrow)" />
            <circle cx="318" cy="130" r="3" />
            <circle cx="346" cy="250" r="3" />
            <circle cx="376" cy="365" r="3" />
            <circle cx="376" cy="468" r="3" />
            <circle cx="346" cy="585" r="3" />
            <circle cx="318" cy="675" r="3" />
            <rect className={styles.connectorMark} x="88" y="150" width="34" height="1" />
            <rect className={styles.connectorMark} x="105" y="560" width="44" height="1" />
            <rect className={styles.connectorMark} x="292" y="704" width="70" height="1" />
          </svg>
          <div className={styles.videoStage}>
            <video
              key={heroVideoSrc}
              ref={videoRef}
              className={styles.heroVideo}
              src={heroVideoSrc}
              muted
              playsInline
              preload="auto"
            />
          </div>
          <span className={styles.visualLabel}>APX_01</span>
        </div>

        <div className={styles.servicesPanel}>
          {services.map(({ id, label, icon: Icon }, index) => (
            <a
              key={label}
              href="#servicios"
              className={`${styles.serviceTag} ${activeService === index ? styles.serviceActive : ''}`}
              onClick={(event) => scrollToTarget(event, '#servicios')}
            >
              <span>{id}</span>
              <Icon size={18} strokeWidth={1.55} />
              <strong>{label}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
