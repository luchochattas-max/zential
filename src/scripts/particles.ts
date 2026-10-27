const canvas = document.getElementById('particles') as HTMLCanvasElement | null;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Arranca cuando la página ya terminó de cargar y el navegador está libre, para no competir con el
// primer dibujo (crear el canvas y medirlo fuerza un cálculo de layout que traba la carga en celular).
function whenIdle(fn: () => void) {
  const run = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
  if (document.readyState === 'complete') run();
  else addEventListener('load', run, { once: true });
}

if (canvas && !reduceMotion) whenIdle(() => {
  const ctx = canvas!.getContext('2d');
  if (ctx) {
    let w: number, h: number;
    let particles: { x: number; y: number; r: number; vx: number; vy: number; a: number }[];
    let running = false;
    let rafId = 0;

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }

    function init() {
      resize();
      // Menos partículas en pantallas chicas: mismo efecto visual, la mitad de trabajo por cuadro.
      particles = Array.from({ length: w < 768 ? 24 : 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.5 + 0.15,
      }));
    }

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(174,192,250,${p.a})`;
        ctx!.fill();
      });
      rafId = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    init();
    addEventListener('resize', resize, { passive: true });

    // Solo corre mientras el hero esta en pantalla: se detiene apenas se scrollea
    // mas alla, en vez de seguir animando en segundo plano para siempre.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => (entry.isIntersecting ? start() : stop())),
      { threshold: 0 }
    );
    io.observe(canvas!);
  }
});
