import { gsap, ScrollTrigger, MQ } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";

export function initStepSwap({ reduced }) {
  if (reduced) return;
  document.querySelectorAll("[data-swap]").forEach((area) => {
    const items = [...area.querySelectorAll("[data-swap-item]")];
    const fill = area.querySelector("[data-swap-fill]");
    gsap.matchMedia().add(MQ.desk, () => {
      area.classList.add("is-swapping");
      items.forEach((it, i) => run("ctn", it, i === 0 ? "final" : "initial"));
      let current = 0;
      const st = ScrollTrigger.create({
        trigger: area, start: "top top", end: "bottom bottom",
        onUpdate: ({ progress }) => {
          if (fill) fill.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;
          const idx = Math.min(items.length - 1, Math.floor(progress * items.length));
          if (idx !== current) {
            run("ctn", items[current], "hide");
            run("ctn", items[idx], "reveal");
            current = idx;
          }
        },
      });
      return () => { st.kill(); area.classList.remove("is-swapping"); gsap.set(items, { clearProps: "all" }); };
    });
  });
}
