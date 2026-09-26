import { gsap, MQ } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";

const CLOSED = "polygon(50% 35%, 50% 35%, 50% 50%, 50% 65%, 50% 65%, 50% 50%)";
const L_OPEN = "polygon(0% 0%, 50% 0%, 50% 50%, 50% 100%, 0% 100%, 0% 50%)";
const R_OPEN = "polygon(100% 0%, 50% 0%, 50% 50%, 50% 100%, 100% 100%, 100% 50%)";

export function initSafeCurtains({ reduced }) {
  const area = document.querySelector("[data-curtain]");
  if (!area || reduced) return;
  const frame = area.querySelector("[data-curtain-frame]");
  const L = area.querySelector("[data-curtain-l]"), R = area.querySelector("[data-curtain-r]");
  const mL = area.querySelector("[data-motif-l]"), mR = area.querySelector("[data-motif-r]");
  const copy = area.querySelector("[data-curtain-copy]");
  const title = copy.querySelector("h2");
  const rest = copy.querySelectorAll("li, .mono:last-child");
  const next = area.nextElementSibling;

  run("h", title, "initial"); run("ctn", rest, "initial");

  gsap.matchMedia().add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
    let shown = false;
    const show = (v) => {
      if (v === shown) return; shown = v;
      run("h", title, v ? "reveal" : "hide");
      run("ctn", rest, v ? "reveal" : "hide");
    };

    if (ctx.conditions.desk) {
      gsap.set(frame, { z: 10 });
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
        trigger: area, start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: ({ progress }) => show(progress > 0.5),
      } });
      tl.fromTo(L, { clipPath: CLOSED }, { clipPath: L_OPEN, duration: 0.45 }, 0)
        .fromTo(R, { clipPath: CLOSED }, { clipPath: R_OPEN, duration: 0.45 }, 0)
        .to(frame, { scale: 1.84, duration: 0.55 }, 0.45)
        .to(mL, { xPercent: -50, duration: 0.55 }, 0.45)
        .to(mR, { xPercent: 50, duration: 0.55 }, 0.45);

      if (next?.hasAttribute("data-curtain-next")) {
        gsap.fromTo(next, { scale: 0.75, transformOrigin: "50% 0%" }, { scale: 1, ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
      }
    } else {
      gsap.set([L, R], { clipPath: (i) => (i === 0 ? L_OPEN : R_OPEN) });
      gsap.fromTo(frame, { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "InOut",
        scrollTrigger: { trigger: area, start: "top 70%", once: true } });
      gsap.delayedCall(0, () => show(true));
    }
  });
}
