import styles from './Stack.module.css';

const stacks = [
  { title: 'IA & LLMs', items: ['OpenAI / Claude API', 'Computer Vision', 'MediaPipe', 'Langchain / RAG'] },
  { title: 'Data & Analytics', items: ['Power BI / Dashboards', 'SQL Server / Postgres', 'Firebase Realtime', 'Python / Pandas'] },
  { title: 'Desarrollo', items: ['React + Vite', 'Three.js / WebGL', 'C# .NET / APIs', 'ESP32 / IoT'] },
  { title: 'Integraciones', items: ['WebSocket / Realtime', 'Supabase / PostGIS', 'PLC Siemens S7', 'PWA / Kiosk mode'] },
];

const clients = ['Logoipsum', 'Ipsum Co.', 'Logoipsum™', 'Ipsum Group', 'Logo Ipsum'];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const Stack = () => (
  <>
    {/* STACK */}
    <section className={styles.section}>
      <div className="section-label">Tecnología</div>
      <h2 className="section-title">Stack que respalda<br />cada solución.</h2>
      <p className="section-sub">Autoridad técnica real, no hype. Herramientas probadas en producción.</p>
      <div className={styles.grid}>
        {stacks.map(({ title, items }) => (
          <div key={title} className={styles.col}>
            <h4 className={styles.colTitle}>{title}</h4>
            {items.map(item => (
              <div key={item} className={styles.item}>
                <span className={styles.dot} />
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* CLIENTS */}
    <section className={styles.clientsSection}>
      <div className="section-label">Confianza</div>
      <div className={styles.logos}>
        {clients.map(c => <span key={c} className={styles.logo}>{c}</span>)}
      </div>
    </section>

    {/* CTA */}
    <section id="contacto" className={styles.ctaSection}>
      <div className={styles.ctaInner}>
        <div>
          <h2 className={styles.ctaTitle}>
            ¿Listo para crear<br /><span className="accent">lo extraordinario?</span>
          </h2>
          <p className={styles.ctaSub}>
            Cuéntanos tu reto y diseñamos una solución a medida.<br />
            Sin intermediarios. Con resultados reales.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <a href="https://wa.me/573000000000" target="_blank" rel="noreferrer" className="btn-primary">
            Agendar llamada <Arrow />
          </a>
          <a href="mailto:hola@apx.com" className="btn-secondary">Enviar email</a>
        </div>
      </div>
    </section>
  </>
);

export default Stack;
