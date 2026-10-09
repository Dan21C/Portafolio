import LegalLayout from './legal/LegalLayout';

const sections = [
  {
    id: 'quienes-somos',
    title: 'Quiénes somos',
    body: (
      <p>
        APX ("nosotros", "nuestro") es responsable del tratamiento de los datos
        personales que recopilamos a través de este sitio web. Puedes contactarnos
        en <a href="mailto:apxtechlab@gmail.com">apxtechlab@gmail.com</a> o al
        WhatsApp <a href="https://wa.me/573107700619" target="_blank" rel="noreferrer">+57 310 7700619</a>
        {' '}para cualquier duda sobre el tratamiento de tus datos.
      </p>
    ),
  },
  {
    id: 'datos-recopilados',
    title: 'Qué datos recopilamos',
    body: (
      <>
        <p>Cuando usas nuestros formularios de contacto o solicitud de propuesta podemos recopilar:</p>
        <ul>
          <li>Datos de identificación: nombre, apellido, empresa y cargo.</li>
          <li>Datos de contacto: correo electrónico y teléfono.</li>
          <li>Información del proyecto: tipo de servicio, presupuesto, plazos y mensaje.</li>
          <li>Datos técnicos básicos de navegación (páginas visitadas, dispositivo, origen del tráfico).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'finalidad',
    title: 'Para qué usamos tus datos',
    body: (
      <ul>
        <li>Responder tus solicitudes de contacto o propuestas comerciales.</li>
        <li>Dar seguimiento comercial a tu proyecto.</li>
        <li>Mejorar el contenido y funcionamiento del sitio.</li>
        <li>Cumplir obligaciones legales cuando aplique.</li>
      </ul>
    ),
  },
  {
    id: 'terceros',
    title: 'Con quién compartimos tus datos',
    body: (
      <p>
        No vendemos tus datos personales. Podemos compartirlos con proveedores que
        nos ayudan a operar el sitio (por ejemplo, servicios de envío de correo o
        formularios), siempre bajo obligaciones de confidencialidad.
      </p>
    ),
  },
  {
    id: 'derechos',
    title: 'Tus derechos',
    body: (
      <p>
        Puedes solicitar en cualquier momento acceder, actualizar, rectificar o
        eliminar tus datos personales escribiéndonos a{' '}
        <a href="mailto:apxtechlab@gmail.com">apxtechlab@gmail.com</a>.
      </p>
    ),
  },
  {
    id: 'cambios',
    title: 'Cambios a esta política',
    body: (
      <p>
        Podemos actualizar esta política de privacidad periódicamente. Publicaremos
        cualquier cambio en esta misma página con la fecha de actualización correspondiente.
      </p>
    ),
  },
];

const PrivacyPolicyPage = () => (
  <LegalLayout
    title="Política de privacidad"
    lead="Qué datos recopilamos, para qué los usamos y cómo puedes ejercer tus derechos sobre ellos."
    updated="27 de agosto de 2026"
    sections={sections}
  />
);

export default PrivacyPolicyPage;
