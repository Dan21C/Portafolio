import styles from './LegalPage.module.css';

const TermsPage = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <span className="section-label">Legal</span>
      <h1 className="section-title">Términos y condiciones</h1>
      <p className={styles.updated}>Última actualización: 27 de agosto de 2026</p>

      <h2>1. Aceptación de los términos</h2>
      <p>
        Al navegar y utilizar este sitio web aceptas los presentes términos y
        condiciones. Si no estás de acuerdo con ellos, te pedimos no continuar
        usando el sitio.
      </p>

      <h2>2. Sobre APX</h2>
      <p>
        APX ofrece servicios de experiencias, gamificación, análisis de datos,
        inteligencia artificial, desarrollo de software y automatización. La
        información publicada en este sitio tiene fines informativos y comerciales.
      </p>

      <h2>3. Uso del sitio</h2>
      <ul>
        <li>El contenido de este sitio no debe reproducirse ni distribuirse sin autorización previa.</li>
        <li>No está permitido usar el sitio para fines ilícitos o que afecten su funcionamiento.</li>
        <li>Nos reservamos el derecho de actualizar o modificar el contenido del sitio en cualquier momento.</li>
      </ul>

      <h2>4. Propuestas y cotizaciones</h2>
      <p>
        La información enviada a través de nuestros formularios de contacto o
        solicitud de propuesta se usa exclusivamente para evaluar y responder tu
        solicitud comercial. El envío de un formulario no genera ningún compromiso
        contractual hasta la firma de una propuesta o contrato formal entre las partes.
      </p>

      <h2>5. Propiedad intelectual</h2>
      <p>
        Las marcas, logotipos, textos e imágenes de este sitio son propiedad de APX
        o de sus respectivos titulares y están protegidos por las leyes de propiedad
        intelectual aplicables.
      </p>

      <h2>6. Limitación de responsabilidad</h2>
      <p>
        APX no garantiza que el sitio esté libre de errores o interrupciones y no se
        hace responsable por daños derivados del uso o la imposibilidad de uso del sitio.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Para preguntas sobre estos términos, escríbenos a{' '}
        <a href="mailto:apxtechlab@gmail.com">apxtechlab@gmail.com</a>.
      </p>
    </div>
  </section>
);

export default TermsPage;
