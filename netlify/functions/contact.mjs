import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

const MAX_BODY_BYTES = 16_384;
const MIN_COMPLETION_MS = 2_500;

const allowedValues = {
  role: new Set(['', 'ceo', 'cto', 'director', 'coord', 'consultor', 'otro']),
  country: new Set(['', 'co', 'mx', 'ar', 'cl', 'pe', 'ec', 'us', 'es', 'otro']),
  projectType: new Set(['web', 'ia', 'data', 'exp', 'integracion', 'otro']),
  currency: new Set(['usd', 'cop']),
  budgetRange: new Set(['', 'lt2k', '2-5k', '5-15k', '15-40k', '40-100k', 'gt100k', 'lt8m', '8-20m', '20-60m', '60-150m', '150-400m', 'gt400m', 'nd']),
  urgency: new Set(['', 'now', '1-3m', '3-6m', 'gt6m']),
  source: new Set(['', 'google', 'linkedin', 'instagram', 'referido', 'evento', 'otro']),
};

const labels = {
  role: { ceo: 'CEO / Fundador', cto: 'CTO / Dir. Técnico', director: 'Director / Gerente', coord: 'Coordinador / Jefe', consultor: 'Freelancer / Consultor', otro: 'Otro' },
  country: { co: 'Colombia', mx: 'México', ar: 'Argentina', cl: 'Chile', pe: 'Perú', ec: 'Ecuador', us: 'Estados Unidos', es: 'España', otro: 'Otro' },
  projectType: { web: 'Desarrollo Web / App', ia: 'IA & Automatización', data: 'Datos & Analytics', exp: 'Experiencia Digital', integracion: 'Integración de Sistemas', otro: 'Otro' },
  urgency: { now: 'Lo antes posible', '1-3m': '1 – 3 meses', '3-6m': '3 – 6 meses', gt6m: 'Más de 6 meses' },
  source: { google: 'Google / Búsqueda web', linkedin: 'LinkedIn', instagram: 'Instagram / Redes sociales', referido: 'Referido', evento: 'Evento / Conferencia', otro: 'Otro' },
};

const json = (status, body, extraHeaders = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    ...extraHeaders,
  },
});

const clean = (value) => typeof value === 'string' ? value.trim().replace(/\r\n?/g, '\n') : '';
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value) && value.length <= 254;
const escapeHtml = (value) => value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const display = (group, value) => labels[group]?.[value] || value || 'No indicado';

function validate(raw) {
  const data = {
    firstName: clean(raw.firstName), lastName: clean(raw.lastName), email: clean(raw.email).toLowerCase(),
    phone: clean(raw.phone), company: clean(raw.company), role: clean(raw.role), country: clean(raw.country),
    projectType: clean(raw.projectType), currency: clean(raw.currency), budgetRange: clean(raw.budgetRange),
    urgency: clean(raw.urgency), source: clean(raw.source), message: clean(raw.message),
    website: clean(raw.website), startedAt: Number(raw.startedAt), privacyAccepted: raw.privacyAccepted === true,
  };

  const lengths = { firstName: 60, lastName: 60, phone: 30, company: 120, message: 3000 };
  const invalidLength = Object.entries(lengths).some(([key, max]) => data[key].length > max);
  const invalidChoice = Object.entries(allowedValues).some(([key, values]) => !values.has(data[key]));
  const validStart = Number.isFinite(data.startedAt) && data.startedAt > 0 && Date.now() - data.startedAt >= MIN_COMPLETION_MS;

  if (data.website) return { bot: true };
  if (!data.firstName || data.firstName.length < 2 || !validEmail(data.email) || !data.projectType || data.message.length < 20 || invalidLength || invalidChoice || !data.privacyAccepted || !validStart) {
    return { error: 'Revisa los campos obligatorios y vuelve a intentarlo.' };
  }
  if (data.budgetRange && !data.currency) return { error: 'La moneda es obligatoria cuando se indica un presupuesto.' };
  return { data };
}

function renderEmail(data, submissionId, receivedAt) {
  const rows = [
    ['Nombre', `${data.firstName} ${data.lastName}`.trim()], ['Email', data.email], ['Teléfono', data.phone || 'No indicado'],
    ['Empresa', data.company || 'No indicada'], ['Cargo', display('role', data.role)], ['País', display('country', data.country)],
    ['Tipo de proyecto', display('projectType', data.projectType)], ['Presupuesto', data.budgetRange ? `${data.budgetRange} ${data.currency.toUpperCase()}` : 'No indicado'],
    ['Urgencia', display('urgency', data.urgency)], ['Origen', display('source', data.source)],
  ];
  const htmlRows = rows.map(([key, value]) => `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">${escapeHtml(key)}</th><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join('');
  const textRows = rows.map(([key, value]) => `${key}: ${value}`).join('\n');
  return {
    subject: `[Web APX] ${display('projectType', data.projectType)} — ${data.firstName}${data.company ? ` / ${data.company}` : ''}`,
    html: `<h1>Nuevo contacto desde APX</h1><table style="border-collapse:collapse">${htmlRows}</table><h2>Descripción</h2><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p><hr><small>ID: ${escapeHtml(submissionId)} · Recibido: ${escapeHtml(receivedAt)}</small>`,
    text: `Nuevo contacto desde APX\n\n${textRows}\n\nDescripción:\n${data.message}\n\nID: ${submissionId}\nRecibido: ${receivedAt}`,
  };
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { success: false, error: 'Método no permitido.' }, { allow: 'POST' });
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json(415, { success: false, error: 'Formato no admitido.' });

  const configuredOrigins = (process.env.CONTACT_ALLOWED_ORIGINS || process.env.URL || '').split(',').map(value => value.trim()).filter(Boolean);
  const origin = request.headers.get('origin');
  if (!origin || !configuredOrigins.includes(origin)) return json(403, { success: false, error: 'Origen no autorizado.' });

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json(413, { success: false, error: 'Solicitud demasiado grande.' });

  let raw;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) return json(413, { success: false, error: 'Solicitud demasiado grande.' });
    raw = JSON.parse(body);
  } catch {
    return json(400, { success: false, error: 'Solicitud inválida.' });
  }

  const result = validate(raw || {});
  if (result.bot) return json(200, { success: true, submissionId: randomUUID() });
  if (result.error) return json(400, { success: false, error: result.error });

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const destinationEmail = process.env.CONTACT_TO_EMAIL;
  if (!gmailUser || !gmailAppPassword || !destinationEmail || !validEmail(gmailUser) || !validEmail(destinationEmail)) {
    console.error('Contact function is missing required email configuration.');
    return json(503, { success: false, error: 'El formulario no está disponible temporalmente.' });
  }

  const submissionId = randomUUID();
  const receivedAt = new Date().toISOString();
  const email = renderEmail(result.data, submissionId, receivedAt);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailAppPassword },
      secure: true,
      requireTLS: true,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    await transporter.sendMail({
      from: `APX Formularios <${gmailUser}>`,
      to: destinationEmail,
      replyTo: result.data.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: { 'X-APX-Submission-ID': submissionId },
    });
    return json(200, { success: true, submissionId });
  } catch (error) {
    console.error('Gmail SMTP could not deliver contact submission.', { name: error?.name, code: error?.code, submissionId });
    return json(502, { success: false, error: 'No pudimos enviar el mensaje. Intenta nuevamente.' });
  }
};

export const config = {
  path: '/api/contact',
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] },
};
