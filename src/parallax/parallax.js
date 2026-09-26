import { gsap, MQ } from "../core/tokens.js";

const CFG = {
  "img":      { from: { yPercent: -15 }, to: { yPercent: 15 },  st: { start: "top bottom", end: "bottom top", scrub: 0.5 } },
  "img-out":  { from: { yPercent: 0 },   to: { yPercent: 20 },  st: { start: "bottom bottom", end: "bottom top", scrub: 0.5 } },
  "img-in":   { from: { yPercent: -20 }, to: { yPercent: 0 },   st: { start: "top bottom", end: "bottom bottom", scrub: true } },
  "ctn-down": { from: { yPercent: -10 }, to: { yPercent: 10 },  st: { start: "top 125%", end: "bottom -25%", scrub: 0.5 } },
  "ctn-up":   { from: { yPercent: 10 },  to: { yPercent: -10 }, st: { start: "top 125%", end: "bottom -25%", scrub: 0.5 } },
};

export function initParallax({ reduced }) {
  if (reduced) return;
  gsap.matchMedia().add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
    const { desk } = ctx.conditions;
    document.querySelectorAll('[data-parallax]:not([data-parallax="w"])').forEach((el) => {
      if ((desk && el.dataset.desk === "off") || (!desk && el.dataset.mob === "off")) return;
      const c = CFG[el.dataset.parallax];
      if (!c) return;
      const trigger = el.closest('[data-parallax="w"]') || el;
      gsap.fromTo(el, { ...c.from, z: 10 }, { ...c.to, z: 10, ease: "none", scrollTrigger: { trigger, ...c.st } });
    });
  });
}
