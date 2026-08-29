import { useState } from 'react';
import styles from './Faq.module.css';

const faqs = [
  {
    q: '¿Qué servicios ofrece APX?',
    a: 'Diseñamos experiencias, gamificación, análisis de datos, inteligencia artificial, desarrollo de software y automatización, adaptados a las necesidades de cada marca o negocio.',
  },
  {
    q: '¿Cuánto tiempo tardan en responder una solicitud?',
    a: 'Respondemos cada solicitud de contacto o propuesta en menos de 24 horas hábiles.',
  },
  {
    q: '¿Trabajan con plantillas o soluciones a la medida?',
    a: 'Cada proyecto es 100% personalizado. No usamos plantillas ni intermediarios: un equipo senior se dedica directamente a tu proyecto.',
  },
  {
    q: '¿Ofrecen soporte después del lanzamiento?',
    a: 'Sí, todos nuestros proyectos incluyen acompañamiento y soporte post-lanzamiento para asegurar que la solución siga funcionando correctamente.',
  },
  {
    q: '¿Con qué países o regiones trabajan?',
    a: 'Trabajamos principalmente con marcas y negocios en Latinoamérica, de forma 100% remota.',
  },
];

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="preguntas-frecuentes" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className="section-label">FAQ</span>
          <h2 id="faq-title" className="section-title">Preguntas frecuentes</h2>
        </div>

        <div className={styles.list}>
          {faqs.map(({ q, a }, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={q} className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  {q}
                  <span className={styles.icon}><PlusIcon /></span>
                </button>
                <div className={styles.answer}>
                  <div className={styles.answerInner}>
                    <p>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
