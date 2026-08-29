import styles from './BlogTeaser.module.css';

const BlogTeaser = () => (
  <section id="blog" className={styles.section} aria-labelledby="blog-title">
    <div className={styles.card}>
      <span className="section-label">Blog</span>
      <h2 id="blog-title" className="section-title">Muy pronto</h2>
      <p>
        Estamos preparando artículos sobre experiencias, gamificación, datos,
        inteligencia artificial y automatización. Síguenos en nuestras redes
        para enterarte apenas publiquemos el primero.
      </p>
      <a href="#contacto" className="btn-secondary">Hablemos mientras tanto</a>
    </div>
  </section>
);

export default BlogTeaser;
