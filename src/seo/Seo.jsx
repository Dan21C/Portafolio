export const SITE_URL = 'https://apxtech.com.co';
export const SITE_NAME = 'APX Tech';
const DEFAULT_IMAGE = '/og-image.jpg';

const absolute = (url) => (/^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`);

/**
 * Metadatos por página. React 19 sube <title>, <meta> y <link> al <head>.
 * `jsonLd` acepta un objeto o lista de objetos Schema.org.
 */
export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, type = 'website', noindex = false, jsonLd }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Experiencias interactivas, gamificación e IA`;
  const url = absolute(path);
  const img = absolute(image || DEFAULT_IMAGE);
  const data = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_CO" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />
      {data.map((item, index) => (
        <script key={index} type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', ...item })}</script>
      ))}
    </>
  );
}
