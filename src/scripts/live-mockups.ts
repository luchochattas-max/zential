// Mockups "en vivo" de la sección Servicios: chat de Atención IA, calificación del CRM y consulta a Cerebro.
// Cada animación arranca cuando su tarjeta entra en pantalla, se pausa si sale de la vista o si la pestaña
// queda oculta, y no corre con "reducir movimiento" (en ese caso se ve la tarjeta completa, como sin JS).


type Ctx = { visible: boolean; resume: (() => void)[] };

const active = (ctx: Ctx) => ctx.visible && !document.hidden;
const wake = (ctx: Ctx) => {
  if (active(ctx)) ctx.resume.splice(0).forEach((r) => r());
};
const contexts: Ctx[] = [];
document.addEventListener('visibilitychange', () => contexts.forEach(wake));

function setup(selector: string, run: (el: HTMLElement, ctx: Ctx) => Promise<void>) {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const ctx: Ctx = { visible: false, resume: [] };
  contexts.push(ctx);
  let started = false;
  new IntersectionObserver(([entry]) => {
    ctx.visible = entry.isIntersecting;
    wake(ctx);
    if (ctx.visible && !started) {
      started = true;
      (async () => { for (;;) await run(el, ctx); })();
    }
  }, { threshold: 0.35 }).observe(el);
}

// Espera `ms` y, si al terminar la tarjeta o la pestaña no están a la vista, queda dormida (sin timers)
// hasta que vuelvan a estarlo. Así la animación no consume nada mientras nadie la ve.
async function wait(ms: number, ctx: Ctx) {
  await new Promise((r) => setTimeout(r, ms));
  while (!active(ctx)) await new Promise<void>((r) => ctx.resume.push(r));
}

const show = (el: Element | null) => el?.classList.remove('lm-off');
const hide = (el: Element | null) => el?.classList.add('lm-off');

async function runChat(root: HTMLElement, ctx: Ctx) {
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const bubbles = steps.map((s) => s.querySelector('.lm-item'));
  bubbles.forEach(hide);
  await wait(700, ctx);
  for (const [i, step] of steps.entries()) {
    if (step.hasAttribute('data-typing')) {
      const typing = step.querySelector('.lm-typing');
      typing?.classList.add('lm-on');
      await wait(1300, ctx);
      typing?.classList.remove('lm-on');
    }
    show(bubbles[i]);
    await wait(1100, ctx);
  }
  await wait(4000, ctx);
  bubbles.forEach(hide);
  await wait(600, ctx);
}

async function runCrm(win: HTMLElement, ctx: Ctx) {
  const list = win.querySelector<HTMLElement>('[data-crm-list]')!;
  const row = list.querySelector<HTMLElement>('[data-crm-new]')!;
  const analyzing = row.querySelector<HTMLElement>('[data-crm-analyzing]')!;
  const hot = row.querySelector<HTMLElement>('[data-crm-hot]')!;
  const count = document.querySelector<HTMLElement>('[data-crm-count]');

  // Estado inicial: el contacto nuevo existe pero queda oculto arriba de la ventana de 3 filas.
  row.hidden = false;
  analyzing.hidden = false;
  hot.hidden = true;
  row.classList.remove('lm-flash');
  if (count) count.textContent = '8';
  const step = (row.nextElementSibling as HTMLElement).offsetTop - row.offsetTop;
  win.style.height = `${list.offsetHeight - step}px`;
  list.style.transition = 'none';
  list.style.transform = `translateY(-${step}px)`;
  list.style.opacity = '1';
  void list.offsetHeight;
  list.style.transition = '';

  await wait(1500, ctx);
  list.style.transform = 'translateY(0)';
  row.classList.add('lm-flash');
  await wait(1800, ctx);
  analyzing.hidden = true;
  hot.hidden = false;
  if (count) {
    count.textContent = '9';
    count.classList.remove('lm-pop');
    void count.offsetWidth;
    count.classList.add('lm-pop');
  }
  await wait(4500, ctx);
  list.style.opacity = '0';
  await wait(500, ctx);
}

async function runBrain(root: HTMLElement, ctx: Ctx) {
  const typed = root.querySelector<HTMLElement>('[data-brain-typed]')!;
  const search = root.querySelector('[data-brain-search]');
  const answer = root.querySelector('[data-brain-answer]');
  const sources = root.querySelector('[data-brain-sources]');
  const question = typed.dataset.text ?? (typed.dataset.text = typed.textContent!.trim());

  typed.textContent = '';
  typed.classList.add('lm-caret');
  hide(answer);
  hide(sources);
  await wait(600, ctx);
  for (let i = 1; i <= question.length; i++) {
    typed.textContent = question.slice(0, i);
    await wait(40, ctx);
  }
  typed.classList.remove('lm-caret');
  await wait(400, ctx);
  search?.classList.add('lm-on');
  await wait(1500, ctx);
  search?.classList.remove('lm-on');
  show(answer);
  await wait(600, ctx);
  show(sources);
  await wait(5000, ctx);
  hide(answer);
  hide(sources);
  typed.textContent = '';
  await wait(500, ctx);
}

// Arranque: va al final del archivo para que `contexts` y las demás constantes ya estén definidas.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setup('[data-live-chat]', runChat);
  setup('[data-live-crm]', runCrm);
  setup('[data-live-brain]', runBrain);
}
