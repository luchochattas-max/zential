const glow = document.getElementById('cursor-glow');
const dot = document.getElementById('cursor-dot');

if (glow && dot) {
  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let gx = mx;
  let gy = my;
  let on = false;

  addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    if (!on) {
      on = true;
      glow.style.opacity = '1';
      dot.style.opacity = '1';
    }
  }, { passive: true });

  addEventListener('mouseleave', () => {
    on = false;
    glow.style.opacity = '0';
    dot.style.opacity = '0';
  });

  addEventListener('mouseenter', () => {
    on = true;
    glow.style.opacity = '1';
    dot.style.opacity = '1';
  });

  function bindHoverables() {
    const hoverables = "a, button, [role='button'], input, textarea, select, label, .faq-toggle";
    document.querySelectorAll(hoverables).forEach((el) => {
      if ((el as HTMLElement).dataset.cursorBound) return;
      (el as HTMLElement).dataset.cursorBound = '1';
      el.addEventListener('mouseenter', () => dot.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => dot.classList.remove('is-hover'));
    });
  }

  new MutationObserver(bindHoverables).observe(document.body, { childList: true, subtree: true });
  bindHoverables();

  (function loop() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = `translate3d(${gx}px,${gy}px,0)`;
    requestAnimationFrame(loop);
  })();
}
