import styles from './AIAutomationPage.module.css';

const projects = [
  {
    tag: 'RAG Legal',
    title: 'IA de jurisprudencia',
    desc: 'Motor de busqueda semantica para consultar sentencias, normas y conceptos juridicos con respuestas trazables y fuentes citadas.',
    stack: ['LLMs', 'RAG', 'Vector DB', 'OCR'],
    result: 'Respuestas con evidencia documental',
  },
  {
    tag: 'Bots & Seguridad',
    title: 'Clasificador de bots',
    desc: 'Modelo para clasificar conversaciones, detectar automatismos, priorizar casos y separar interacciones reales de trafico sospechoso.',
    stack: ['NLP', 'Clasificacion', 'Scoring', 'Dashboards'],
    result: 'Priorizacion automatica de casos',
  },
  {
    tag: 'Lead Intelligence',
    title: 'Mapa comercial Ricaurte',
    desc: 'Sistema para localizar tiendas de ropa en zonas especificas como Bogota, Ricaurte, estructurar datos publicos de negocios y enriquecerlos para prospeccion B2B responsable.',
    stack: ['Maps data', 'IA de extraccion', 'Validacion', 'CRM'],
    result: 'Base segmentada para outreach con opt-out',
  },
  {
    tag: 'Agentes IA',
    title: 'Asistente comercial multicanal',
    desc: 'Agente que responde preguntas frecuentes, califica leads, agenda reuniones y sincroniza la informacion con CRM o sheets internas.',
    stack: ['LLM', 'WhatsApp', 'CRM', 'Email'],
    result: 'Menos friccion en preventa',
  },
  {
    tag: 'RPA',
    title: 'Backoffice automatizado',
    desc: 'Flujos que leen formularios, validan datos, generan reportes y notifican a equipos internos sin repetir tareas manuales.',
    stack: ['RPA', 'APIs', 'Rules engine', 'Reportes'],
    result: 'Operaciones mas rapidas',
  },
  {
    tag: 'Data AI',
    title: 'Monitoreo de oportunidades',
    desc: 'Panel que centraliza prospectos, conversaciones, estado de contacto y senales comerciales para priorizar acciones.',
    stack: ['Analytics', 'Scoring IA', 'Pipelines', 'Alertas'],
    result: 'Decision comercial en tiempo real',
  },
];

const capabilities = [
  'LLMs entrenados con contexto de negocio',
  'RAG con documentos, politicas y fuentes internas',
  'Bots para soporte, ventas y operaciones',
  'RPA para tareas repetitivas y backoffice',
  'Integraciones con CRM, Sheets, APIs y email',
  'Prospeccion B2B con datos permitidos y opt-out',
];

const steps = [
  { n: '01', title: 'Diagnostico', desc: 'Identificamos procesos, datos disponibles, riesgos y oportunidades de automatizacion.' },
  { n: '02', title: 'Prototipo', desc: 'Construimos una version funcional con datos reales para validar valor rapidamente.' },
  { n: '03', title: 'Integracion', desc: 'Conectamos el flujo con herramientas internas y canales comerciales.' },
  { n: '04', title: 'Medicion', desc: 'Creamos metricas, trazabilidad, opt-out y mejoras continuas para operar con control.' },
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AIAutomationPage = ({ theme = 'dark', onThemeChange = () => {} }) => (
  <main className={`${styles.page} ${styles[theme]}`}>
    <div className={styles.bgGlow} />
    <div className={styles.bgGrid} />

    <section className={styles.hero}>
      <div className={styles.heroTop}>
        <a href="/#servicios" className={styles.backLink}>Volver a servicios</a>
        <div className={styles.themeToggle} aria-label="Cambiar tema de la pagina">
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
      <div className={styles.eyebrow}>IA + AUTOMATIZACION</div>
      <h1>Automatizacion inteligente para crecer sin friccion.</h1>
      <p>
        Creamos sistemas con LLMs, RAG, bots, agentes IA, RPA e integraciones para
        convertir informacion dispersa en acciones comerciales y operativas medibles.
      </p>
      <div className={styles.heroActions}>
        <a href="#proyectos-ia" className={styles.primaryBtn}>Ver proyectos <Arrow /></a>
        <a href="/#contacto" className={styles.secondaryBtn}>Agendar reunion <Arrow /></a>
      </div>
    </section>

    <section className={styles.command}>
      <div className={styles.console}>
        <div className={styles.consoleTop}>
          <span />
          <span />
          <span />
          <strong>AI automation pipeline</strong>
        </div>
        <div className={styles.pipeline}>
          {['Datos', 'RAG', 'Agente', 'Accion', 'CRM'].map((item, index) => (
            <div key={item} className={styles.pipelineNode} style={{ '--i': index }}>
              {item}
            </div>
          ))}
          <div className={styles.pipelineRunner} />
        </div>
      </div>

      <div className={styles.capabilityPanel}>
        <h2>Que incluye</h2>
        <div className={styles.capabilityList}>
          {capabilities.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </section>

    <section className={styles.process}>
      <div className={styles.sectionHead}>
        <span>METODO</span>
        <h2>De idea a sistema operativo.</h2>
      </div>
      <div className={styles.steps}>
        {steps.map((step) => (
          <div key={step.n} className={styles.stepCard}>
            <span>{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="proyectos-ia" className={styles.projects}>
      <div className={styles.sectionHead}>
        <span>PROYECTOS</span>
        <h2>Casos y productos que podemos construir.</h2>
        <p>
          La prospeccion tipo Mailerfind se plantea aqui como captacion B2B responsable:
          datos publicos o permitidos, validacion, segmentacion, trazabilidad y opcion de salida.
        </p>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <article key={project.title} className={styles.projectCard}>
            <span className={styles.projectTag}>{project.tag}</span>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <div className={styles.stack}>
              {project.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
            <strong>{project.result}</strong>
          </article>
        ))}
      </div>
    </section>

    <section className={styles.ctaBand}>
      <div>
        <span>LISTO PARA EL SIGUIENTE SPRINT</span>
        <h2>Convertimos un proceso manual en un flujo inteligente.</h2>
      </div>
      <a href="/#contacto" className={styles.primaryBtn}>Hablar del proyecto <Arrow /></a>
    </section>
  </main>
);

export default AIAutomationPage;
