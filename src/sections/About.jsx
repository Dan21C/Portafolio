import { useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  Bot,
  BrainCircuit,
  Code2,
  Database,
  Lightbulb,
  MonitorSmartphone,
  MousePointerClick,
  Sparkles,
  Target,
  Workflow,
  Zap,
} from 'lucide-react';
import styles from './About.module.css';

const ecosystemAsset = (filename) => `/Assets/Ecosystem/${filename}.png`;
const orbitLightCount = 16;

const ecosystemServices = [
  {
    id: 'experiencias',
    number: '02',
    title: 'Experiencias interactivas',
    description: 'Activaciones, juegos y pantallas para conectar con tu audiencia.',
    lead: 'Interacciones memorables para que la marca se viva.',
    detail:
      'Diseñamos dinámicas, recorridos, pantallas y juegos que convierten cada punto de contacto en participación real. La experiencia se construye para verse potente, sentirse fluida y dejar datos útiles para la marca.',
    result: 'Audiencias más activas, datos útiles y experiencias que se recuerdan.',
    image: ecosystemAsset('02-experiencias-clean'),
    preview: ecosystemAsset('02-experiencias-clean'),
    Icon: MonitorSmartphone,
    features: [
      { label: 'Activaciones', text: 'Experiencias listas para evento.', Icon: Sparkles },
      { label: 'Participación', text: 'Juegos y retos medibles.', Icon: MousePointerClick },
      { label: 'Recuerdo', text: 'Momentos diseñados para compartir.', Icon: Target },
    ],
    angle: -90,
    crop: ['412.84%', '437.67%', '78.14%', '11.29%'],
  },
  {
    id: 'automatizacion',
    number: '01',
    title: 'Automatización e integraciones',
    description: 'Conectamos procesos y plataformas para ahorrar tiempo.',
    lead: 'Procesos conectados que liberan horas operativas.',
    detail:
      'Unimos herramientas, datos y reglas de negocio para que las tareas repetitivas avancen sin depender de pasos manuales. El resultado es una operación más clara, trazable y fácil de escalar.',
    result: 'Menos reprocesos, menos errores y más foco para el equipo.',
    image: ecosystemAsset('01-automatizacion'),
    preview: ecosystemAsset('01-automatizacion'),
    Icon: Workflow,
    features: [
      { label: 'Flujos', text: 'Tareas repetitivas automatizadas.', Icon: Workflow },
      { label: 'Integración', text: 'Herramientas conectadas.', Icon: Database },
      { label: 'Velocidad', text: 'Operación sin fricción diaria.', Icon: Zap },
    ],
    angle: -150,
    crop: ['388.84%', '437.67%', '34.78%', '6.2%'],
  },
  {
    id: 'hardware',
    number: '03',
    title: 'Hardware y displays',
    description: 'Tótems, pantallas y tecnología lista para operar.',
    lead: 'Tecnología física producida para verse bien y funcionar.',
    detail:
      'Coordinamos displays, tótems, pantallas y montaje técnico para que la experiencia se sostenga en campo. Cada pieza se plantea como parte del recorrido, no como un elemento aislado.',
    result: 'Implementaciones más sólidas, visibles y listas para operar.',
    image: ecosystemAsset('03-hardware-clean'),
    preview: ecosystemAsset('03-hardware-clean'),
    Icon: MonitorSmartphone,
    features: [
      { label: 'Tótems', text: 'Puntos interactivos de marca.', Icon: MonitorSmartphone },
      { label: 'Montaje', text: 'Instalación y operación en campo.', Icon: Sparkles },
      { label: 'Soporte', text: 'Tecnología cuidada en vivo.', Icon: Zap },
    ],
    angle: 150,
    crop: ['398.1%', '427.73%', '4.15%', '41.05%'],
  },
  {
    id: 'ia',
    number: '06',
    title: 'IA aplicada',
    description: 'IA útil para crear, entender y responder mejor.',
    lead: 'IA útil, integrada donde realmente genera valor.',
    detail:
      'Aplicamos inteligencia artificial a experiencias, procesos y productos digitales para entender, responder y adaptarse a las necesidades de las personas y del negocio.',
    result: 'Experiencias y procesos capaces de entender, responder y adaptarse.',
    image: ecosystemAsset('06-ia'),
    preview: ecosystemAsset('06-ia'),
    Icon: BrainCircuit,
    features: [
      { label: 'Visión', text: 'Detectamos señales del mundo real.', Icon: Bot },
      { label: 'Generativa', text: 'Creamos contenido y soluciones.', Icon: BrainCircuit },
      { label: 'Asistentes', text: 'Respuestas y decisiones más ágiles.', Icon: Code2 },
    ],
    angle: 90,
    crop: ['398.1%', '437.67%', '20.61%', '87.47%'],
  },
  {
    id: 'analitica',
    number: '04',
    title: 'Analítica y datos',
    description: 'Métricas claras para entender y decidir mejor.',
    lead: 'Datos convertidos en señales simples para decidir.',
    detail:
      'Organizamos información de campañas, eventos y plataformas para leer resultados sin ruido. La medición se vuelve una herramienta práctica para optimizar, comparar y tomar mejores decisiones.',
    result: 'Decisiones más rápidas con indicadores entendibles.',
    image: ecosystemAsset('04-analitica-clean'),
    preview: ecosystemAsset('04-analitica-clean'),
    Icon: BarChart3,
    features: [
      { label: 'Dashboards', text: 'Lectura clara de resultados.', Icon: BarChart3 },
      { label: 'Medición', text: 'Indicadores antes y después.', Icon: Target },
      { label: 'Datos', text: 'Información ordenada y accionable.', Icon: Database },
    ],
    angle: 30,
    crop: ['398.1%', '437.67%', '63.1%', '92.98%'],
  },
  {
    id: 'software',
    number: '05',
    title: 'Software y operación',
    description: 'Plataformas a la medida para operar mejor.',
    lead: 'Herramientas propias para ordenar la operación.',
    detail:
      'Diseñamos plataformas, dashboards y sistemas internos conectados al proceso real de cada equipo. La interfaz se piensa para operar todos los días, con claridad y control.',
    result: 'Operaciones más simples, trazables y escalables.',
    image: ecosystemAsset('05-plataforma'),
    preview: ecosystemAsset('05-plataforma'),
    Icon: Code2,
    features: [
      { label: 'Plataformas', text: 'Software hecho a la medida.', Icon: Code2 },
      { label: 'Operación', text: 'Procesos visibles y trazables.', Icon: Workflow },
      { label: 'Escala', text: 'Sistemas listos para crecer.', Icon: Zap },
    ],
    angle: -30,
    crop: ['418%', '437.67%', '93.55%', '55.92%'],
  },
];

const orbitPosition = (angle) => {
  const radians = (angle * Math.PI) / 180;

  return {
    x: 50 + Math.cos(radians) * 34.5,
    y: 50 + Math.sin(radians) * 30.5,
  };
};

const mobileEcosystemServices = [
  'automatizacion',
  'experiencias',
  'hardware',
  'analitica',
  'software',
  'ia',
].map((id) => ecosystemServices.find((service) => service.id === id));

const About = () => {
  const ecosystemRef = useRef(null);
  const pointerFrameRef = useRef(0);
  const orbitFrameRef = useRef(0);
  const orbitRotationRef = useRef(0);
  const orbitNodesRef = useRef({});
  const orbitLightsRef = useRef([]);
  const connectionRefs = useRef({});
  const hoveredIdRef = useRef(null);
  const centerFocusedRef = useRef(false);
  const dragRef = useRef({ active: false, pointerId: null, x: 0, velocity: 0 });
  const [hoveredId, setHoveredId] = useState(null);
  const [centerFocused, setCenterFocused] = useState(false);

  const focusService = (id) => {
    centerFocusedRef.current = false;
    setCenterFocused(false);
    hoveredIdRef.current = id;
    setHoveredId(id);
  };

  const clearServiceFocus = () => {
    hoveredIdRef.current = null;
    setHoveredId(null);
  };

  const focusCenter = () => {
    hoveredIdRef.current = null;
    setHoveredId(null);
    centerFocusedRef.current = true;
    setCenterFocused(true);
  };

  const clearCenterFocus = () => {
    centerFocusedRef.current = false;
    setCenterFocused(false);
  };

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch' || !ecosystemRef.current) return;

    if (dragRef.current.active) {
      const movement = event.clientX - dragRef.current.x;
      dragRef.current.x = event.clientX;
      dragRef.current.velocity = movement * 0.055;
      orbitRotationRef.current += movement * 0.16;
      return;
    }

    const frame = ecosystemRef.current;
    const bounds = frame.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    window.cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      frame.style.setProperty('--map-x', `${x * 10}px`);
      frame.style.setProperty('--map-y', `${y * 7}px`);
      frame.style.setProperty('--tilt-x', `${y * -0.65}deg`);
      frame.style.setProperty('--tilt-y', `${x * 0.8}deg`);
    });

  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch' || event.target.closest('[data-ecosystem-node]')) return;

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      x: event.clientX,
      velocity: 0,
    };
    ecosystemRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (!dragRef.current.active) return;

    dragRef.current.active = false;
    if (ecosystemRef.current?.hasPointerCapture(event.pointerId)) {
      ecosystemRef.current.releasePointerCapture(event.pointerId);
    }
  };

  const handleWheel = (event) => {
    orbitRotationRef.current += event.deltaY * 0.014;
  };

  const resetPointer = () => {
    const frame = ecosystemRef.current;
    if (!frame) return;

    frame.style.setProperty('--map-x', '0px');
    frame.style.setProperty('--map-y', '0px');
    frame.style.setProperty('--tilt-x', '0deg');
    frame.style.setProperty('--tilt-y', '0deg');
    if (!dragRef.current.active) {
      clearServiceFocus();
      clearCenterFocus();
    }
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previousTime = 0;

    const updateOrbit = (time = 0) => {
      const delta = previousTime ? Math.min(time - previousTime, 34) : 0;
      previousTime = time;

      if (
        !reduceMotion &&
        !hoveredIdRef.current &&
        !centerFocusedRef.current &&
        !dragRef.current.active
      ) {
        orbitRotationRef.current += delta * 0.0032 + dragRef.current.velocity;
        dragRef.current.velocity *= 0.91;
      }

      ecosystemServices.forEach((service) => {
        const position = orbitPosition(service.angle + orbitRotationRef.current);
        const node = orbitNodesRef.current[service.id];
        const depth = 0.92 + (position.y / 100) * 0.1;

        if (node) {
          node.style.setProperty('--node-x', `${position.x}%`);
          node.style.setProperty('--node-y', `${position.y}%`);
          node.style.setProperty('--node-scale', depth.toFixed(3));
          node.style.zIndex = String(Math.round(8 + position.y));
        }

        const connector = connectionRefs.current[service.id];

        if (connector) {
          const nodeX = position.x * 10;
          const nodeY = position.y * 7.5;
          const dx = nodeX - 500;
          const dy = nodeY - 375;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          const unitX = dx / distance;
          const unitY = dy / distance;
          const ellipseEdge = 1 / Math.sqrt((unitX / 142) ** 2 + (unitY / 82) ** 2);
          const startX = 500 + unitX * ellipseEdge;
          const startY = 375 + unitY * ellipseEdge;
          const endX = nodeX - unitX * 65;
          const endY = nodeY - unitY * 38;
          const bend = service.number % 2 === 0 ? 12 : -12;
          const controlX = startX + (endX - startX) * 0.5 - unitY * bend;
          const controlY = startY + (endY - startY) * 0.5 + unitX * bend;

          connector.setAttribute(
            'd',
            `M ${startX.toFixed(2)} ${startY.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`,
          );
        }
      });

      orbitLightsRef.current.forEach((light, index) => {
        if (!light) return;

        const position = orbitPosition(
          index * (360 / orbitLightCount) + orbitRotationRef.current,
        );
        light.style.setProperty('--light-x', `${position.x}%`);
        light.style.setProperty('--light-y', `${position.y}%`);
      });

      orbitFrameRef.current = window.requestAnimationFrame(updateOrbit);
    };

    updateOrbit();

    return () => {
      window.cancelAnimationFrame(pointerFrameRef.current);
      window.cancelAnimationFrame(orbitFrameRef.current);
    };
  }, []);

  return (
    <section
      id="nosotros"
      className={styles.section}
      aria-labelledby="ecosistema-apx-title"
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.copy}>
          <span className={styles.kicker}>Ecosistema APX</span>
          <h2 id="ecosistema-apx-title">
            Creamos conexiones entre personas, tecnología y resultados.
          </h2>
          <span className={styles.rule} aria-hidden="true" />
          <p>
            En APX diseñamos experiencias interactivas, desarrollamos software,
            integramos inteligencia artificial y convertimos datos en decisiones.
          </p>
          <p>
            Construimos ecosistemas donde cada capacidad trabaja en conjunto para
            generar impacto real.
          </p>
        </div>

        <div className={styles.ecosystemWrap}>
          <div
            ref={ecosystemRef}
            className={`${styles.ecosystem} ${hoveredId ? styles.hasFocus : ''} ${centerFocused ? styles.centerFocus : ''}`}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={resetPointer}
            onWheel={handleWheel}
            aria-label="Mapa interactivo de servicios APX"
          >
            <div className={styles.focusVeil} aria-hidden="true" />

            <svg
              className={styles.traceMap}
              viewBox="0 0 1000 750"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="about-orbit-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
                  <stop offset="0.5" stopColor="#fff" stopOpacity="0.72" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
                </linearGradient>
                <radialGradient id="about-node-glow">
                  <stop offset="0" stopColor="#fff" stopOpacity="1" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse className={styles.traceOrbit} cx="500" cy="375" rx="345" ry="229" pathLength="1" />
              <ellipse className={styles.traceOrbit} cx="500" cy="375" rx="245" ry="151" pathLength="1" />
              <ellipse className={styles.traceOrbit} cx="500" cy="375" rx="142" ry="82" pathLength="1" />
              {ecosystemServices.map((service, index) => (
                <path
                  key={service.id}
                  ref={(connector) => {
                    if (connector) connectionRefs.current[service.id] = connector;
                    else delete connectionRefs.current[service.id];
                  }}
                  className={`${styles.serviceConnection} ${service.id === hoveredId ? styles.connectionActive : ''}`}
                  pathLength="1"
                  style={{ '--connection-delay': `${index * 70}ms` }}
                />
              ))}
            </svg>

            <div className={styles.orbitLights} aria-hidden="true">
              {Array.from({ length: orbitLightCount }, (_, index) => {
                const position = orbitPosition(index * (360 / orbitLightCount));

                return (
                  <span
                    key={index}
                    ref={(light) => {
                      orbitLightsRef.current[index] = light;
                    }}
                    style={{
                      '--light-x': `${position.x}%`,
                      '--light-y': `${position.y}%`,
                      '--light-delay': `${index * -0.19}s`,
                    }}
                  >
                    <Lightbulb />
                  </span>
                );
              })}
            </div>

            <div
              className={styles.centerNode}
              data-ecosystem-node
              tabIndex="0"
              onPointerEnter={focusCenter}
              onPointerLeave={clearCenterFocus}
              onFocus={focusCenter}
              onBlur={clearCenterFocus}
              aria-label="Conectar todos los servicios del ecosistema"
            >
              <span>Todo comienza<br />con una conexión.</span>
            </div>

            {ecosystemServices.map((service) => {
              const initialPosition = orbitPosition(service.angle);

              return (
                <article
                  key={service.id}
                  data-ecosystem-node
                  ref={(node) => {
                    if (node) orbitNodesRef.current[service.id] = node;
                    else delete orbitNodesRef.current[service.id];
                  }}
                  tabIndex="0"
                  className={`${styles.serviceNode} ${service.id === hoveredId ? styles.serviceActive : ''}`}
                  style={{
                    '--node-x': `${initialPosition.x}%`,
                    '--node-y': `${initialPosition.y}%`,
                    '--node-scale': 1,
                    '--crop-size-x': service.crop[0],
                    '--crop-size-y': service.crop[1],
                    '--crop-position-x': service.crop[2],
                    '--crop-position-y': service.crop[3],
                  }}
                  onPointerEnter={() => focusService(service.id)}
                  onPointerLeave={clearServiceFocus}
                  onFocus={() => focusService(service.id)}
                  onBlur={clearServiceFocus}
                  aria-label={`${service.title}: ${service.description}`}
                >
                  <div className={styles.nodeMedia}>
                    <img src={service.preview} alt="" loading="eager" decoding="async" />
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.mobileMap} aria-label="Servicios del ecosistema APX">
            {mobileEcosystemServices.map((service) => (
              <article key={service.id}>
                <img
                  src={service.preview}
                  alt={`${service.number}. ${service.title}`}
                  loading="lazy"
                  decoding="async"
                />
              </article>
            ))}
          </div>

          <p className={styles.hint}>
            Arrastra para girar. Explora un servicio o acerca el cursor al centro para conectar todo.
          </p>
        </div>
      </div>

    </section>
  );
};

export default About;
