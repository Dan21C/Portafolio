import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  BrainCircuit,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  Clock,
  Code2,
  CircleCheck,
  Database,
  FileCheck2,
  FileText,
  Gauge,
  LayoutDashboard,
  Link2,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  MousePointerClick,
  Package,
  PanelRightOpen,
  Paintbrush,
  Radio,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import styles from './Services.module.css';

const servicesData = [
  {
    key: 'automatizar',
    number: '01',
    Icon: BrainCircuit,
    menuTitle: 'Automatizar tareas',
    menuDescription: 'Que tu equipo deje de repetir lo mismo todos los días.',
    category: 'AUTOMATIZAR TAREAS',
    panelTitle: 'Automatización simple para trabajar mejor',
    panelDescription: 'Identificamos las tareas repetitivas de tu operación y las convertimos en flujos automáticos, claros y medibles.',
    windowTitle: 'Cómo trabaja tu equipo sin fricción',
    mockupTitle: 'Tu equipo se enfoca en lo importante',
    mockupCopy: 'Pasamos tareas manuales a flujos conectados para que cada área avance con menos reprocesos.',
    flow: [
      { title: 'Antes', text: 'Procesos manuales', Icon: Clock },
      { title: 'Durante', text: 'Flujos conectados', Icon: Workflow },
      { title: 'Después', text: 'Menos errores y más velocidad', Icon: Gauge },
    ],
    resultTitle: 'Más tiempo para tu equipo',
    resultDescription: 'Reducimos cargas manuales, reprocesos y tareas que consumen horas todos los días.',
    steps: ['Revisamos tu proceso actual', 'Diseñamos el flujo ideal', 'Automatizamos y medimos'],
    chips: ['Reportes automáticos', 'Respuestas inteligentes', 'Integraciones', 'Flujos internos'],
    chipIcon: Bot,
  },
  {
    key: 'activar',
    number: '02',
    Icon: MonitorSmartphone,
    menuTitle: 'Activar mi marca',
    menuDescription: 'Experiencias que la gente vive, recuerda y comparte.',
    category: 'ACTIVAR MI MARCA',
    panelTitle: 'Experiencias interactivas que conectan',
    panelDescription: 'Creamos dinámicas, pantallas, juegos y activaciones para que las personas participen, recuerden tu marca y dejen datos útiles.',
    windowTitle: 'Cómo cobra vida tu marca',
    mockupTitle: 'Tu marca cobra vida',
    mockupCopy: 'Diseñamos experiencias que invitan a participar y dejan huella.',
    flow: [
      { title: 'Atracción', text: 'La gente se acerca', Icon: Sparkles },
      { title: 'Interacción', text: 'La gente participa', Icon: MousePointerClick },
      { title: 'Datos', text: 'La marca aprende', Icon: BarChart3 },
    ],
    spotlight: 'Dinámica activa',
    resultTitle: 'Marca en movimiento',
    resultDescription: 'Convertimos una idea de campaña en puntos de contacto vivos, medibles y fáciles de usar.',
    steps: ['Concepto creativo', 'Sistema visual y piezas', 'Activación y seguimiento'],
    chips: ['Pantallas táctiles', 'Tótems', 'Juegos de marca', 'Registro de usuarios'],
    chipIcon: MousePointerClick,
  },
  {
    key: 'producir',
    number: '03',
    Icon: CalendarDays,
    menuTitle: 'Producir un evento',
    menuDescription: 'Hacemos que tu evento salga bien de punta a punta.',
    category: 'PRODUCIR UN EVENTO',
    panelTitle: 'Eventos 360 sin perder detalles',
    panelDescription: 'Acompañamos la planeación, producción, montaje, operación y cierre para que cada evento se sienta organizado, memorable y medible.',
    windowTitle: 'Cómo toma forma tu evento',
    mockupTitle: 'Tu evento toma forma',
    mockupCopy: 'Unimos estrategia, montaje y operación para que todo fluya de principio a fin.',
    flow: [
      { title: 'Planeación', text: 'Definimos el camino', Icon: CalendarDays },
      { title: 'Producción', text: 'Preparamos cada detalle', Icon: ClipboardCheck },
      { title: 'Operación', text: 'Ejecutamos en vivo', Icon: Radio },
    ],
    extras: [
      { label: 'Locación', Icon: MapPin },
      { label: 'Merch', Icon: Package },
      { label: 'Proveedores', Icon: Users },
      { label: 'Guion del evento', Icon: FileText },
    ],
    resultTitle: 'Evento con control total',
    resultDescription: 'Tu marca vive una experiencia bien producida, con tecnología, logística y seguimiento en un solo equipo.',
    steps: ['Estrategia y concepto', 'Producción y montaje', 'Operación y aprendizajes'],
    chips: ['Stands', 'Lanzamientos', 'Activaciones', 'Conferencias', 'Merch'],
    chipIcon: CalendarDays,
  },
  {
    key: 'datos',
    number: '04',
    Icon: BarChart3,
    menuTitle: 'Entender mis datos',
    menuDescription: 'Convertimos números sueltos en decisiones claras.',
    category: 'ENTENDER MIS DATOS',
    panelTitle: 'Datos claros para decidir mejor',
    panelDescription: 'Ordenamos la información de tus eventos, campañas o procesos para que puedas ver qué funciona, qué mejorar y dónde actuar.',
    windowTitle: 'Cómo se entiende tu información',
    mockupTitle: 'Información que se entiende',
    mockupCopy: 'Unimos datos dispersos y los mostramos de forma clara para que puedas actuar a tiempo.',
    flow: [
      { title: 'Recolectamos', text: 'Unimos tus datos', Icon: Database },
      { title: 'Organizamos', text: 'Limpiamos la información', Icon: Blocks },
      { title: 'Mostramos', text: 'Creamos reportes claros', Icon: LayoutDashboard },
    ],
    resultTitle: 'Decisiones con confianza',
    resultDescription: 'Pasamos de datos dispersos a tableros simples que muestran resultados reales y oportunidades.',
    steps: ['Conectamos tus fuentes', 'Organizamos la información', 'Creamos reportes accionables'],
    chips: ['Dashboards', 'Reportes', 'Indicadores', 'Alertas', 'Análisis post-evento'],
    chipIcon: Bell,
  },
  {
    key: 'plataforma',
    number: '05',
    Icon: Code2,
    menuTitle: 'Crear una plataforma',
    menuDescription: 'Una herramienta propia para operar mejor.',
    category: 'CREAR UNA PLATAFORMA',
    panelTitle: 'Software hecho para tu operación',
    panelDescription: 'Diseñamos herramientas digitales a la medida para que tu equipo pueda vender, registrar, operar, consultar o medir desde un solo lugar.',
    windowTitle: 'Cómo se construye tu herramienta',
    mockupTitle: 'Una plataforma para tu forma de trabajar',
    mockupCopy: 'Convertimos tu proceso real en una herramienta simple, usable y lista para crecer.',
    flow: [
      { title: 'Necesidad', text: 'Entendemos tu proceso', Icon: Search },
      { title: 'Diseño', text: 'Creamos una solución simple', Icon: Paintbrush },
      { title: 'Entrega', text: 'La dejamos lista para usar', Icon: Rocket },
    ],
    resultTitle: 'Operación más ágil',
    resultDescription: 'Centralizamos procesos, usuarios y datos en una herramienta propia, fácil de usar y preparada para crecer.',
    steps: ['Diagnóstico del área', 'Producto a la medida', 'Deploy y mejora continua'],
    chips: ['Web apps', 'CRM interno', 'Portales', 'Paneles', 'Formularios'],
    chipIcon: Link2,
  },
];

const metrics = [
  { value: '+80', label: 'marcas confian en nosotros' },
  { value: '+35%', label: 'engagement promedio' },
  { value: '6', label: 'verticales principales' },
  { value: '3', label: 'países con presencia activa' },
];

const automationProducts = [
  {
    key: 'assistant',
    number: '01',
    name: 'APX Assistant',
    title: 'Asistente inteligente para tu empresa',
    description: 'Un asistente con IA que entiende la información de tu empresa y responde preguntas en segundos.',
    benefits: ['Responde sobre documentos internos', 'Ayuda a redactar respuestas', 'Muestra fuentes confiables'],
    result: '-60% tiempo buscando información',
    tags: ['LLM', 'RAG', 'Documentos', 'Fuentes'],
    Icon: Bot,
    visual: 'chat',
    what: 'Centraliza conocimiento interno, consulta documentos y ayuda a responder preguntas frecuentes con fuentes claras.',
    ideal: 'Equipos comerciales, soporte, operaciones o talento humano que pierden tiempo buscando respuestas en archivos dispersos.',
    tech: ['LLM', 'RAG', 'Base documental', 'Fuentes verificables'],
  },
  {
    key: 'leads',
    number: '02',
    name: 'APX Leads Radar',
    title: 'Buscador inteligente de clientes potenciales',
    description: 'Encuentra oportunidades comerciales, organiza prospectos y prepara mensajes personalizados para contactar mejor.',
    benefits: ['Busca empresas por sector', 'Organiza datos públicos útiles', 'Sugiere mensajes personalizados'],
    result: '+3x velocidad en prospección',
    tags: ['Web scraping', 'CRM', 'Lead scoring', 'IA'],
    Icon: Target,
    visual: 'leads',
    what: 'Ayuda a encontrar oportunidades B2B, ordenar prospectos y preparar información para una prospección más responsable.',
    ideal: 'Equipos comerciales que necesitan investigar mercados, priorizar contactos y preparar mensajes con mejor contexto.',
    tech: ['Extracción de datos', 'Scoring IA', 'CRM', 'Validación'],
  },
  {
    key: 'flowops',
    number: '03',
    name: 'APX FlowOps',
    title: 'Flujos automáticos para tareas repetitivas',
    description: 'Automatizamos reportes, alertas, carga de datos e integraciones para que tu operación sea más ágil.',
    benefits: ['Reportes automáticos', 'Alertas inteligentes', 'Integraciones entre herramientas'],
    result: '-40% tareas manuales',
    tags: ['Workflows', 'APIs', 'Reportes', 'Alertas'],
    Icon: Zap,
    visual: 'timeline',
    what: 'Conecta formularios, bases, correos, reportes y herramientas para que las tareas repetitivas se ejecuten solas.',
    ideal: 'Operaciones con procesos manuales recurrentes, validaciones repetidas o información que debe moverse entre sistemas.',
    tech: ['Workflows', 'APIs', 'Automatización', 'Alertas'],
  },
  {
    key: 'reportbot',
    number: '04',
    name: 'APX ReportBot',
    title: 'Reportes automáticos para decidir mejor',
    description: 'Convierte datos dispersos en reportes claros que se generan solos y llegan a tu equipo cuando los necesita.',
    benefits: ['Genera reportes diarios o semanales', 'Resume resultados con IA', 'Envía alertas cuando algo cambia'],
    result: '-70% tiempo creando reportes',
    tags: ['Dashboards', 'Alertas', 'Resúmenes IA', 'Automatización'],
    Icon: ChartNoAxesCombined,
    visual: 'report',
    what: 'Transforma datos sueltos en reportes periódicos, resúmenes ejecutivos y señales simples para decidir más rápido.',
    ideal: 'Equipos que necesitan reportes comerciales, operativos o de campañas sin armar archivos manualmente cada semana.',
    tech: ['Dashboards', 'Pipelines', 'IA generativa', 'Notificaciones'],
  },
  {
    key: 'docflow',
    number: '05',
    name: 'APX DocFlow',
    title: 'Documentos organizados con IA',
    description: 'Lee, clasifica, valida y organiza documentos automáticamente para que tu equipo no revise archivos uno por uno.',
    benefits: ['Extrae información de PDFs y formularios', 'Clasifica documentos por tipo', 'Valida campos importantes'],
    result: '-50% reprocesos administrativos',
    tags: ['Documentos', 'OCR', 'Clasificación IA', 'Validación'],
    Icon: FileCheck2,
    visual: 'documents',
    what: 'Procesa PDFs, formularios y archivos internos para extraer datos, validar campos y ordenar documentos por tipo.',
    ideal: 'Backoffice, administración, compras, legal u operaciones con alto volumen de documentos repetitivos.',
    tech: ['OCR', 'Clasificación IA', 'Validación', 'Extracción estructurada'],
  },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 12,
    filter: 'blur(8px)',
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
};

const WindowDots = () => (
  <span className={styles.windowDots} aria-hidden="true">
    <i />
    <i />
    <i />
  </span>
);

const FlowConnector = ({ variant }) => {
  const isEvent = variant === 'producir';

  return (
    <svg className={styles.flowConnector} viewBox="0 0 780 260" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d={isEvent
          ? 'M80 132 C190 98 255 164 355 126 S520 92 700 136'
          : 'M70 142 C160 48 278 58 344 116 S475 210 606 132 S690 56 744 112'}
        initial={{ pathLength: 0, opacity: 0.35 }}
        animate={{ pathLength: 1, opacity: 0.88 }}
        transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.path
        d="M150 210 C240 230 274 82 390 104 S540 218 650 70"
        initial={{ pathLength: 0, opacity: 0.14 }}
        animate={{ pathLength: 1, opacity: 0.34 }}
        transition={{ duration: 3.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.25 }}
      />
    </svg>
  );
};

const ServiceMockup = ({ service }) => {
  const isActivation = service.key === 'activar';
  const isEvent = service.key === 'producir';

  return (
    <div className={`${styles.mockupWindow} ${styles[`mockup_${service.key}`]}`}>
      <div className={styles.mockupChrome}>
        <WindowDots />
        <span>{service.windowTitle}</span>
        <strong>EN VIVO</strong>
      </div>

      <div className={styles.mockupBody}>
        <div className={styles.mockupIntro}>
          <strong>{service.mockupTitle}</strong>
          <p>{service.mockupCopy}</p>
          <div className={styles.peopleSignal} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.flowStage}>
          <FlowConnector variant={service.key} />
          <div className={styles.ambientNodes} aria-hidden="true">
            {Array.from({ length: 7 }).map((_, index) => <i key={index} />)}
          </div>
          <div className={styles.flowCursor} aria-hidden="true" />

          <div className={styles.flowNodes}>
            {service.flow.map((node, index) => {
              const NodeIcon = node.Icon;
              const highlight = (isActivation && index === 1) || (isEvent && index === 1);

              return (
                <motion.div
                  key={node.title}
                  className={`${styles.flowNode} ${highlight ? styles.flowNodeHot : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NodeIcon />
                  <strong>{node.title}</strong>
                  <span>{node.text}</span>
                </motion.div>
              );
            })}
          </div>

          {service.spotlight && (
            <motion.div
              className={styles.spotlightCard}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Sparkles />
              <strong>{service.spotlight}</strong>
              <small>Participa y gana</small>
            </motion.div>
          )}

          {service.extras && (
            <div className={styles.eventTokens}>
              {service.extras.map((item) => {
                const TokenIcon = item.Icon;

                return (
                  <span key={item.label}>
                    <TokenIcon />
                    {item.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.signalStack}>
          {service.flow.map((node) => {
            const SignalIcon = node.Icon;

            return (
              <div key={node.title} className={styles.signalCard}>
                <SignalIcon />
                <span>
                  <strong>{node.title}</strong>
                  <small>{node.text}</small>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProductVisual = ({ type }) => {
  if (type === 'chat') {
    return (
      <div className={styles.productChat}>
        <span><MessageSquare /> ¿Cómo respondo a un cliente sobre una activación con tótem?</span>
        <strong>APX Assistant</strong>
        <p>Puedes ofrecer una experiencia interactiva con registro, dinámica de participación y medición de resultados.</p>
        <small>Fuentes: 3 documentos</small>
      </div>
    );
  }

  if (type === 'leads') {
    return (
      <div className={styles.productLeads}>
        <strong>Leads encontrados</strong>
        {[
          ['Empresa A', 'Tecnología - Bogotá', '85'],
          ['Empresa B', 'Alimentos - Medellín', '72'],
          ['Empresa C', 'Retail - Cali', '68'],
        ].map(([name, meta, score]) => (
          <span key={name}>
            <i>
              <b>{name}</b>
              <small>{meta}</small>
            </i>
            <em>{score}</em>
          </span>
        ))}
        <button type="button">Ver todos los leads</button>
      </div>
    );
  }

  if (type === 'timeline') {
    return (
      <div className={styles.productTimeline}>
        {['Formulario recibido', 'Validación de datos', 'Guardar en sistema', 'Notificar al equipo', 'Reporte actualizado'].map((item) => (
          <span key={item}><CircleCheck /> {item}</span>
        ))}
      </div>
    );
  }

  if (type === 'report') {
    return (
      <div className={styles.productReport}>
        <strong>Reporte semanal</strong>
        <p>Las activaciones aumentaron y el equipo recibió alertas para priorizar seguimiento.</p>
        <div className={styles.reportBars}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className={styles.reportDonut} />
      </div>
    );
  }

  return (
    <div className={styles.productDocs}>
      {[
        ['Factura_001.pdf', 'Datos extraídos'],
        ['Contrato_Cliente.pdf', 'Clasificado'],
        ['Orden_Compra.pdf', 'Validado'],
      ].map(([doc, status]) => (
        <span key={doc}>
          <FileText />
          <i>
            <b>{doc}</b>
            <small>{status}</small>
          </i>
          <CircleCheck />
        </span>
      ))}
      <strong>Total procesados: 128</strong>
    </div>
  );
};

const AutomationFlow = () => (
  <div className={styles.automationFlow}>
    <div className={styles.flowHeader}>
      <strong>Así funciona la automatización en tu operación</strong>
      <span><i /> EN VIVO</span>
    </div>
    <div className={styles.flowDiagram}>
      <svg viewBox="0 0 920 220" preserveAspectRatio="none" aria-hidden="true">
        <motion.path
          d="M72 110 C152 62 226 164 306 108 S466 62 546 112 S714 158 848 84"
          initial={{ pathLength: 0, opacity: 0.34 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 2.4, ease: 'easeInOut' }}
        />
        <motion.path
          d="M82 132 C194 162 238 76 340 96 S526 164 644 96 S778 78 872 124"
          initial={{ pathLength: 0, opacity: 0.16 }}
          whileInView={{ pathLength: 1, opacity: 0.44 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 3.1, ease: 'easeInOut', delay: 0.2 }}
        />
      </svg>
      <div className={styles.flowStep}>
        <MessageSquare />
        <strong>Disparador</strong>
        <span>Se recibe información</span>
      </div>
      <div className={styles.flowCenter}>
        <b>APX</b>
        <span>Flow</span>
      </div>
      <div className={styles.flowStep}>
        <Workflow />
        <strong>Automatiza</strong>
        <span>Procesa, valida y ejecuta</span>
      </div>
      <div className={styles.flowStep}>
        <Send />
        <strong>Resultado</strong>
        <span>Entrega, notifica y registra</span>
      </div>
    </div>
    <div className={styles.flowChips}>
      <span><Zap /> Flujos conectados</span>
      <span>Datos organizados</span>
      <span>Decisiones más rápidas</span>
    </div>
  </div>
);

const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className={styles.productModalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onMouseDown={onClose}
        >
          <motion.aside
            className={styles.productModal}
            initial={{ opacity: 0, x: 42, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 42, filter: 'blur(8px)' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar información del producto">
              <X />
            </button>
            <span>{product.name}</span>
            <h3 id="product-modal-title">{product.title}</h3>
            <p>{product.what}</p>
            <div className={styles.modalBlocks}>
              <div>
                <strong>Ideal para</strong>
                <p>{product.ideal}</p>
              </div>
              <div>
                <strong>Beneficios</strong>
                <ul>
                  {product.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                </ul>
              </div>
              <div>
                <strong>Tecnologías</strong>
                <div className={styles.modalTags}>
                  {product.tech.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </div>
            <a href="#contacto" className={styles.modalCta} onClick={onClose}>
              Hablar sobre este producto <ArrowRight />
            </a>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AutomationProductsSection = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <section id="automatizar-productos" className={styles.automationProducts}>
      <motion.div
        className={styles.automationHero}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.automationIntro}>
          <span><i /> AUTOMATIZAR TAREAS</span>
          <h2>Automatización simple para trabajar mejor</h2>
          <p>Soluciones inteligentes que eliminan lo repetitivo, conectan herramientas y le dan información clara a tu equipo para tomar mejores decisiones.</p>
          <div className={styles.automationBenefits}>
            {[
              ['Menos tiempo manual', Clock],
              ['Más velocidad y precisión', ChartNoAxesCombined],
              ['Menos errores y reprocesos', ShieldCheck],
              ['Equipos más productivos', Users],
            ].map(([label, BenefitIcon]) => (
              <span key={label}>
                <BenefitIcon />
                {label}
              </span>
            ))}
          </div>
        </div>
        <AutomationFlow />
      </motion.div>

      <div className={styles.productSectionHead}>
        <span>NUESTROS PRODUCTOS</span>
        <h2>Elige la solución que más impacta tu operación</h2>
        <p>Productos diseñados para automatizar, encontrar, responder, reportar y organizar.</p>
      </div>

      <motion.div
        className={styles.productGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={listVariants}
      >
        {automationProducts.map((product) => {
          const ProductIcon = product.Icon;

          return (
            <motion.article
              id={`producto-${product.key}`}
              key={product.key}
              className={styles.productCard}
              variants={itemVariants}
            >
              <div className={styles.productContent}>
                <div className={styles.productTop}>
                  <span>{product.number}</span>
                  <i>{product.name}</i>
                </div>
                <div className={styles.productTitleRow}>
                  <div className={styles.productIcon}><ProductIcon /></div>
                  <h3>{product.title}</h3>
                </div>
                <p>{product.description}</p>
                <ul className={styles.productBenefits}>
                  {product.benefits.map((benefit) => <li key={benefit}><CircleCheck /> {benefit}</li>)}
                </ul>
                <div className={styles.productBottom}>
                  <div className={styles.productResult}>
                    <ChartNoAxesCombined />
                    <strong>{product.result}</strong>
                  </div>
                  <div className={styles.productTags}>
                    {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
                <button type="button" className={styles.productInfoButton} onClick={() => setSelectedProduct(product)}>
                  Más información <ArrowRight />
                </button>
              </div>
              <ProductVisual type={product.visual} />
            </motion.article>
          );
        })}
      </motion.div>

      <div className={styles.automationCta}>
        <span><Rocket /> Cuéntanos tu reto y te mostramos cómo podemos automatizar tu operación.</span>
        <a href="#contacto">Quiero resolver este reto <ArrowRight /></a>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
};

const Services = ({ theme = 'dark' }) => {
  const sectionRef = useRef(null);
  const showcaseRef = useRef(null);
  const itemRefs = useRef({});
  const manualSelectLockRef = useRef(false);
  const manualSelectTimerRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(servicesData[0].key);

  const activeService = useMemo(
    () => servicesData.find((service) => service.key === activeKey) ?? servicesData[0],
    [activeKey]
  );

  const selectService = (serviceKey) => {
    manualSelectLockRef.current = true;
    window.clearTimeout(manualSelectTimerRef.current);
    manualSelectTimerRef.current = window.setTimeout(() => {
      manualSelectLockRef.current = false;
    }, 700);
    setActiveKey(serviceKey);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    window.clearTimeout(manualSelectTimerRef.current);
  }, []);

  useEffect(() => {
    let frame = 0;

    const syncActiveService = () => {
      frame = 0;
      if (manualSelectLockRef.current) return;

      const items = servicesData
        .map((service) => itemRefs.current[service.key])
        .filter(Boolean);

      if (!items.length) return;

      const guideY = window.innerHeight * 0.48;
      let closestKey = items[0].dataset.serviceKey;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distance = Math.abs(centerY - guideY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestKey = item.dataset.serviceKey;
        }
      }

      if (closestKey) {
        setActiveKey((current) => (current === closestKey ? current : closestKey));
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

  const handleShowcaseMove = (event) => {
    const box = showcaseRef.current;
    if (!box) return;

    const rect = box.getBoundingClientRect();
    box.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    box.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  const handleShowcaseLeave = () => {
    const box = showcaseRef.current;
    if (!box) return;

    box.style.setProperty('--mx', '50%');
    box.style.setProperty('--my', '22%');
  };

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className={`${styles.section} ${styles[theme]} ${visible ? styles.visible : ''}`}
    >
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.experience}>
        <motion.div
          className={styles.serviceRail}
          variants={listVariants}
          initial="hidden"
          animate={visible ? 'visible' : 'hidden'}
        >
          <motion.div className={styles.railIntro} variants={itemVariants}>
            <span>NUESTROS SERVICIOS</span>
            <h2>¿Qué necesitas mejorar?</h2>
            <p>Elige el reto principal de tu marca y te mostramos cómo podemos ayudarte sin enredos técnicos.</p>
          </motion.div>

          {servicesData.map((service) => {
            const ServiceIcon = service.Icon;
            const isActive = service.key === activeKey;

            return (
              <motion.button
                key={service.key}
                ref={(node) => {
                  itemRefs.current[service.key] = node;
                }}
                type="button"
                data-service-key={service.key}
                className={`${styles.serviceButton} ${isActive ? styles.activeService : ''}`}
                style={{ '--accent': '#FF3B3B', '--rgb': '255,59,59' }}
                variants={itemVariants}
                onClick={() => selectService(service.key)}
                onFocus={() => selectService(service.key)}
                aria-pressed={isActive}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className={styles.serviceNumber}>{service.number}</span>
                <span className={styles.serviceIcon}>
                  <ServiceIcon />
                </span>
                <span className={styles.serviceCopy}>
                  <strong>{service.menuTitle}</strong>
                  <small>{service.menuDescription}</small>
                </span>
                {isActive && <span className={styles.selectedBadge}>SELECCIONADO</span>}
                <span className={styles.serviceArrow}>
                  <ArrowRight />
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className={styles.showcaseDock}>
          <AnimatePresence mode="wait">
            <motion.aside
              key={activeService.key}
              ref={showcaseRef}
              className={styles.showcase}
              style={{ '--mx': '50%', '--my': '22%' }}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseMove={handleShowcaseMove}
              onMouseLeave={handleShowcaseLeave}
            >
              <div className={styles.showcaseHeader}>
                <span>{activeService.category}</span>
                <h3>{activeService.panelTitle}</h3>
                <p>{activeService.panelDescription}</p>
              </div>

              <ServiceMockup service={activeService} />

              <div className={styles.detailGrid}>
                <motion.div className={styles.resultCard} variants={itemVariants} initial="hidden" animate="visible">
                  <span>RESULTADO</span>
                  <strong>{activeService.resultTitle}</strong>
                  <p>{activeService.resultDescription}</p>
                </motion.div>

                <div className={styles.stepsAndChips}>
                  <div className={styles.steps}>
                    {activeService.steps.map((step, index) => (
                      <motion.div
                        key={step}
                        className={styles.stepItem}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.42, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span>{index + 1}</span>
                        <strong>{step}</strong>
                      </motion.div>
                    ))}
                  </div>

                  <div className={styles.chips}>
                    {activeService.chips.map((chip) => {
                      const ChipIcon = activeService.chipIcon;

                      return (
                        <span key={chip}>
                          <ChipIcon />
                          {chip}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <a className={styles.cta} href="#contacto">
                Quiero resolver este reto
                <ArrowRight />
              </a>
              {activeService.key === 'automatizar' && (
                <a className={styles.moreInfoCta} href="#automatizar-productos">
                  Más información
                  <PanelRightOpen />
                </a>
              )}
            </motion.aside>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className={styles.metricsBar}
        initial={{ opacity: 0, y: 18 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </motion.div>

      <AutomationProductsSection />
    </section>
  );
};

export default Services;
