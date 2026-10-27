function applyVisibility() {
  document.documentElement.classList.toggle('tab-hidden', document.hidden);
}

document.addEventListener('visibilitychange', applyVisibility);
applyVisibility();
