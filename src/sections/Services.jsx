import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  BrainCircuit,
  Camera,
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
  Gamepad2,
  Heart,
  LayoutDashboard,
  Link2,
  MapPin,
  MessageSquare,
  MonitorSmartphone,
  MousePointerClick,
  Package,
  PanelRightOpen,
  Paintbrush,
  Play,
  Radio,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
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
    tags: ['Respuestas automáticas', 'Documentos internos', 'Fuentes confiables'],
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
    tags: ['Prospección', 'Datos públicos', 'Mensajes personalizados'],
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
    tags: ['Flujos automáticos', 'Reportes', 'Alertas'],
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
    tags: ['Reportes automáticos', 'Resúmenes', 'Alertas'],
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
    tags: ['Documentos', 'Clasificación automática', 'Validación'],
    Icon: FileCheck2,
    visual: 'documents',
    what: 'Procesa PDFs, formularios y archivos internos para extraer datos, validar campos y ordenar documentos por tipo.',
    ideal: 'Backoffice, administración, compras, legal u operaciones con alto volumen de documentos repetitivos.',
    tech: ['OCR', 'Clasificación IA', 'Validación', 'Extracción estructurada'],
  },
];

const activationVideo = '/Assets/Animation/A_premium_brand_activation_whe.mp4';
const activationImage = (name) => `/Assets/Activation/${name}.jpg`;

const brandActivationProducts = [
  {
    key: 'emotion-lab',
    number: '01',
    name: 'APX Emotion Lab',
    title: 'Conecta desde la emoción.',
    description: 'Detectamos emociones y creamos experiencias personalizadas que generan impacto real.',
    benefits: ['Conexión emocional auténtica', 'Experiencias visuales personalizadas', 'Datos que revelan lo que sienten'],
    result: 'Más conexión emocional y resultados medibles.',
    tags: ['Emociones', 'Personalización', 'Resultados'],
    poster: activationImage('emotion-lab'),
    thumbnail: activationImage('emotion-lab'),
    Icon: Heart,
    what: 'Una experiencia que interpreta señales de participación y las convierte en momentos personalizados para cada usuario.',
    ideal: 'Lanzamientos, stands, activaciones de alto impacto y campañas donde la marca quiere generar recuerdo emocional.',
    tech: ['Cámara', 'IA visual', 'Pantallas', 'Analítica de interacción'],
  },
  {
    key: 'game-arena',
    number: '02',
    name: 'APX Game Arena',
    title: 'Convierte tu marca en un reto.',
    description: 'Creamos juegos físicos y digitales para que las personas participen, compitan y recuerden tu marca.',
    benefits: ['Mayor tiempo de permanencia', 'Ranking y competencia en vivo', 'Participación medible'],
    result: 'Más emoción, más interacción y más recordación.',
    tags: ['Juegos', 'Ranking', 'Gamificación'],
    poster: activationImage('game-arena'),
    thumbnail: activationImage('game-arena'),
    Icon: Gamepad2,
    what: 'Juegos de marca diseñados para atraer personas, sostener su atención y convertir la participación en datos útiles.',
    ideal: 'Ferias, centros comerciales, eventos internos, activaciones retail y campañas que buscan alto engagement.',
    tech: ['Juegos web', 'Sensores', 'Ranking', 'Pantallas'],
  },
  {
    key: 'faceplay',
    number: '03',
    name: 'APX FacePlay',
    title: 'Haz que tu audiencia se transforme.',
    description: 'Creamos filtros, avatares y experiencias con cámara para generar contenido compartible.',
    benefits: ['Contenido para redes', 'Filtros personalizados', 'Experiencias con cámara'],
    result: 'Más alcance orgánico y contenido generado por usuarios.',
    tags: ['Filtros', 'Cámara', 'Contenido'],
    poster: activationImage('faceplay'),
    thumbnail: activationImage('faceplay'),
    Icon: Camera,
    what: 'Una experiencia visual con cámara que transforma a los usuarios en parte de la campaña y facilita compartir contenido.',
    ideal: 'Marcas que quieren conversación en redes, piezas compartibles y participación rápida en espacios de alto tráfico.',
    tech: ['Cámara', 'Filtros', 'Avatares', 'Micrositios'],
  },
  {
    key: 'touch-journey',
    number: '04',
    name: 'APX Touch Journey',
    title: 'Guía a tus usuarios con pantallas interactivas.',
    description: 'Diseñamos recorridos en pantallas, tótems y kioscos para registrar, educar, jugar o vender.',
    benefits: ['Flujos fáciles de usar', 'Captura de registros', 'Interacción guiada'],
    result: 'Más claridad, más datos y mejor experiencia de usuario.',
    tags: ['Tótems', 'Pantallas', 'Registros'],
    poster: activationImage('touch-journey'),
    thumbnail: activationImage('touch-journey'),
    Icon: MonitorSmartphone,
    what: 'Interfaces táctiles para que las personas naveguen, se registren, participen o descubran productos sin fricción.',
    ideal: 'Stands corporativos, salas de venta, puntos de atención, ferias y activaciones con captura de datos.',
    tech: ['Tótems', 'Kioscos', 'UX táctil', 'Formularios'],
  },
  {
    key: 'immersive-room',
    number: '05',
    name: 'APX Immersive Room',
    title: 'Convierte un espacio en una historia.',
    description: 'Creamos experiencias inmersivas con luz, sonido, pantallas, sensores y narrativa de marca.',
    benefits: ['Impacto sensorial', 'Momentos memorables', 'Narrativa de marca'],
    result: 'Una experiencia premium, memorable y medible.',
    tags: ['Inmersivo', 'Sensores', 'Storytelling'],
    poster: activationImage('immersive-room'),
    thumbnail: activationImage('immersive-room'),
    Icon: Sparkles,
    what: 'Una instalación sensorial que combina tecnología, contenido y narrativa para envolver a las personas en la marca.',
    ideal: 'Lanzamientos, experiencias VIP, showrooms, eventos premium y campañas con foco en impacto visual.',
    tech: ['Sensores', 'LED', 'Audio', 'Mapping'],
  },
];

const extraExperiences = [
  {
    key: 'pisos',
    name: 'Pisos interactivos',
    description: 'Movimiento, luz y reacción en cada paso.',
    poster: activationImage('pisos-interactivos'),
  },
  {
    key: 'hologramas',
    name: 'Hologramas & Mapping',
    description: 'Visuales que sorprenden y cuentan historias.',
    poster: activationImage('hologramas-mapping'),
  },
  {
    key: 'pantallas',
    name: 'Pantallas LED',
    description: 'Contenido dinámico para cada momento.',
    poster: activationImage('pantallas-led'),
  },
  {
    key: 'simuladores',
    name: 'Simuladores',
    description: 'Experiencias realistas que retan y entretienen.',
    poster: activationImage('simuladores'),
  },
  {
    key: 'photobooth',
    name: 'Photobooth',
    description: 'Recuerdos tangibles que la gente se lleva.',
    poster: activationImage('photobooth'),
  },
];

const eventImage = (name) => `/Assets/Events/${name}.jpg`;
const eventVideo = (name) => `/videos/events/${name}.mp4`;
const eventShowreelVideo = '/Assets/Animation/Cinematic_premium_corporate_ev.mp4';

const eventProductionProducts = [
  {
    key: 'brand-stand',
    number: '01',
    name: 'APX Brand Stand',
    cardTitle: 'Stands corporativos',
    cardDescription: 'Espacios que comunican tu marca y atraen.',
    detailTitle: 'Stands corporativos que atraen, ordenan y hacen visible tu marca.',
    detailDescription: 'Diseñamos y producimos espacios de marca pensados para que las personas se acerquen, entiendan tu propuesta y vivan una experiencia clara desde el primer contacto.',
    includes: [
      'Diseño del concepto visual del stand',
      'Distribución del espacio y recorrido del usuario',
      'Producción de mobiliario, gráfica y acabados',
      'Integración de pantallas, tótems o dinámicas interactivas',
      'Montaje, operación y desmontaje',
      'Registro de visitantes o captura de leads si aplica',
    ],
    idealFor: 'Ferias, congresos, eventos corporativos, activaciones comerciales, puntos de experiencia, lanzamientos y espacios de atención de marca.',
    result: 'Un espacio que no solo se ve bien: atrae personas, facilita conversaciones y deja oportunidades comerciales.',
    cta: 'Hablemos',
    tags: ['Stands', 'Diseño de espacios', 'BTL', 'Pantallas', 'Leads'],
    image: eventImage('brand-stand'),
    video: eventVideo('brand-stand'),
    Icon: Package,
  },
  {
    key: 'launch-experience',
    number: '02',
    name: 'APX Launch Experience',
    cardTitle: 'Lanzamientos de producto',
    cardDescription: 'Revelamos lo nuevo con impacto y emoción.',
    detailTitle: 'Lanzamientos que convierten un producto en una experiencia.',
    detailDescription: 'Creamos eventos de lanzamiento con narrativa, puesta en escena, contenido visual e interacción para que tu producto se presente de una forma memorable.',
    includes: [
      'Concepto creativo del lanzamiento',
      'Historia y narrativa del producto',
      'Escenario, visuales y momento reveal',
      'Apoyo audiovisual y contenido para pantallas',
      'Experiencias interactivas para invitados',
      'Registro de asistentes y medición de participación',
      'Contenido post-evento para redes o reportes',
    ],
    idealFor: 'Nuevos productos, campañas de marca, tecnología, consumo masivo, retail, moda, alimentos, automotriz y experiencias premium.',
    result: 'Tu producto no solo se muestra: se entiende, se vive y se recuerda.',
    cta: 'Hablemos',
    tags: ['Lanzamiento', 'Storytelling', 'Escenografía', 'Show moment', 'Contenido'],
    image: eventImage('launch-experience'),
    video: eventVideo('launch-experience'),
    Icon: Rocket,
  },
  {
    key: 'conference-flow',
    number: '03',
    name: 'APX Conference Flow',
    cardTitle: 'Conferencias',
    cardDescription: 'Contenido que informa, inspira y posiciona.',
    detailTitle: 'Conferencias fluidas, claras y profesionales.',
    detailDescription: 'Diseñamos y operamos encuentros corporativos para que asistentes, speakers y marcas vivan una experiencia organizada, elegante y fácil de seguir.',
    includes: [
      'Diseño del flujo del evento',
      'Agenda y momentos principales',
      'Escenario, pantallas y apoyo audiovisual',
      'Registro de asistentes',
      'Señalética y piezas visuales',
      'Dinámicas de participación',
      'Soporte técnico y operación en vivo',
    ],
    idealFor: 'Conferencias, convenciones, seminarios, eventos empresariales, capacitaciones, encuentros de comunidad y eventos académicos.',
    result: 'Un evento claro, ordenado y profesional que transmite confianza desde la entrada hasta el cierre.',
    cta: 'Hablemos',
    tags: ['Conferencias', 'Agenda', 'Registro', 'Audiovisual', 'Operación en vivo'],
    image: eventImage('conference-flow'),
    video: eventVideo('conference-flow'),
    Icon: Users,
  },
  {
    key: 'event-operations',
    number: '04',
    name: 'APX Event Operations',
    cardTitle: 'Operación y montaje',
    cardDescription: 'Equipo experto para que todo fluya perfecto.',
    detailTitle: 'Producción sin improvisaciones.',
    detailDescription: 'Coordinamos los detalles técnicos, humanos y operativos para que el evento funcione bien antes, durante y después.',
    includes: [
      'Cronograma de producción',
      'Coordinación de proveedores',
      'Revisión técnica del montaje',
      'Personal operativo',
      'Pruebas previas',
      'Supervisión durante el evento',
      'Cierre, desmontaje y control final',
    ],
    idealFor: 'Eventos con varias áreas, stands, pantallas, experiencias interactivas, proveedores externos, activaciones simultáneas o giras.',
    result: 'Menos estrés, más control y una ejecución ordenada que permite que tu equipo se enfoque en la marca y los invitados.',
    cta: 'Hablemos',
    tags: ['Producción', 'Montaje', 'Proveedores', 'Operación', 'Backstage'],
    image: eventImage('event-operations'),
    video: eventVideo('event-operations'),
    Icon: Radio,
  },
  {
    key: 'event-data',
    number: '05',
    name: 'APX Event Data',
    cardTitle: 'Registro y resultados',
    cardDescription: 'Capturamos datos útiles antes, durante y después.',
    detailTitle: 'Eventos que dejan datos, no solo recuerdos.',
    detailDescription: 'Integramos registro, formularios, QR, encuestas, dinámicas y reportes para que después del evento puedas saber qué pasó y qué oportunidades quedaron.',
    includes: [
      'Registro de asistentes',
      'Formularios digitales',
      'QR de acceso o participación',
      'Captura de leads',
      'Encuestas interactivas',
      'Métricas de participación',
      'Dashboard o reporte post-evento',
    ],
    idealFor: 'Eventos comerciales, lanzamientos, ferias, activaciones, conferencias, campañas con leads y marcas que necesitan medir resultados.',
    result: 'Tu evento termina con información útil para tomar decisiones, hacer seguimiento y mejorar la próxima experiencia.',
    cta: 'Hablemos',
    tags: ['Registro', 'Leads', 'Encuestas', 'Dashboards', 'Reportes'],
    image: eventImage('event-data'),
    video: eventVideo('event-data'),
    Icon: BarChart3,
  },
];

const eventProcessSteps = [
  ['01', 'Concepto', 'Entendemos tu objetivo y audiencia.', Users],
  ['02', 'Diseño', 'Diseñamos la experiencia y el plan del evento.', Paintbrush],
  ['03', 'Producción', 'Coordinamos todo.', Gauge],
  ['04', 'Operación', 'Ejecutamos cada detalle en vivo.', Play],
  ['05', 'Medición', 'Entregamos resultados y aprendizajes.', BarChart3],
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
            <a href="/#contacto" className={styles.modalCta} onClick={onClose}>
              Hablemos <ArrowRight />
            </a>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ActivationMedia = ({ item, label, compact = false }) => {
  const [failedVideo, setFailedVideo] = useState(false);
  const [failedImage, setFailedImage] = useState(false);
  const visualClass = item?.key ? (styles[`activationMedia_${item.key}`] ?? '') : '';
  const imageSource = item?.poster || item?.thumbnail;

  return (
    <div className={`${styles.activationMedia} ${visualClass} ${compact ? styles.activationMediaCompact : ''}`}>
      {!failedVideo && item?.video ? (
        <video
          key={item.video}
          src={item.video}
          poster={imageSource}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailedVideo(true)}
        />
      ) : !failedImage && imageSource ? (
        <img
          src={imageSource}
          alt=""
          loading="lazy"
          onError={() => setFailedImage(true)}
        />
      ) : (
        <div className={styles.activationMediaPlaceholder}>
          <div className={styles.activationPosterScene} aria-hidden="true">
            <span className={styles.posterScreen} />
            <span className={styles.posterPerson} />
            <span className={styles.posterCrowd} />
            <span className={styles.posterHudOne} />
            <span className={styles.posterHudTwo} />
          </div>
          <Video />
          <span>{label}</span>
        </div>
      )}
      {item?.video && (
        <span className={styles.activationPlay}>
          <Play />
        </span>
      )}
    </div>
  );
};

export const BrandActivationCatalogSection = () => {
  const [activeKey, setActiveKey] = useState(brandActivationProducts[0].key);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const activeProduct = brandActivationProducts.find((product) => product.key === activeKey) ?? brandActivationProducts[0];

  return (
    <section id="activar-marca" className={styles.brandActivationCatalog}>
      <motion.div
        className={styles.activationHero}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.activationHeroCopy}>
          <span><i /> ACTIVAR MI MARCA</span>
          <h2>Experiencias que la gente vive, recuerda y comparte.</h2>
          <p>Creamos activaciones que conectan con las personas a través de tecnología, pantallas, juegos e inteligencia artificial.</p>
          <a href="/#contacto" className={styles.activationPrimaryCta}>
            Hablemos <ArrowRight />
          </a>
        </div>

        <div className={styles.activationHeroVideo}>
          <ActivationMedia
            item={{ key: 'showreel', video: activationVideo, poster: activationImage('showreel') }}
            label="Video de experiencia"
          />
        </div>

        <div className={styles.activationBenefits}>
          {[
            ['Más participación', 'Interacciones que involucran y animan a participar.', Users],
            ['Más recordación', 'Experiencias que se sienten y se recuerdan.', Heart],
            ['Datos útiles', 'Información real para tomar mejores decisiones.', BarChart3],
          ].map(([title, text, BenefitIcon]) => (
            <div key={title}>
              <span><BenefitIcon /></span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className={styles.activationProductsLayout}>
        <motion.div
          className={styles.activationProductList}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={listVariants}
        >
          {brandActivationProducts.map((product) => {
            const ProductIcon = product.Icon;
            const isActive = product.key === activeKey;

            return (
              <motion.button
                key={product.key}
                type="button"
                className={`${styles.activationProductButton} ${isActive ? styles.activationProductActive : ''}`}
                variants={itemVariants}
                onClick={() => setActiveKey(product.key)}
                aria-pressed={isActive}
              >
                <span>{product.number}</span>
                <i aria-hidden="true">
                  <img src={product.thumbnail} alt="" loading="lazy" />
                  <ProductIcon />
                </i>
                <span className={styles.activationProductText}>
                  <strong>{product.name}</strong>
                  <small>{product.description}</small>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className={styles.activationProductDetail}>
          <svg className={styles.activationOrganicLine} viewBox="0 0 520 160" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              d="M4 80 C112 18 164 142 260 80 S410 22 516 82"
              initial={{ pathLength: 0, opacity: 0.2 }}
              whileInView={{ pathLength: 1, opacity: 0.75 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
            />
          </svg>

          <AnimatePresence mode="wait">
            <motion.article
              key={activeProduct.key}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.activationDetailCopy}>
                <span>{activeProduct.number} · {activeProduct.name}</span>
                <h3>{activeProduct.title}</h3>
                <p>{activeProduct.description}</p>
                <ul>
                  {activeProduct.benefits.map((benefit) => (
                    <li key={benefit}><CircleCheck /> {benefit}</li>
                  ))}
                </ul>
                <div className={styles.activationTags}>
                  {activeProduct.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>

              <ActivationMedia item={activeProduct} label={activeProduct.name} compact />

              <div className={styles.activationResult}>
                <Users />
                <strong>{activeProduct.result}</strong>
              </div>

              <div className={styles.activationActions}>
                <button type="button" onClick={() => setSelectedProduct(activeProduct)}>
                  Ver más detalles
                </button>
                <a href="/#contacto">
                  Hablemos <ArrowRight />
                </a>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      <div className={styles.activationExtraBlock}>
        <div className={styles.activationExtraHead}>
          <span>Más experiencias que conectan</span>
        </div>
        <div className={styles.activationExtraCarousel}>
          {extraExperiences.map((experience) => (
            <article key={experience.name}>
              <ActivationMedia item={experience} label={experience.name} compact />
              <strong>{experience.name}</strong>
              <p>{experience.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.activationFinalCta}>
        <span><MessageSquare /></span>
        <div>
          <h3>Hablemos de tu próxima activación</h3>
          <p>Cuéntanos tu idea y diseñemos una experiencia a la medida de tu marca.</p>
        </div>
        <a href="/#contacto">
          Hablemos <ArrowRight />
        </a>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
};

const EventMedia = ({ item, label, showVideoSlot = true }) => {
  const [failedVideo, setFailedVideo] = useState(false);
  const hasVideo = item?.video && !failedVideo;

  return (
    <div className={styles.eventMedia}>
      {hasVideo ? (
        <video
          key={item.video}
          src={item.video}
          poster={item.image}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setFailedVideo(true)}
        />
      ) : (
        <img src={item?.image} alt="" loading="lazy" />
      )}
      <span className={styles.eventMediaShade} />
      {showVideoSlot && (
        <span className={styles.eventPlaySlot} aria-hidden="true">
          <Play />
        </span>
      )}
      {showVideoSlot && <small>{label}</small>}
    </div>
  );
};

const EventProductDetailPanel = ({ product, products, onClose, onSelect }) => {
  const currentIndex = products.findIndex((item) => item.key === product.key);
  const previous = products[(currentIndex - 1 + products.length) % products.length];
  const next = products[(currentIndex + 1) % products.length];

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={product.key}
        id="event-product-detail"
        className={styles.eventProductDetail}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <button type="button" className={styles.eventDetailClose} onClick={onClose} aria-label="Cerrar detalle del evento">
          <X />
        </button>

        <div className={styles.eventDetailMedia}>
          <motion.img
            key={product.image}
            src={product.image}
            alt=""
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className={styles.eventThumbs}>
            {products.map((item) => (
              <button
                key={item.key}
                type="button"
                className={item.key === product.key ? styles.eventThumbActive : ''}
                onClick={() => onSelect(item)}
                aria-label={`Ver ${item.cardTitle}`}
              >
                <img src={item.image} alt="" loading="lazy" />
                {item.key === product.key && <span>{item.number}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.eventDetailContent}>
          <span>{product.number} / {String(products.length).padStart(2, '0')}</span>
          <h3>{product.detailTitle}</h3>
          <p>{product.detailDescription}</p>

          <div className={styles.eventDetailColumns}>
            <div>
              <strong><CalendarDays /> ¿Qué incluye?</strong>
              <ul>
                {product.includes.map((item) => (
                  <li key={item}><CircleCheck /> {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong><Users /> Ideal para</strong>
              <p>{product.idealFor}</p>
              <strong><BarChart3 /> Resultado</strong>
              <p>{product.result}</p>
            </div>
          </div>

          <div className={styles.eventDetailTags}>
            {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className={styles.eventDetailActions}>
            <a href="/#contacto" className={styles.eventPrimaryCta}>
              {product.cta} <ArrowRight />
            </a>
          </div>

          <div className={styles.eventDetailNav}>
            <button type="button" onClick={() => onSelect(previous)}>
              Anterior
            </button>
            <button type="button" onClick={() => onSelect(next)}>
              Siguiente <ArrowRight />
            </button>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
};

export const EventProductionSection = () => {
  const [selectedProduct, setSelectedProduct] = useState(eventProductionProducts[0]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    window.requestAnimationFrame(() => {
      document.getElementById('event-product-detail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  return (
    <section id="producir-evento" className={styles.eventProductionSection}>
      <motion.div
        className={styles.eventProductionHero}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.eventHeroCopy}>
          <span><i /> SERVICIO 03</span>
          <h2>Producir un <em>evento</em></h2>
          <p>Planeamos, diseñamos y ejecutamos eventos 360° que se ven bien, funcionan perfecto y dejan resultados.</p>
          <a href="/#contacto" className={styles.eventPrimaryCta}>
            Hablemos <ArrowRight />
          </a>
          <div className={styles.eventProductionBenefits}>
            {[
              ['Experiencias memorables', 'Creamos momentos que conectan.', Users],
              ['Ejecución impecable', 'Cada detalle bajo control.', CalendarDays],
              ['Resultados que importan', 'Datos y aprendizajes que generan valor.', BarChart3],
            ].map(([title, text, BenefitIcon]) => (
              <div key={title}>
                <BenefitIcon />
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.eventHeroMedia}>
          <EventMedia
            item={{ image: eventImage('event-hero'), video: eventShowreelVideo }}
            label="Ver showreel de producción"
          />
        </div>
      </motion.div>

      <motion.div
        className={styles.eventProductionGrid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={listVariants}
      >
        {eventProductionProducts.map((product) => {
          const ProductIcon = product.Icon;
          const isActive = selectedProduct?.key === product.key;

          return (
            <motion.button
              key={product.key}
              type="button"
              className={`${styles.eventProductCard} ${isActive ? styles.eventProductCardActive : ''}`}
              variants={itemVariants}
              onClick={() => openProduct(product)}
              aria-expanded={isActive}
              aria-controls="event-product-detail"
            >
              <img src={product.image} alt="" loading="lazy" />
              <span>{product.number}</span>
              <ProductIcon />
              <strong>{product.cardTitle}</strong>
              <p>{product.cardDescription}</p>
              <small>Más información <ArrowRight /></small>
            </motion.button>
          );
        })}
      </motion.div>

      {selectedProduct && (
        <EventProductDetailPanel
          product={selectedProduct}
          products={eventProductionProducts}
          onClose={() => setSelectedProduct(null)}
          onSelect={openProduct}
        />
      )}

      <motion.div
        className={styles.eventProcessStrip}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={listVariants}
      >
        <div>
          <h3>Así trabajamos en cada evento</h3>
          <p>Un proceso claro, humano y organizado para que todo funcione perfecto.</p>
        </div>
        <div className={styles.eventProcessSteps}>
          {eventProcessSteps.map(([number, title, text, StepIcon]) => (
            <motion.article key={title} variants={itemVariants}>
              <span><StepIcon /></span>
              <small>{number}</small>
              <strong>{title}</strong>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export const AutomationProductsSection = () => {
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
        <a href="/#contacto">Hablemos <ArrowRight /></a>
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

      const guideY = window.innerHeight * 0.58;
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
                Hablemos
                <ArrowRight />
              </a>
              {activeService.key === 'automatizar' && (
                <a className={styles.moreInfoCta} href="/servicios/automatizar">
                  Más información
                  <PanelRightOpen />
                </a>
                )}
                {activeService.key === 'activar' && (
                  <a className={styles.moreInfoCta} href="/servicios/activar-marca">
                    Más información
                    <PanelRightOpen />
                  </a>
                )}
                {activeService.key === 'producir' && (
                  <a className={styles.moreInfoCta} href="/servicios/producir-evento">
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

    </section>
  );
};

export default Services;
