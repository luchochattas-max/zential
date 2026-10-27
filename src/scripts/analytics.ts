// Registra en Google Analytics cada clic en un botón de WhatsApp, con dónde estaba y qué decía.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function ubicacion(link: HTMLAnchorElement) {
  if (link.id === 'wa-float') return 'boton_flotante';
  if (link.closest('nav')) return 'menu';
  if (link.closest('#top')) return 'inicio';
  if (link.closest('#contacto')) return 'contacto';
  const servicio = link.closest('[id^="servicio-"]');
  if (servicio) return servicio.id;
  // El único botón de WhatsApp que queda fuera de esas zonas es "Contacto" del pie de página.
  return 'pie';
}

document.addEventListener('click', (e) => {
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="wa.me"]');
  if (!link || typeof window.gtag !== 'function') return;

  window.gtag('event', 'click_whatsapp', {
    ubicacion: ubicacion(link),
    boton: (link.innerText.trim() || link.getAttribute('aria-label') || '').slice(0, 80),
  });
});

export {};
