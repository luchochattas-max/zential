const nav = document.getElementById('navbar');

if (nav) {
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
const iconMenu = document.getElementById('icon-menu');
const iconClose = document.getElementById('icon-close');

function setMenuState(isOpen: boolean) {
  menu?.classList.toggle('open', isOpen);
  btn?.setAttribute('aria-expanded', String(isOpen));
  iconMenu?.classList.toggle('hidden', isOpen);
  iconClose?.classList.toggle('hidden', !isOpen);
}

if (btn && menu) {
  btn.addEventListener('click', () => {
    setMenuState(!menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenuState(false)));
}
