import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const CONTACT_EMAIL = 'zential.ai@gmail.com';
const RUBROS = new Set([
  'Gastronomía',
  'Comercio / Retail',
  'Salud y estética',
  'Servicios profesionales',
  'Inmobiliaria',
  'Educación',
  'Otro',
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  const nombre = String(payload.nombre || '').trim().slice(0, 200);
  const empresa = String(payload.empresa || '').trim().slice(0, 200);
  const whatsapp = String(payload.whatsapp || '').trim().slice(0, 50);
  const rubro = String(payload.rubro || '').trim().slice(0, 100);
  const email = String(payload.email || '').trim().slice(0, 200);
  const mensaje = String(payload.mensaje || '').trim().slice(0, 3000);
  const honeypot = String(payload.company_website || '').trim();

  // Bot filled the trap field: pretend success, don't send an email.
  if (honeypot) {
    return json({ ok: true });
  }

  if (!nombre || !empresa || !whatsapp || !rubro) {
    return json({ ok: false, error: 'Faltan campos obligatorios.' }, 400);
  }
  if (!RUBROS.has(rubro)) {
    return json({ ok: false, error: 'Rubro inválido.' }, 400);
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'El email ingresado no es válido.' }, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY no está configurada.');
    return json({ ok: false, error: 'El formulario no está disponible en este momento.' }, 500);
  }

  const resend = new Resend(apiKey);
  const fromAddress = import.meta.env.CONTACT_FROM_EMAIL || 'Zential <onboarding@resend.dev>';

  const lines = [
    `Nombre: ${nombre}`,
    `Empresa: ${empresa}`,
    `WhatsApp: ${whatsapp}`,
    `Rubro: ${rubro}`,
  ];
  if (email) lines.push(`Email: ${email}`);
  if (mensaje) lines.push('', 'Mensaje:', mensaje);

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: CONTACT_EMAIL,
      replyTo: email || undefined,
      subject: `Consulta de ${empresa} vía la web`,
      text: lines.join('\n'),
      html: `<div style="font-family:sans-serif;line-height:1.6;">${lines
        .map((line) => (line ? escapeHtml(line) : '<br>'))
        .join('<br>')}</div>`,
    });

    if (error) {
      console.error('Resend error:', error);
      return json({ ok: false, error: 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos.' }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return json({ ok: false, error: 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos.' }, 500);
  }
};
