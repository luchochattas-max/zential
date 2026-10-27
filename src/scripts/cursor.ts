const glow = document.getElementById('cursor-glow');
const dot = document.getElementById('cursor-dot');

// Solo en dispositivos con mouse: en celulares y tablets el cursor custom está oculto por CSS,
// así que no tiene sentido escuchar eventos ni animar nada.
const hasMouse = matchMedia('(hover: hover) and (pointer: fine)').matches;

if (glow && dot && hasMouse) {
  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let gx = mx;
  let gy = my;
  let on = false;
  let rafId = 0;

  // El resplandor sigue al mouse con retardo. El loop corre solo mientras falta llegar a destino
  // y se detiene cuando el mouse está quieto, en vez de recalcular 60 veces por segundo siempre.
  function tick() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow!.style.transform = `translate3d(${gx}px,${gy}px,0)`;
    if (Math.abs(mx - gx) > 0.5 || Math.abs(my - gy) > 0.5) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  }

  addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    if (!on) {
      on = true;
      glow.style.opacity = '1';
      dot.style.opacity = '1';
    }
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    on = false;
    glow.style.opacity = '0';
    dot.style.opacity = '0';
  });

  // Delegación de eventos: un solo listener para todos los elementos clickeables, incluidos los que
  // se agregan después. Reemplaza al MutationObserver, que se disparaba con cada cambio del DOM
  // (por ejemplo, con las animaciones de los mockups de Servicios).
  const hoverables = "a, button, [role='button'], input, textarea, select, label, .faq-toggle";
  document.addEventListener('mouseover', (e) => {
    const isHover = !!(e.target as Element).closest?.(hoverables);
    dot.classList.toggle('is-hover', isHover);
  }, { passive: true });
}
