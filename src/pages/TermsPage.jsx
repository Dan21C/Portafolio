import LegalLayout from './legal/LegalLayout';

const sections = [
  {
    id: 'aceptacion',
    title: 'Aceptación de los términos',
    body: (
      <p>
        Al navegar y utilizar este sitio web aceptas los presentes términos y
        condiciones. Si no estás de acuerdo con ellos, te pedimos no continuar
        usando el sitio.
      </p>
    ),
  },
  {
    id: 'sobre-apx',
    title: 'Sobre APX',
    body: (
      <p>
        APX ofrece servicios de experiencias, gamificación, análisis de datos,
        inteligencia artificial, desarrollo de software y automatización. La
        información publicada en este sitio tiene fines informativos y comerciales.
      </p>
    ),
  },
  {
    id: 'uso-del-sitio',
    title: 'Uso del sitio',
    body: (
      <ul>
        <li>El contenido de este sitio no debe reproducirse ni distribuirse sin autorización previa.</li>
        <li>No está permitido usar el sitio para fines ilícitos o que afecten su funcionamiento.</li>
        <li>Nos reservamos el derecho de actualizar o modificar el contenido del sitio en cualquier momento.</li>
      </ul>
    ),
  },
  {
    id: 'propuestas',
    title: 'Propuestas y cotizaciones',
    body: (
      <p>
        La información enviada a través de nuestros formularios de contacto o
        solicitud de propuesta se usa exclusivamente para evaluar y responder tu
        solicitud comercial. El envío de un formulario no genera ningún compromiso
        contractual hasta la firma de una propuesta o contrato formal entre las partes.
      </p>
    ),
  },
  {
    id: 'propiedad-intelectual',
    title: 'Propiedad intelectual',
    body: (
      <p>
        Las marcas, logotipos, textos e imágenes de este sitio son propiedad de APX
        o de sus respectivos titulares y están protegidos por las leyes de propiedad
        intelectual aplicables.
      </p>
    ),
  },
  {
    id: 'responsabilidad',
    title: 'Limitación de responsabilidad',
    body: (
      <p>
        APX no garantiza que el sitio esté libre de errores o interrupciones y no se
        hace responsable por daños derivados del uso o la imposibilidad de uso del sitio.
      </p>
    ),
  },
  {
    id: 'contacto',
    title: 'Contacto',
    body: (
      <p>
        Para preguntas sobre estos términos, escríbenos a{' '}
        <a href="mailto:apxtechlab@gmail.com">apxtechlab@gmail.com</a>.
      </p>
    ),
  },
];

const TermsPage = () => (
  <LegalLayout
    title="Términos y condiciones"
    lead="Las reglas para usar este sitio y solicitar propuestas a APX, explicadas de forma clara."
    updated="27 de agosto de 2026"
    sections={sections}
  />
);

export default TermsPage;
