import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Services.module.css';

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconAI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" />
    <path d="M9 6V4M12 6V4M15 6V4M9 20v-2M12 20v-2M15 20v-2M6 9H4M6 12H4M6 15H4M20 9h-2M20 12h-2M20 15h-2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity=".45" />
  </svg>
);

const IconExp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2.5" y="4" width="19" height="14" rx="2" />
    <path d="M8 21h8M12 18v3M9 10l-2 2 2 2M15 10l2 2-2 2" />
  </svg>
);

const IconData = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 13c2-2.5 4 3 6 0 2-3 4 3 6-1.5 2-4.5 4-2 6-4" />
    <path d="M4 20h16" opacity=".22" />
    <circle cx="9" cy="13" r="1.5" fill="currentColor" opacity=".45" />
    <circle cx="15" cy="11.5" r="1.5" fill="currentColor" opacity=".45" />
    <circle cx="21" cy="7.5" r="1.5" fill="currentColor" opacity=".65" />
  </svg>
);

const IconEvents = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="15" rx="2" />
    <path d="M7 3v4M17 3v4M3 10h18" />
    <path d="M8 15h3M13 15h3M8 18h2" />
  </svg>
);

const IconDev = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <path d="M12 4v16" opacity=".3" />
  </svg>
);

const SERVICES = [
  {
    id: 'ai',
    accent: '#10B981',
    rgb: '16,185,129',
    pill: 'IA + Automatizacion',
    Icon: IconAI,
    title: 'IA y automatizacion inteligente',
    desc: 'Automatizamos procesos con IA, LLMs, RAG, bots, RPA e integraciones para reducir trabajo manual y acelerar operaciones.',
    outcome: 'Flujos inteligentes que entienden informacion, responden, ejecutan tareas y conectan herramientas del negocio.',
    metric: '+40%',
    metricLabel: 'eficiencia operativa',
    timeline: ['Diagnostico de oportunidades IA', 'Prototipo funcional con tus datos', 'Automatizacion integrada y medible'],
    deliverables: ['LLMs y RAG', 'Bots y agentes IA', 'RPA e integraciones'],
    motion: 'AI automation flow',
  },
  {
    id: 'exp',
    accent: '#06B6D4',
    rgb: '6,182,212',
    pill: 'Activaciones',
    Icon: IconExp,
    title: 'Experiencias',
    desc: 'Pantallas, totens y activaciones interactivas que vuelven visible la marca y medible cada punto de contacto.',
    outcome: 'Mayor permanencia, captura de leads y recuerdo de marca.',
    metric: '+35%',
    metricLabel: 'engagement',
    timeline: ['Concepto de interaccion', 'Prototipo visual', 'Activacion en vivo'],
    deliverables: ['Micrositios', 'Pantallas tactiles', 'Experiencias de evento'],
    motion: 'Interactive UX show',
  },
  {
    id: 'events',
    accent: '#8B5CF6',
    rgb: '139,92,246',
    pill: 'Marketing',
    Icon: IconEvents,
    title: 'Produccion de eventos 360',
    desc: 'Disenamos y producimos eventos de marca: activaciones, merch, stands corporativos, lanzamientos, conferencias y locaciones.',
    outcome: 'Experiencias presenciales que posicionan marca y convierten audiencias en comunidad.',
    metric: '360',
    metricLabel: 'experiencia integral',
    timeline: ['Estrategia y concepto', 'Produccion y montaje', 'Operacion del evento'],
    deliverables: ['Activaciones', 'Merch y stands', 'Lanzamientos y conferencias'],
    motion: 'Event 360 flow',
  },
  {
    id: 'data',
    accent: '#6366F1',
    rgb: '99,102,241',
    pill: 'Analytics',
    Icon: IconData,
    title: 'Analisis de datos',
    desc: 'Dashboards, reporterias y pipelines para leer el negocio con menos ruido y mas velocidad.',
    outcome: 'Datos accionables para decisiones de producto, ventas y operaciones.',
    metric: '-32%',
    metricLabel: 'costo operativo',
    timeline: ['Fuentes y eventos', 'Modelo de datos', 'Tableros ejecutivos'],
    deliverables: ['Dashboards', 'Pipelines', 'Alertas automaticas'],
    motion: 'Insight dashboard',
  },
  {
    id: 'dev',
    accent: '#14B8A6',
    rgb: '20,184,166',
    pill: 'Plataformas',
    Icon: IconDev,
    title: 'Desarrollo de software',
    desc: 'Desarrollo a la medida para marketing, operaciones, ventas, datos y equipos internos que necesitan herramientas propias.',
    outcome: 'Soluciones digitales adaptadas a cada area del negocio, listas para operar y escalar.',
    metric: '2x',
    metricLabel: 'velocidad de entrega',
    timeline: ['Diagnostico del area', 'Producto a la medida', 'Deploy y mejora continua'],
    deliverables: ['Web apps', 'CRMs internos', 'Portales y paneles'],
    motion: 'Custom software build',
  },
];

const AI_CAPABILITIES = [
  {
    id: 'llm',
    label: 'LLM',
    title: 'Asistente conversacional',
    desc: 'Un celular respondiendo preguntas con lenguaje natural, contexto del negocio y tono de marca.',
  },
  {
    id: 'rag',
    label: 'RAG',
    title: 'Busqueda con documentos',
    desc: 'Documentos, vectores y fuentes internas conectadas para respuestas precisas y verificables.',
  },
  {
    id: 'agents',
    label: 'Bots y agentes IA',
    title: 'Agentes que ejecutan tareas',
    desc: 'Bots que clasifican solicitudes, consultan sistemas, responden usuarios y escalan casos.',
  },
  {
    id: 'rpa',
    label: 'RPA e integraciones',
    title: 'Automatizacion operativa',
    desc: 'Flujos que conectan CRMs, hojas de calculo, correos, APIs y herramientas internas.',
  },
];

const CapabilityVisual = ({ active }) => {
  if (active.id === 'rag') {
    return (
      <div className={`${styles.capabilityVisual} ${styles.ragVisual}`}>
        <div className={styles.docStack}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.vectorCloud}>
          {Array.from({ length: 9 }).map((_, index) => <i key={index} />)}
        </div>
        <div className={styles.answerNode}>Respuesta con fuentes</div>
      </div>
    );
  }

  if (active.id === 'agents') {
    return (
      <div className={`${styles.capabilityVisual} ${styles.agentVisual}`}>
        <div className={styles.agentPulse} />
        <div className={styles.agentHub}>
          <strong>Agente IA</strong>
          <small>orquesta tareas</small>
        </div>
        <svg className={styles.agentLinks} viewBox="0 0 420 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M210 110 C125 40 78 38 48 58" />
          <path d="M210 110 C305 42 356 42 382 62" />
          <path d="M210 110 C118 178 78 178 46 158" />
          <path d="M210 110 C304 176 356 176 382 154" />
        </svg>
        <span><b>Lead</b><small>califica</small></span>
        <span><b>CRM</b><small>actualiza</small></span>
        <span><b>Email</b><small>responde</small></span>
        <span><b>Soporte</b><small>escala</small></span>
      </div>
    );
  }

  if (active.id === 'rpa') {
    return (
      <div className={`${styles.capabilityVisual} ${styles.rpaVisual}`}>
        {['Captura', 'Valida', 'Ejecuta', 'Reporta'].map((step, index) => (
          <div key={step} className={styles.rpaStep} style={{ '--step': index }}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </div>
        ))}
        <div className={styles.rpaRunner} />
      </div>
    );
  }

  return (
    <div className={`${styles.capabilityVisual} ${styles.phoneVisual}`}>
      <div className={styles.phoneShell}>
        <div className={styles.phoneTop} />
        <div className={styles.chatBubble}>Hola, quiero conocer el servicio.</div>
        <div className={styles.chatBubbleAlt}>Claro. Podemos automatizar atencion, ventas y soporte con IA.</div>
        <div className={styles.typingDots}><span /><span /><span /></div>
      </div>
    </div>
  );
};

const AIAutomationReel = ({ service, activeCapability }) => (
  <div className={styles.aiReel} style={{ '--accent': service.accent, '--rgb': service.rgb }}>
    <div className={styles.reelTop}>
      <div className={styles.windowDots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className={styles.reelLabel}>{activeCapability.title}</span>
      <span className={styles.liveDot}>IA</span>
    </div>
    <div className={styles.aiReelBody}>
      <CapabilityVisual active={activeCapability} />
      <div className={styles.capabilityCopy}>
        <span>{activeCapability.label}</span>
        <strong>{activeCapability.title}</strong>
        <p>{activeCapability.desc}</p>
      </div>
    </div>
  </div>
);

const UXReel = ({ service }) => (
  <div className={styles.reel} style={{ '--accent': service.accent, '--rgb': service.rgb }}>
    <div className={styles.reelTop}>
      <div className={styles.windowDots} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <span className={styles.reelLabel}>{service.motion}</span>
      <span className={styles.liveDot}>LIVE</span>
    </div>

    <div className={styles.reelStage}>
      <div className={styles.prototype}>
        <div className={styles.sideNav}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.canvas}>
          <div className={styles.heroWire}>
            <span />
            <span />
          </div>
          <div className={styles.motionCard}>
            <service.Icon />
            <div>
              <strong>{service.title}</strong>
              <small>{service.outcome}</small>
            </div>
          </div>
          <div className={styles.flowLine} />
          <div className={styles.chartGrid}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.cursor} />
      </div>
    </div>
  </div>
);

const Services = ({ theme = 'dark', onThemeChange = () => {} }) => {
  const sectionRef = useRef(null);
  const dockRef = useRef(null);
  const showcaseRef = useRef(null);
  const itemRefs = useRef({});
  const [visible, setVisible] = useState(true);
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const [activeCapabilityId, setActiveCapabilityId] = useState(AI_CAPABILITIES[0].id);

  const activeService = useMemo(
    () => SERVICES.find((service) => service.id === activeId) ?? SERVICES[0],
    [activeId]
  );
  const activeCapability = useMemo(
    () => AI_CAPABILITIES.find((item) => item.id === activeCapabilityId) ?? AI_CAPABILITIES[0],
    [activeCapabilityId]
  );
  const isAIService = activeService.id === 'ai';

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.06 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;

    const syncActiveService = () => {
      frame = 0;

      const items = SERVICES
        .map((service) => itemRefs.current[service.id])
        .filter(Boolean);

      if (!items.length) return;

      const guideY = window.innerHeight * 0.46;
      let closestId = items[0].dataset.serviceId;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - guideY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = item.dataset.serviceId;
        }
      }

      if (closestId) {
        setActiveId((current) => (current === closestId ? current : closestId));
      }
    };

    const requestSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncActiveService);
    };

    syncActiveService();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  }, []);

  useEffect(() => {
    const dock = dockRef.current;
    const panel = showcaseRef.current;
    if (!dock || !panel) return;

    let frame = 0;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const syncPanelToScroll = () => {
      frame = 0;

      if (window.matchMedia('(max-width: 1180px)').matches) {
        dock.style.setProperty('--panel-y', '0px');
        dock.style.setProperty('--scroll-progress', '0');
        return;
      }

      const scrollY = window.scrollY || window.pageYOffset;
      const dockTop = dock.getBoundingClientRect().top + scrollY;
      const dockHeight = dock.offsetHeight;
      const panelHeight = panel.offsetHeight;
      const navbarOffset = 112;
      const maxY = Math.max(0, dockHeight - panelHeight);
      const y = clamp(scrollY + navbarOffset - dockTop, 0, maxY);
      const progress = maxY > 0 ? y / maxY : 0;

      dock.style.setProperty('--panel-y', `${y.toFixed(1)}px`);
      dock.style.setProperty('--scroll-progress', progress.toFixed(3));
    };

    const requestSync = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(syncPanelToScroll);
    };

    syncPanelToScroll();
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestSync);
      window.removeEventListener('resize', requestSync);
    };
  }, [activeId]);

  const handleShowcaseMove = (event) => {
    const box = showcaseRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    box.style.setProperty('--mx', `${x}px`);
    box.style.setProperty('--my', `${y}px`);
    box.style.setProperty('--tilt-x', `${(-py * 3).toFixed(2)}deg`);
    box.style.setProperty('--tilt-y', `${(px * 3).toFixed(2)}deg`);
  };

  const handleShowcaseLeave = () => {
    const box = showcaseRef.current;
    if (!box) return;

    box.style.setProperty('--mx', '50%');
    box.style.setProperty('--my', '30%');
    box.style.setProperty('--tilt-x', '0deg');
    box.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className={`${styles.section} ${styles[theme]} ${visible ? styles.visible : ''}`}
    >
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
          Servicios que se sienten como<br />
          una experiencia <span className={styles.gradWord}>interactiva</span>.
        </h2>
        <p className={styles.sub}>
          Explora cada linea de trabajo como si fuera un prototipo: cambia el servicio,
          mira el flujo y descubre que entregamos para mover tu negocio.
        </p>
        <div className={styles.themeToggle} aria-label="Cambiar fondo de servicios">
          <button
            type="button"
            className={theme === 'dark' ? styles.themeActive : ''}
            onClick={() => onThemeChange('dark')}
            aria-pressed={theme === 'dark'}
          >
            Oscuro
          </button>
          <button
            type="button"
            className={theme === 'light' ? styles.themeActive : ''}
            onClick={() => onThemeChange('light')}
            aria-pressed={theme === 'light'}
          >
            Claro
          </button>
        </div>
      </div>

      <div className={styles.experience}>
        <div className={styles.serviceRail} aria-label="Servicios interactivos">
          {SERVICES.map((service, index) => {
            const isActive = service.id === activeId;

            return (
              <button
                key={service.id}
                ref={(node) => {
                  itemRefs.current[service.id] = node;
                }}
                type="button"
                data-service-id={service.id}
                className={`${styles.serviceButton} ${isActive ? styles.activeService : ''}`}
                style={{ '--accent': service.accent, '--rgb': service.rgb, '--delay': `${index * 80}ms` }}
                onClick={() => setActiveId(service.id)}
                onFocus={() => setActiveId(service.id)}
                onMouseEnter={() => setActiveId(service.id)}
                aria-pressed={isActive}
              >
                <span className={styles.serviceIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.serviceIcon}>
                  <service.Icon />
                </span>
                <span className={styles.serviceText}>
                  <span className={styles.servicePill}>{service.pill}</span>
                  <strong>{service.title}</strong>
                  <small>{service.desc}</small>
                </span>
                <span className={styles.serviceArrow}>
                  <Arrow />
                </span>
              </button>
            );
          })}
        </div>

        <div ref={dockRef} className={styles.showcaseDock}>
          <aside
            ref={showcaseRef}
            className={styles.showcase}
            style={{
              '--accent': activeService.accent,
              '--rgb': activeService.rgb,
              '--mx': '50%',
              '--my': '30%',
              '--tilt-x': '0deg',
              '--tilt-y': '0deg',
            }}
            onMouseMove={handleShowcaseMove}
            onMouseLeave={handleShowcaseLeave}
          >
            <div className={styles.showcaseHeader}>
              <span className={styles.showcaseKicker}>{activeService.pill}</span>
              <h3>{activeService.title}</h3>
              <p>{activeService.outcome}</p>
            </div>

            {isAIService ? (
              <AIAutomationReel service={activeService} activeCapability={activeCapability} />
            ) : (
              <UXReel service={activeService} />
            )}

            <div className={styles.showcaseGrid}>
              <div className={styles.metric}>
                <span>{activeService.metric}</span>
                <small>{activeService.metricLabel}</small>
              </div>

              <div className={styles.timeline}>
                {activeService.timeline.map((item, index) => (
                  <div key={item} className={styles.timelineItem}>
                    <span>{index + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              {isAIService ? (
                <div className={styles.deliverables}>
                  {AI_CAPABILITIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={item.id === activeCapabilityId ? styles.activeChip : ''}
                      onClick={() => setActiveCapabilityId(item.id)}
                      onMouseEnter={() => setActiveCapabilityId(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={styles.deliverables}>
                  {activeService.deliverables.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.showcaseActions}>
              <a href="#contacto" className={styles.cta}>
                Cotizar este servicio <Arrow />
              </a>
              {isAIService && (
                <a href="/servicios/ia-automatizacion" className={styles.moreInfo}>
                  Mas informacion <Arrow />
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Services;
