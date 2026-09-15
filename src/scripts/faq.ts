const items = document.querySelectorAll('.faq-item');

items.forEach((item) => {
  const btn = item.querySelector('.faq-toggle');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    items.forEach((i) => {
      i.classList.remove('open');
      i.querySelector('.faq-toggle')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
