import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import styles from './Landing.module.css';
import '../../styles/motion.css';
import useInView from './useInView';
import {
  ecosystem, faqs, labPosts, workflow,
} from './landing.data';

/** Props that mark an element for the scroll-reveal system (see styles/motion.css). */
const rv = (type = 'up', i = 0) => ({ 'data-rv': type, style: { '--i': i } });

export const CompanyContext = () => {
  const [ref, inView] = useInView();
  return (
  <section ref={ref} data-in={inView} id="nosotros" className={styles.context}>
    <div className={styles.contextText}>
      <p className={styles.eyebrow} {...rv('up', 0)}>APX / CREATIVE TECHNOLOGY STUDIO</p>
      <h2 className={styles.contextTitle}>
        <span className={styles.line} {...rv('up', 1)}>Somos un estudio de</span>
        <span className={styles.line} {...rv('up', 2)}>tecnología que transforma</span>
        <span className={styles.line} {...rv('up', 3)}>ideas en <span className={styles.muted}>experiencias reales.</span></span>
      </h2>
      <p className={styles.lead} {...rv('up', 4)}>
        Conectamos software, inteligencia artificial, hardware y diseño para crear soluciones que ocurren en el mundo real.
      </p>
      <hr className={styles.rule} {...rv('fade', 5)} />
      <p className={styles.eyebrow} {...rv('up', 6)}>EXPERIENCIAS &nbsp;•&nbsp; SOFTWARE &nbsp;•&nbsp; IA &nbsp;•&nbsp; HARDWARE &nbsp;•&nbsp; DATOS</p>
    </div>
    <div className={styles.contextImage} {...rv('right', 0)} role="img" aria-label="Interfaz de inteligencia artificial analizando un rostro">
      <div className={styles.contextImageInner} />
    </div>
  </section>
  );
};

export const Ecosystem = () => {
  const [ref, inView] = useInView();
  return (
  <section ref={ref} data-in={inView} id="servicios" className={styles.ecosystem} aria-labelledby="ecosystem-title">
    <ul className={styles.ecoGrid}>
      {ecosystem.map(({ n, title, text, img }, i) => (
        <li key={n} {...rv('up', i)}>
          <span className={styles.ecoNum}>{n}</span>
          <img src={img} alt="" loading="lazy" decoding="async" className={styles.ecoThumb} />
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ul>
    <div className={styles.ecoAside}>
      <p className={styles.eyebrow} {...rv('left', 3)}>ECOSISTEMA APX</p>
      <h2 id="ecosystem-title" {...rv('left', 4)}>Todo comienza<br />con una conexión.</h2>
      <p {...rv('left', 5)}>Integramos experiencias, software, inteligencia artificial, hardware y datos para crear soluciones que viven en el espacio real.</p>
      <a href="#proceso" className={styles.btnLight} {...rv('left', 6)}>Conoce nuestro enfoque <ArrowRight size={16} /></a>
    </div>
  </section>
  );
};

export const Workflow = () => {
  const [ref, inView] = useInView();
  return (
  <section ref={ref} data-in={inView} id="proceso" className={styles.workflow} aria-labelledby="workflow-title">
    <div className={styles.workflowHead}>
      <div>
        <p className={styles.eyebrow} {...rv('up', 0)}>DE LA IDEA A LA REALIDAD</p>
        <h2 id="workflow-title" {...rv('up', 1)}>De la idea<br />al espacio real.</h2>
      </div>
      <p className={styles.workflowIntro} {...rv('up', 2)}>Un proceso claro, colaborativo y enfocado en resultados para convertir ideas en experiencias que funcionan.</p>
      <a href="#productos" className={styles.btnOutline} {...rv('up', 3)}>Conoce más <ArrowRight size={14} /></a>
    </div>
    <ol className={styles.steps}>
      {workflow.map(({ title, text, icon }, i) => (
        <li key={title} {...rv('up', i + 3)}>
          <span className={styles.stepIcon}><img src={icon} alt="" loading="lazy" decoding="async" /></span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  </section>
  );
};

export const Lab = () => {
  const [ref, inView] = useInView();
  return (
  <section ref={ref} data-in={inView} id="blog" className={styles.lab} aria-labelledby="lab-title">
    <div className={styles.labIntro}>
      <p className={styles.eyebrow} {...rv('up', 0)}>APX LAB</p>
      <h2 id="lab-title" {...rv('up', 1)}>Experimentos,<br />ideas y<br />aprendizajes.</h2>
      <p {...rv('up', 2)}>Procesos, tecnología y reflexiones detrás<br />de las experiencias que construimos.</p>
      <a href="#blog" className={styles.btnOutline} {...rv('up', 3)}>Ver todos los contenidos <ArrowRight size={20} /></a>
    </div>
    <div className={styles.labCards}>
      {labPosts.map(({ img, title, text, date }, i) => (
        <article key={title} className={styles.labCard} {...rv('scale', i + 2)}>
          <img src={img} alt="" loading="lazy" decoding="async" />
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
            <footer>
              <time>{date}</time>
              <span aria-hidden="true"><ArrowRight size={18} /></span>
            </footer>
          </div>
        </article>
      ))}
    </div>
  </section>
  );
};

export const LandingFaq = () => {
  const [open, setOpen] = useState(-1);
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} data-in={inView} id="preguntas-frecuentes" className={styles.faq} aria-labelledby="faq-title">
      <div className={styles.faqIntro}>
        <p className={styles.eyebrow} {...rv('up', 0)}>PREGUNTAS FRECUENTES</p>
        <h2 id="faq-title" {...rv('up', 1)}>Antes de empezar.</h2>
        <p {...rv('up', 2)}>Resolvemos las dudas más comunes<br />sobre nuestros procesos, tecnologías<br />y formas de trabajo.</p>
      </div>
      <ul className={styles.faqList}>
        {faqs.map(({ q, a }, i) => (
          <li key={q} className={open === i ? styles.faqOpen : ''} {...rv('up', i * 0.6 + 2)}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              {q}
              <Plus size={16} aria-hidden="true" />
            </button>
            <div className={styles.faqAnswer}><p>{a}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const SocialIcon = ({ d }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

export const LandingFooter = () => {
  const [ref, inView] = useInView(0.2);
  return (
  <footer ref={ref} data-in={inView} className={styles.footer}>
    <div className={styles.footBrand}>
      <p className={styles.footLogo} {...rv('up', 0)}><b>APX</b><span>EXPANDING<br />TECHNOLOGY STUDIO</span></p>
      <p className={styles.footSlogan} {...rv('up', 1)}>Experiencias que conectan,<br />tecnología que impulsa.</p>
      <div className={styles.socials} {...rv('up', 2)}>
        <a href="https://www.linkedin.com/in/apxtech" target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /></a>
        <a href="https://www.instagram.com/apxtechlab/" target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" /></a>
        <a href="https://www.youtube.com/@APXTechL" target="_blank" rel="noreferrer" aria-label="YouTube"><SocialIcon d="M22.5 6.4a2.8 2.8 0 0 0-2-2C18.9 4 12 4 12 4s-6.9 0-8.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .4 5.6 2.8 2.8 0 0 0 2 2C5.1 20 12 20 12 20s6.9 0 8.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6zM9.8 15V9l5.7 3z" /></a>
      </div>
    </div>
    <nav className={styles.footLinks} aria-label="Navegación del pie de página" {...rv('fade', 2)}>
      <div>
        <a href="/#inicio">Inicio</a>
        <a href="/#servicios">Servicios</a>
        <a href="/#productos">Proyectos</a>
        <a href="/#nosotros">Nosotros</a>
        <a href="/#blog">Blog</a>
      </div>
      <div>
        <a href="/terminos-y-condiciones">Términos</a>
        <a href="/politica-de-privacidad">Privacidad</a>
        <a href="/politica-de-privacidad">Cookies</a>
      </div>
    </nav>
    <p className={styles.footTag} {...rv('left', 4)}>CREANDO<br />EXPERIENCIAS REALES<br />PARA UN MUNDO MÁS CONECTADO.</p>
  </footer>
  );
};
