const canvas = document.getElementById('particles') as HTMLCanvasElement | null;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    let w: number, h: number;
    let particles: { x: number; y: number; r: number; vx: number; vy: number; a: number }[];

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.5 + 0.15,
      }));
    }

    function draw() {
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
      requestAnimationFrame(draw);
    }

    init();
    draw();
    addEventListener('resize', resize, { passive: true });
  }
}
