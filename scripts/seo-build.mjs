// Post-build SEO:
// 1. Escribe dist/<ruta>/index.html con título, descripción, canonical y Open Graph ya en el HTML,
//    para buscadores y para WhatsApp/LinkedIn, que no ejecutan JavaScript.
// 2. Genera dist/sitemap.xml con las rutas fijas y las del catálogo (desde la API).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';
import { SITE_URL, DEFAULT_IMAGE, absoluteUrl, buildTitle } from '../src/seo/meta.js';
import { servicePages, staticPages } from '../src/seo/pages.js';
const mode = process.argv[2] ?? 'production';
const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
const today = new Date().toISOString().slice(0, 10);

const routes = [
  { ...staticPages.home, priority: '1.0', changefreq: 'weekly' },
  { ...staticPages.catalog, priority: '0.9', changefreq: 'weekly' },
  ...Object.values(servicePages).map((page) => ({ ...page, priority: '0.8' })),
  { ...staticPages.privacy, priority: '0.2', changefreq: 'yearly' },
  { ...staticPages.terms, priority: '0.2', changefreq: 'yearly' },
];

async function getJson(path) {
  const response = await fetch(`${env.VITE_API_URL.replace(/\/$/, '')}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`${path} respondió ${response.status}`);
  return response.json();
}

async function catalogRoutes() {
  if (env.VITE_USE_API !== 'true' || !env.VITE_API_URL) return [];
  const found = [];
  const categories = await getJson('/api/v1/catalog/categories');
  for (const category of categories) found.push({ path: `/productos/categoria/${category.slug}`, title: category.name, description: category.shortDescription, image: category.image, priority: '0.7' });
  for (let page = 1, totalPages = 1; page <= totalPages; page += 1) {
    const result = await getJson(`/api/v1/catalog/solutions?page=${page}&pageSize=100`);
    totalPages = result.totalPages ?? 1;
    for (const item of result.items) found.push({ path: `/productos/${item.slug}`, title: item.name, description: item.shortDescription, image: item.coverMedia?.url, type: 'product', priority: '0.7' });
  }
  return found;
}

let dynamic = [];
try {
  dynamic = await catalogRoutes();
} catch (error) {
  console.warn(`[seo] No se pudo leer el catálogo, se generan solo rutas fijas: ${error.message}`);
}

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const template = await readFile('dist/index.html', 'utf8');

function headFor({ path, title, description, image, type = 'website' }) {
  const fullTitle = escape(buildTitle(title));
  const url = escape(absoluteUrl(path));
  const img = escape(absoluteUrl(image || DEFAULT_IMAGE));
  const desc = description ? escape(description) : '';
  return [
    `<title data-prerender>${fullTitle}</title>`,
    desc && `<meta data-prerender name="description" content="${desc}" />`,
    `<link data-prerender rel="canonical" href="${url}" />`,
    '<meta data-prerender property="og:site_name" content="APX Tech" />',
    '<meta data-prerender property="og:locale" content="es_CO" />',
    `<meta data-prerender property="og:type" content="${type}" />`,
    `<meta data-prerender property="og:title" content="${fullTitle}" />`,
    desc && `<meta data-prerender property="og:description" content="${desc}" />`,
    `<meta data-prerender property="og:url" content="${url}" />`,
    `<meta data-prerender property="og:image" content="${img}" />`,
    '<meta data-prerender name="twitter:card" content="summary_large_image" />',
  ].filter(Boolean).map((line) => `    ${line}`).join('\n');
}

for (const route of [...routes, ...dynamic]) {
  const html = template.replace('</head>', `${headFor(route)}\n  </head>`);
  const dir = route.path === '/' ? 'dist' : `dist${route.path}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, html);
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...routes, ...dynamic].map(({ path, priority, changefreq = 'monthly' }) => `  <url>
    <loc>${escape(SITE_URL + path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

await writeFile('dist/sitemap.xml', xml);
console.log(`[seo] ${routes.length + dynamic.length} páginas pre-renderizadas y en el sitemap (${dynamic.length} del catálogo)`);
