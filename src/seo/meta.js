// Sin dependencias de React: lo usan el componente <Seo> y los scripts de build.
export const SITE_URL = 'https://apxtech.com.co';
export const SITE_NAME = 'APX Tech';
export const DEFAULT_IMAGE = '/og-image.jpg';

export const absoluteUrl = (url) => (/^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`);
export const buildTitle = (title) => (title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Experiencias interactivas, gamificación e IA`);
