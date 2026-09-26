import { gsap, ScrollTrigger, BREAKPOINT } from "../core/tokens.js";
import { onDocScroll } from "../core/doc-scroll.js";

export function initProgress({ lenis }) {
  const root = document.documentElement;
  const counter = document.querySelector("[data-scroll-counter]");
  const rail = document.querySelector("[data-rail]");
  const thumb = document.querySelector("[data-rail-thumb]");
  const setP = gsap.quickSetter(root, "--progress", "%");
  let last = -1;

  onDocScroll((self) => {
    const p = self.progress * 100;
    setP(p);
    const n = Math.min(99, Math.floor(p));
    if (n !== last) {
      last = n;
      if (counter) counter.textContent = String(n).padStart(2, "0");
      thumb?.setAttribute("aria-valuenow", String(n));
    }
  });

  if (!rail || !thumb) return;
  const max = () => ScrollTrigger.maxScroll(window);
  const go = (y) => (lenis ? lenis.scrollTo(y, { duration: 3.2 }) : window.scrollTo({ top: y }));
  const fromPointer = (clientY) => {
    const r = rail.getBoundingClientRect();
    return gsap.utils.clamp(0, 1, (clientY - r.top) / r.height) * max();
  };

  thumb.addEventListener("pointerdown", (e) => {
    if (innerWidth < BREAKPOINT) return;
    thumb.setPointerCapture(e.pointerId);
    const move = (ev) => go(fromPointer(ev.clientY));
    const up = () => { thumb.removeEventListener("pointermove", move); thumb.removeEventListener("pointerup", up); };
    thumb.addEventListener("pointermove", move);
    thumb.addEventListener("pointerup", up);
  });
  thumb.addEventListener("keydown", (e) => {
    const step = max() * 0.1;
    const map = { ArrowDown: step, ArrowRight: step, ArrowUp: -step, ArrowLeft: -step, PageDown: step * 2, PageUp: -step * 2 };
    if (e.key in map) { e.preventDefault(); go(window.scrollY + map[e.key]); }
    if (e.key === "Home") { e.preventDefault(); go(0); }
    if (e.key === "End") { e.preventDefault(); go(max()); }
  });
}
