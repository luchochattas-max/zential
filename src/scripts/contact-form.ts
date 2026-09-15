const form = document.getElementById('contact-form') as HTMLFormElement | null;
const statusEl = document.getElementById('contact-form-status');
const submitBtn = document.getElementById('contact-form-submit') as HTMLButtonElement | null;

function setStatus(message: string, kind: 'success' | 'error') {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.classList.remove('visible');
  statusEl.style.color = kind === 'success' ? '#AEC0FA' : '#FCA5A5';
  requestAnimationFrame(() => statusEl.classList.add('visible'));
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const data = new FormData(form);

  const payload = {
    nombre: String(data.get('nombre') || '').trim(),
    empresa: String(data.get('empresa') || '').trim(),
    whatsapp: String(data.get('whatsapp') || '').trim(),
    rubro: String(data.get('rubro') || '').trim(),
    email: String(data.get('email') || '').trim(),
    mensaje: String(data.get('mensaje') || '').trim(),
    // honeypot: real visitors never see or fill this field, bots usually fill every input
    company_website: String(data.get('company_website') || '').trim(),
  };

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (res.ok && result.ok) {
      setStatus('¡Gracias! Recibimos tu consulta y te respondemos por mail a la brevedad.', 'success');
      form.reset();
    } else {
      setStatus(result.error || 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos.', 'error');
    }
  } catch {
    setStatus('No pudimos enviar tu consulta. Revisá tu conexión e intentá de nuevo.', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar consulta';
    }
  }
});
