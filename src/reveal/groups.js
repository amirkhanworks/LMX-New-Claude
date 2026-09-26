import { gsap, ScrollTrigger, MQ, stagger } from "../core/tokens.js";
import { run } from "./primitives.js";

const KEYS = ["a", "h", "p", "ctn", "line", "slide"];

function capLists() {
  const parents = new Set([...document.querySelectorAll("[data-reveal-first]")].map((el) => el.parentElement));
  parents.forEach((p) => {
    [...p.children].filter((c) => c.hasAttribute("data-reveal-first")).slice(1).forEach((c) => {
      c.removeAttribute("data-reveal");
      c.querySelectorAll("[data-reveal]").forEach((n) => n.removeAttribute("data-reveal"));
    });
  });
}

function collect() {
  const groups = new Map();
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    if (!KEYS.includes(el.dataset.reveal) || el.closest("[data-reveal-manual]")) return;
    const w = el.parentElement?.closest('[data-reveal="w"]') || el;
    if (!groups.has(w)) groups.set(w, []);
    groups.get(w).push(el);
  });
  return groups;
}

export function initReveals({ reduced }) {
  if (reduced) return;
  capLists();
  const groups = collect();
  groups.forEach((items) => items.forEach((el) => run(el.dataset.reveal, el, "initial")));

  const play = (items, state) => {
    const tl = gsap.timeline();
    items.forEach((el, i) => tl.add(run(el.dataset.reveal, el, state), i * stagger));
    return tl;
  };

  gsap.matchMedia().add({ desk: MQ.desk, mob: MQ.mob }, () => {
    groups.forEach((items, w) => {
      const rewind = w.dataset.revealMode === "rewind";
      if (w._lmxDone && !rewind) return;                       // already revealed before a breakpoint change
      const container = w.closest("[data-hscroll]")?._horizontalTween || undefined;
      ScrollTrigger.create({
        trigger: w,
        start: container ? "left bottom" : (w.dataset.revealStart || "top 85%"),
        containerAnimation: container,
        once: !rewind,
        onEnter: () => { w._lmxDone = true; play(items, "reveal"); },
        onLeaveBack: rewind ? () => play(items, "hide") : undefined,
      });
    });
  });
}
