// Genera dist/sitemap.xml con las rutas fijas y las del catálogo (desde la API).
import { writeFile } from 'node:fs/promises';
import { loadEnv } from 'vite';

const SITE_URL = 'https://apxtech.com.co';
const mode = process.argv[2] ?? 'production';
const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
const today = new Date().toISOString().slice(0, 10);

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/productos', priority: '0.9', changefreq: 'weekly' },
  { path: '/servicios/ia-automatizacion', priority: '0.8' },
  { path: '/servicios/automatizar', priority: '0.8' },
  { path: '/servicios/activar-marca', priority: '0.8' },
  { path: '/servicios/producir-evento', priority: '0.8' },
  { path: '/politica-de-privacidad', priority: '0.2', changefreq: 'yearly' },
  { path: '/terminos-y-condiciones', priority: '0.2', changefreq: 'yearly' },
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
  for (const category of categories) found.push({ path: `/productos/categoria/${category.slug}`, priority: '0.7' });
  for (let page = 1, totalPages = 1; page <= totalPages; page += 1) {
    const result = await getJson(`/api/v1/catalog/solutions?page=${page}&pageSize=100`);
    totalPages = result.totalPages ?? 1;
    for (const item of result.items) found.push({ path: `/productos/${item.slug}`, priority: '0.7' });
  }
  return found;
}

let dynamic = [];
try {
  dynamic = await catalogRoutes();
} catch (error) {
  console.warn(`[sitemap] No se pudo leer el catálogo, se generan solo rutas fijas: ${error.message}`);
}

const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
console.log(`[sitemap] ${routes.length + dynamic.length} URLs (${dynamic.length} del catálogo)`);
