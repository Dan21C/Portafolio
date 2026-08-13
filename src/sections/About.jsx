import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Code2,
  Database,
  MonitorSmartphone,
  MousePointerClick,
  Sparkles,
  Target,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import styles from './About.module.css';

const asset = (filename) => `/Assets/About/${filename}.png`;

const ecosystemServices = [
  {
    id: 'experiencias',
    number: '01',
    title: 'Experiencias interactivas',
    description: 'Activaciones, juegos y pantallas para conectar con tu audiencia.',
    lead: 'Interacciones memorables para que la marca se viva.',
    detail:
      'Diseñamos dinámicas, recorridos, pantallas y juegos que convierten cada punto de contacto en participación real. La experiencia se construye para verse potente, sentirse fluida y dejar datos útiles para la marca.',
    result: 'Audiencias más activas, datos útiles y experiencias que se recuerdan.',
    image: asset('experiencias-interactivas'),
    preview: asset('thumb-experiencias-interactivas'),
    Icon: MonitorSmartphone,
    features: [
      { label: 'Activaciones', text: 'Experiencias listas para evento.', Icon: Sparkles },
      { label: 'Participación', text: 'Juegos y retos medibles.', Icon: MousePointerClick },
      { label: 'Recuerdo', text: 'Momentos diseñados para compartir.', Icon: Target },
    ],
    x: 50,
    y: 9,
    path: 'M500 382 C500 314 500 206 500 110',
  },
  {
    id: 'automatizacion',
    number: '02',
    title: 'Automatización e integraciones',
    description: 'Conectamos procesos y plataformas para ahorrar tiempo.',
    lead: 'Procesos conectados que liberan horas operativas.',
    detail:
      'Unimos herramientas, datos y reglas de negocio para que las tareas repetitivas avancen sin depender de pasos manuales. El resultado es una operación más clara, trazable y fácil de escalar.',
    result: 'Menos reprocesos, menos errores y más foco para el equipo.',
    image: asset('automatizacion-integraciones'),
    preview: asset('thumb-automatizacion-integraciones'),
    Icon: Workflow,
    features: [
      { label: 'Flujos', text: 'Tareas repetitivas automatizadas.', Icon: Workflow },
      { label: 'Integración', text: 'Herramientas conectadas.', Icon: Database },
      { label: 'Velocidad', text: 'Operación sin fricción diaria.', Icon: Zap },
    ],
    x: 22,
    y: 35,
    path: 'M500 382 C410 342 318 300 222 258',
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
    image: asset('hardware-displays'),
    preview: asset('thumb-hardware-displays'),
    Icon: MonitorSmartphone,
    features: [
      { label: 'Tótems', text: 'Puntos interactivos de marca.', Icon: MonitorSmartphone },
      { label: 'Montaje', text: 'Instalación y operación en campo.', Icon: Sparkles },
      { label: 'Soporte', text: 'Tecnología cuidada en vivo.', Icon: Zap },
    ],
    x: 23,
    y: 66,
    path: 'M500 382 C406 430 324 502 236 624',
  },
  {
    id: 'ia',
    number: '04',
    title: 'IA aplicada',
    description: 'IA útil para crear, entender y responder mejor.',
    lead: 'IA útil, integrada donde realmente genera valor.',
    detail:
      'Aplicamos inteligencia artificial a experiencias, procesos y productos digitales para entender, responder y adaptarse a las necesidades de las personas y del negocio.',
    result: 'Experiencias y procesos capaces de entender, responder y adaptarse.',
    image: asset('ia-aplicada'),
    preview: asset('thumb-ia-aplicada'),
    Icon: BrainCircuit,
    features: [
      { label: 'Visión', text: 'Detectamos señales del mundo real.', Icon: Bot },
      { label: 'Generativa', text: 'Creamos contenido y soluciones.', Icon: BrainCircuit },
      { label: 'Asistentes', text: 'Respuestas y decisiones más ágiles.', Icon: Code2 },
    ],
    x: 50,
    y: 84,
    path: 'M500 382 C500 462 500 562 500 660',
  },
  {
    id: 'analitica',
    number: '05',
    title: 'Analítica y datos',
    description: 'Métricas claras para entender y decidir mejor.',
    lead: 'Datos convertidos en señales simples para decidir.',
    detail:
      'Organizamos información de campañas, eventos y plataformas para leer resultados sin ruido. La medición se vuelve una herramienta práctica para optimizar, comparar y tomar mejores decisiones.',
    result: 'Decisiones más rápidas con indicadores entendibles.',
    image: asset('analitica-datos'),
    preview: asset('thumb-analitica-datos'),
    Icon: BarChart3,
    features: [
      { label: 'Dashboards', text: 'Lectura clara de resultados.', Icon: BarChart3 },
      { label: 'Medición', text: 'Indicadores antes y después.', Icon: Target },
      { label: 'Datos', text: 'Información ordenada y accionable.', Icon: Database },
    ],
    x: 78,
    y: 66,
    path: 'M500 382 C594 430 688 502 780 624',
  },
  {
    id: 'software',
    number: '06',
    title: 'Software y operación',
    description: 'Plataformas a la medida para operar mejor.',
    lead: 'Herramientas propias para ordenar la operación.',
    detail:
      'Diseñamos plataformas, dashboards y sistemas internos conectados al proceso real de cada equipo. La interfaz se piensa para operar todos los días, con claridad y control.',
    result: 'Operaciones más simples, trazables y escalables.',
    image: asset('software-operacion'),
    preview: asset('thumb-software-operacion'),
    Icon: Code2,
    features: [
      { label: 'Plataformas', text: 'Software hecho a la medida.', Icon: Code2 },
      { label: 'Operación', text: 'Procesos visibles y trazables.', Icon: Workflow },
      { label: 'Escala', text: 'Sistemas listos para crecer.', Icon: Zap },
    ],
    x: 79,
    y: 35,
    path: 'M500 382 C590 342 694 300 802 258',
  },
];

const bulbPositions = [
  { x: 50, y: 5 },
  { x: 69, y: 10 },
  { x: 84, y: 27 },
  { x: 91, y: 50 },
  { x: 84, y: 73 },
  { x: 69, y: 90 },
  { x: 50, y: 95 },
  { x: 31, y: 90 },
  { x: 16, y: 73 },
  { x: 9, y: 50 },
  { x: 16, y: 27 },
  { x: 31, y: 10 },
];

const About = () => {
  const [connected, setConnected] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [pulseKey, setPulseKey] = useState(0);

  const activeService =
    ecosystemServices.find((service) => service.id === activeId) ?? ecosystemServices[0];

  const pulseConnections = () => {
    setConnected(true);
    setPulseKey((key) => key + 1);
  };

  const selectService = (id) => {
    setActiveId(id);
    setDetailOpen(true);
    pulseConnections();
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setActiveId(null);
  };

  useEffect(() => {
    if (!detailOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDetailOpen(false);
        setActiveId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailOpen]);

  return (
    <section
      id="nosotros"
      className={`${styles.section} ${connected ? styles.connected : ''} ${detailOpen ? styles.detailOpen : ''}`}
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
          <div className={styles.ecosystem} aria-label="Mapa interactivo de servicios APX">
            <div className={styles.spiralField} aria-hidden="true" />
            <div className={styles.orbitOuter} aria-hidden="true" />
            <div className={styles.orbitMiddle} aria-hidden="true" />
            <div className={styles.orbitInner} aria-hidden="true" />

            <svg
              className={styles.cables}
              viewBox="0 0 1000 760"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <g key={pulseKey}>
                {ecosystemServices.map((service, index) => (
                  <path
                    key={service.id}
                    className={`${styles.cable} ${service.id === activeId ? styles.cableActive : ''}`}
                    d={service.path}
                    pathLength="1"
                    style={{ '--delay': `${index * 95}ms` }}
                  />
                ))}
              </g>
            </svg>

            <button
              type="button"
              className={styles.centerNode}
              onClick={pulseConnections}
              aria-pressed={connected}
            >
              <span>Personas al centro.</span>
              <strong>Tecnología alrededor.</strong>
            </button>

            <div className={styles.bulbRing} aria-hidden="true">
              {bulbPositions.map((bulb, index) => (
                <span
                  key={`${bulb.x}-${bulb.y}`}
                  style={{ '--x': `${bulb.x}%`, '--y': `${bulb.y}%`, '--delay': `${index * 90}ms` }}
                />
              ))}
            </div>

            {ecosystemServices.map((service, index) => (
              <button
                key={service.id}
                type="button"
                className={`${styles.serviceNode} ${service.id === activeId ? styles.serviceActive : ''}`}
                style={{ '--x': `${service.x}%`, '--y': `${service.y}%`, '--delay': `${index * 80}ms` }}
                onClick={() => selectService(service.id)}
                aria-pressed={service.id === activeId}
              >
                <span className={styles.serviceMedia}>
                  <img src={service.preview} alt="" loading="lazy" decoding="async" />
                </span>
                <span className={styles.serviceText}>
                  <strong>{service.title}</strong>
                </span>
              </button>
            ))}
          </div>

          <p className={styles.hint}>
            Toca el centro para activar las conexiones. Luego elige un servicio.
          </p>
        </div>
      </div>

      {detailOpen && (
        <div
          className={styles.detailOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-detail-title"
        >
          <div className={styles.detailScrim} onClick={closeDetail} aria-hidden="true" />
          <article className={styles.detailPanel} aria-live="polite">
            <div className={styles.detailImage}>
              <img
                key={activeService.image}
                src={activeService.image}
                alt={`Vista de ${activeService.title}`}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className={styles.detailContent}>
              <button
                type="button"
                className={styles.closeDetail}
                onClick={closeDetail}
                aria-label="Volver al ecosistema"
                title="Volver al ecosistema"
              >
                <X aria-hidden="true" />
              </button>

              <div className={styles.detailTop}>
                <span className={styles.detailIcon}>
                  <activeService.Icon aria-hidden="true" />
                </span>
                <div>
                  <span className={styles.detailKicker}>Ecosistema APX</span>
                  <h3 id="service-detail-title">{activeService.title}</h3>
                </div>
                <strong className={styles.detailNumber}>{activeService.number}</strong>
              </div>

              <p className={styles.detailLead}>{activeService.lead}</p>
              <p className={styles.detailText}>{activeService.detail}</p>

              <div className={styles.detailDivider} />

              <div className={styles.featureGrid}>
                {activeService.features.map(({ label, text, Icon }) => (
                  <div key={label} className={styles.featureItem}>
                    <Icon aria-hidden="true" />
                    <strong>{label}</strong>
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div className={styles.resultBlock}>
                <Target aria-hidden="true" />
                <div>
                  <span>Resultado</span>
                  <p>{activeService.result}</p>
                </div>
              </div>

              <a className={styles.detailCta} href="#servicios" onClick={closeDetail}>
                Ver servicio <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
};

export default About;
