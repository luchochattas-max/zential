const items = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

items.forEach((el) => io.observe(el));
// Esto es un módulo para TS (igual que analytics.ts): evita que sus variables choquen con las de otros scripts.
export {};
