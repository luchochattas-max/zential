// Número de WhatsApp Business en formato internacional, solo dígitos y sin "+".
// Argentina: 549 + código de área sin 0 + número sin 15 (ej. 5491112345678).
export const WHATSAPP_NUMBER = '5491176768951';

// Cómo se muestra el número en la página (respaldo para quien quiera agendarlo).
export const WHATSAPP_DISPLAY = '+54 9 11 7676-8951';

export const MENSAJE_DIAGNOSTICO = 'Quiero agendar un diagnóstico gratuito para mi negocio.';
export const MENSAJE_CONSULTA = 'Me interesan sus servicios y me gustaría recibir más información.';

export function mensajeServicio(servicio: string) {
  return `Me interesa ${servicio} y me gustaría recibir más información.`;
}

export function whatsappUrl(mensaje: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}
