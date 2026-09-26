import { ScrollTrigger } from "./tokens.js";

const CLS = ["theme_on-light", "theme_on-dark", "theme_on-color"];
let ui = [], current = null;

export function setTheme(bg) {
  if (!bg || bg === current) return;
  current = bg;
  ui.forEach((el) => { el.classList.remove(...CLS); el.classList.add(`theme_on-${bg}`); });
}

export function initTheme() {
  ui = [...document.querySelectorAll("[data-theme]")];
  const sections = [...document.querySelectorAll("main [data-bg]")];
  sections.forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: "top 50%", end: "bottom 50%",
    onToggle: (self) => self.isActive && setTheme(sec.dataset.bg),
  }));
  setTheme(sections[0]?.dataset.bg || "light");
}
