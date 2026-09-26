import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./tokens.js";

export function initLenis(reduced) {
  if (reduced) return null;
  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    touchMultiplier: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // syncTouch stays false (default): native momentum scrolling on touch devices.
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // In-page anchors go through Lenis.
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute("href") === "#") return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { onComplete: () => target.focus?.({ preventScroll: true }) });
  });
  return lenis;
}
