import { gsap, SplitText, durS, durL, stagger } from "../core/tokens.js";

const SPLIT = {
  a: { type: "chars" },
  h: { type: "words,chars" },
  p: { type: "lines,words", mask: "lines" },
};

const P = {
  a: {
    pick: (s) => s.chars,
    initial: { opacity: 0, rotateX: 90, x: "10rem", transformOrigin: "50% 100%" },
    reveal:  { opacity: 1, rotateX: 0, x: 0, transformOrigin: "50% 100%" },
    hide:    { opacity: 0, rotateX: -90, x: "-10rem", transformOrigin: "50% 0%" },
  },
  h: {
    pick: (s) => s.chars,
    initial: { opacity: 0, yPercent: 50, rotateY: 90 },
    reveal:  { opacity: 1, yPercent: 0, rotateY: 0 },
    hide:    { opacity: 0, yPercent: -50, rotateY: -90 },
  },
  p: {
    pick: (s) => s.lines,
    initial: { yPercent: 110 },
    reveal:  { yPercent: 0 },
    hide:    { yPercent: -110 },
  },
  ctn: {
    initial: { opacity: 0, y: "3.33rem" },
    reveal:  { opacity: 1, y: 0 },
    hide:    { opacity: 0 },
  },
  line: {
    initial: { clipPath: "inset(0% 0% 100% 0%)" },
    reveal:  { clipPath: "inset(0% 0% 0% 0%)" },
    hide:    { clipPath: "inset(100% 0% 0% 0%)" },
  },
  slide: {
    initial: { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
    reveal:  { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
    hide:    { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
    child: {
      initial: { scale: 1.5, xPercent: 25 },
      reveal:  { scale: 1, xPercent: 0 },
      hide:    { scale: 1, xPercent: -25 },
    },
  },
};

function split(el, key) {
  if (el._lmxSplit) return el._lmxSplit;
  el._lmxSplit = SplitText.create(el, {
    ...SPLIT[key],
    autoSplit: true,        // re-splits on resize and font load
    aria: "auto",           // aria-label on el, aria-hidden on generated spans
    onSplit(self) {         // re-apply the current state to the fresh spans
      const state = el._lmxState === "final" ? "reveal" : (el._lmxState || "initial");
      gsap.set(P[key].pick(self), P[key][state]);
    },
  });
  return el._lmxSplit;
}

const targetsOf = (el, key) => (SPLIT[key] ? P[key].pick(split(el, key)) : [el]);
const childOf = (el) => el.querySelectorAll("[data-reveal-child]");

/**
 * run(key, elements, state, delay) -> gsap.core.Timeline
 * state: "initial" | "reveal" | "hide" | "final"
 */
export function run(key, elements, state = "reveal", delay = 0) {
  const d = P[key];
  const tl = gsap.timeline({ delay });
  gsap.utils.toArray(elements).forEach((el, i) => {
    el._lmxState = state;
    const t = targetsOf(el, key);
    const units = SPLIT[key] ? { amount: durS } : 0;
    const at = i * stagger;
    if (state === "initial" || state === "final") {
      const v = state === "initial" ? "initial" : "reveal";
      gsap.set(t, d[v]);
      if (d.child) gsap.set(childOf(el), d.child[v]);
      return;
    }
    if (state === "reveal") {
      tl.fromTo(t, d.initial, { ...d.reveal, duration: durL, ease: "Out", stagger: units, overwrite: true }, at);
      if (d.child) tl.fromTo(childOf(el), d.child.initial, { ...d.child.reveal, duration: durL, ease: "Out", overwrite: true }, at);
    } else {
      tl.to(t, { ...d.hide, duration: durS, ease: "In", stagger: units, overwrite: true }, at);
      if (d.child) tl.to(childOf(el), { ...d.child.hide, duration: durS, ease: "In", overwrite: true }, at);
    }
  });
  return tl;
}

export const reveal = Object.fromEntries(
  ["a", "h", "p", "ctn", "line", "slide"].map((k) => [k, (els, state, delay) => run(k, els, state, delay)])
);
