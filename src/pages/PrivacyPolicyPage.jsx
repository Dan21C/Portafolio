import styles from './LegalPage.module.css';

const PrivacyPolicyPage = () => (
  <section className={styles.section}>
    <div className={styles.container}>
      <span className="section-label">Legal</span>
      <h1 className="section-title">Política de privacidad</h1>
      <p className={styles.updated}>Última actualización: 27 de agosto de 2026</p>

      <h2>1. Quiénes somos</h2>
      <p>
        APX ("nosotros", "nuestro") es responsable del tratamiento de los datos
        personales que recopilamos a través de este sitio web. Puedes contactarnos
        en <a href="mailto:apxtechlab@gmail.com">apxtechlab@gmail.com</a> o al
        WhatsApp <a href="https://wa.me/573107700619" target="_blank" rel="noreferrer">+57 310 7700619</a>
        {' '}para cualquier duda sobre el tratamiento de tus datos.
      </p>

      <h2>2. Qué datos recopilamos</h2>
      <p>Cuando usas nuestros formularios de contacto o solicitud de propuesta podemos recopilar:</p>
      <ul>
        <li>Datos de identificación: nombre, apellido, empresa y cargo.</li>
        <li>Datos de contacto: correo electrónico y teléfono.</li>
        <li>Información del proyecto: tipo de servicio, presupuesto, plazos y mensaje.</li>
        <li>Datos técnicos básicos de navegación (páginas visitadas, dispositivo, origen del tráfico).</li>
      </ul>

      <h2>3. Para qué usamos tus datos</h2>
      <ul>
        <li>Responder tus solicitudes de contacto o propuestas comerciales.</li>
        <li>Dar seguimiento comercial a tu proyecto.</li>
        <li>Mejorar el contenido y funcionamiento del sitio.</li>
        <li>Cumplir obligaciones legales cuando aplique.</li>
      </ul>

      <h2>4. Con quién compartimos tus datos</h2>
      <p>
        No vendemos tus datos personales. Podemos compartirlos con proveedores que
        nos ayudan a operar el sitio (por ejemplo, servicios de envío de correo o
        formularios), siempre bajo obligaciones de confidencialidad.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Puedes solicitar en cualquier momento acceder, actualizar, rectificar o
        eliminar tus datos personales escribiéndonos a{' '}
        <a href="mailto:apxtechlab@gmail.com">apxtechlab@gmail.com</a>.
      </p>

      <h2>6. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política de privacidad periódicamente. Publicaremos
        cualquier cambio en esta misma página con la fecha de actualización correspondiente.
      </p>
    </div>
  </section>
);

export default PrivacyPolicyPage;
