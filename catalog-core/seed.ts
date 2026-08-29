import type { ServiceCategory, Solution } from './models';

export const CATEGORY_IDS = {
  experiencias: '00000000-0000-4000-8000-000000000001', hardware: '00000000-0000-4000-8000-000000000002',
  automatizacion: '00000000-0000-4000-8000-000000000003', ia: '00000000-0000-4000-8000-000000000004',
  datos: '00000000-0000-4000-8000-000000000005', software: '00000000-0000-4000-8000-000000000006',
} as const;

const categorySeed = [
  [CATEGORY_IDS.experiencias, 'Experiencias interactivas', 'experiencias-interactivas', 'Experiencias que las personas juegan, viven y recuerdan.', '/Assets/About/experiencias-interactivas.png'],
  [CATEGORY_IDS.hardware, 'Hardware tecnológico', 'hardware-tecnologico', 'Tecnología física diseñada para experiencias y espacios.', '/Assets/About/hardware-displays.png'],
  [CATEGORY_IDS.automatizacion, 'Automatización e integraciones', 'automatizacion-integraciones', 'Procesos y herramientas que trabajan conectados.', '/Assets/About/automatizacion-integraciones.png'],
  [CATEGORY_IDS.ia, 'IA aplicada', 'ia-aplicada', 'Inteligencia artificial integrada donde realmente genera valor.', '/Assets/About/ia-aplicada.png'],
  [CATEGORY_IDS.datos, 'Analítica y datos', 'analitica-datos', 'Información convertida en decisiones.', '/Assets/About/analitica-datos.png'],
  [CATEGORY_IDS.software, 'Software a la medida', 'software-medida', 'Plataformas creadas alrededor de tu operación.', '/Assets/About/software-operacion.png'],
] as const;

export const categories: ServiceCategory[] = categorySeed.map((c, i) => ({
  id: c[0], name: c[1], slug: c[2], shortDescription: c[3], description: c[3], image: c[4], order: i + 1, isActive: true,
}));

const items: Record<string, Array<[string, string, string?]>> = {
  experiencias: [
    ['APX Reflex Matrix', 'Arena interactiva de velocidad y reflejos.', '/Assets/Products/apx-reflex-matrix.png'],
    ['APX Vector Maze', 'Desafío phygital de precisión y control.', '/Assets/Products/apx-vector-maze.png'],
    ['APX Touch Duel', 'Mesa multitáctil para retos cara a cara.', '/Assets/Products/apx-touch-duel.png'],
    ['APX Imagine AI', 'Experiencias generativas que convierten ideas en contenido.', '/Assets/Products/apx-imagine-ai.png'],
    ['APX Balance Vision', 'Experiencia interactiva controlada mediante visión artificial.'],
    ['Experiencia personalizada', 'Mecánicas diseñadas alrededor de una marca o campaña.'],
  ],
  hardware: [
    ['APX HoloFrame', 'Contenido holográfico controlado mediante gestos.', '/Assets/Products/apx-holoframe.png'],
    ['APX Levitate', 'Exhibición magnética para productos protagonistas.', '/Assets/Products/apx-levitate.png'],
    ['Tótems interactivos', 'Displays y puntos digitales de interacción.'], ['Pantallas y displays', 'Soluciones visuales para activaciones y espacios.'],
    ['RFID / NFC', 'Identificación, puntuación y trazabilidad para experiencias.'], ['Sensores e IoT', 'Hardware conectado para medir e interactuar con espacios físicos.'],
  ],
  automatizacion: [['Flujos automáticos','Eliminamos tareas repetitivas mediante automatizaciones.'],['Conectores API','Integramos plataformas y sistemas existentes.'],['Plugins personalizados','Extensiones desarrolladas alrededor de procesos específicos.'],['Reportes automáticos','Información preparada y enviada sin intervención manual.'],['Sincronización de plataformas','Información consistente entre diferentes sistemas.'],['Automatización de operaciones','Flujos internos diseñados para reducir trabajo manual.']],
  ia: [['Asistentes virtuales','Sistemas conversacionales para responder y acompañar usuarios.'],['Visión artificial','Detección y análisis de elementos del mundo físico.'],['IA en plataformas','Capacidades inteligentes integradas dentro de software existente.'],['IA generativa','Creación de imágenes, contenido y experiencias personalizadas.'],['Clasificación inteligente','Organización y análisis automático de información.'],['Experiencias con IA','Soluciones interactivas impulsadas mediante modelos generativos.']],
  datos: [['Medición en eventos físicos','Métricas de tráfico, participación y comportamiento.'],['Dashboards','Información centralizada para entender resultados.','/Assets/Products/apx-data-intelligence.png'],['Insights','Interpretación de datos para encontrar oportunidades.'],['Registro y captura de datos','Formularios, QR y procesos de adquisición de información.'],['Analítica de comportamiento','Lectura de patrones de interacción.'],['Reportes ejecutivos','Información preparada para tomar decisiones.']],
  software: [['Diseño y desarrollo web','Experiencias digitales modernas y responsivas.','/Assets/Products/apx-software-studio.png'],['Plataformas para eventos','Registro, asistentes, actividades y operación.'],['Software a la medida','Herramientas construidas alrededor del proceso del cliente.'],['Plataformas empresariales','Sistemas internos para operación y administración.'],['Aplicaciones web','Productos digitales accesibles desde cualquier dispositivo.'],['Sistemas operativos internos','Software para digitalizar procesos empresariales.']],
};

export const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const solutionUuid = (categoryIndex: number, itemIndex: number) => `10000000-0000-4000-8${String(categoryIndex + 1).padStart(3, '0')}-${String(itemIndex + 1).padStart(12, '0')}`;
const nestedUuid = (prefix: number, categoryIndex: number, itemIndex: number, nestedIndex = 0) => `${prefix}0000000-0000-4000-8${String(categoryIndex + 1).padStart(3, '0')}-${String((itemIndex + 1) * 100 + nestedIndex).padStart(12, '0')}`;

export const solutions: Solution[] = Object.entries(items).flatMap(([categoryKey, list], categoryIndex) => list.map(([name, shortDescription, image], index) => ({
  id: solutionUuid(categoryIndex, index), categoryId: CATEGORY_IDS[categoryKey as keyof typeof CATEGORY_IDS], name, slug: slugify(name), eyebrow: 'Solución APX', shortDescription,
  description: `${shortDescription} Diseñamos su implementación alrededor del contexto, la audiencia y los objetivos de cada proyecto.`,
  gallery: image ? [{ id: nestedUuid(2, categoryIndex, index), url: image, alt: name, type: 'image', order: 1, isCover: true }] : [],
  features: ['Diseño a la medida', 'Implementación APX', 'Medición de resultados'].map((title, i) => ({ id: nestedUuid(3, categoryIndex, index, i), title })),
  useCases: ['Eventos', 'Activaciones', 'Espacios de marca'], tags: [categories.find(c => c.id === CATEGORY_IDS[categoryKey as keyof typeof CATEGORY_IDS])?.name || 'APX'],
  modalities: ['Renta', 'Personalización'], implementationTime: 'Según alcance', priceMode: 'quote', currency: 'COP', featured: index === 0,
  status: 'published', publishedAt: '2026-08-01T00:00:00.000Z', order: index + 1, seo: { title: `${name} | APX`, description: shortDescription, keywords: [name, 'APX'] },
})));
