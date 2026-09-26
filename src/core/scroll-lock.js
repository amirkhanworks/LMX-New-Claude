let depth = 0;

export function lockScroll(lenis) {
  if (depth++ > 0) return;
  const sbw = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--sbw", `${sbw}px`);
  document.body.classList.add("is-locked");
  lenis?.stop();
}

export function unlockScroll(lenis) {
  if (depth === 0 || --depth > 0) return;
  document.body.classList.remove("is-locked");
  document.documentElement.style.setProperty("--sbw", "0px");
  lenis?.start();
}
