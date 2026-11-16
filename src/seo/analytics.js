// Eventos de conversión para Google Analytics 4 (y Google Ads al importarlos).
export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
}

// Un solo listener para todos los enlaces de WhatsApp, correo y teléfono del sitio.
export function trackContactClicks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const page = window.location.pathname;
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) trackEvent('contact_whatsapp', { page_path: page });
    else if (href.startsWith('mailto:')) trackEvent('contact_email', { page_path: page });
    else if (href.startsWith('tel:')) trackEvent('contact_phone', { page_path: page });
  }, { capture: true });
}
