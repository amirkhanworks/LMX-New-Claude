import { gsap, ScrollTrigger, durS, durM } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";

export function initAccordions({ reduced }) {
  document.querySelectorAll("[data-accordion]").forEach((acc) => {
    const btn = acc.querySelector("[data-accordion-trigger]");
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      gsap.killTweensOf(panel);
      if (reduced) { panel.hidden = !open; ScrollTrigger.refresh(); return; }
      if (open) {
        panel.hidden = false;
        gsap.fromTo(panel, { height: 0 }, { height: "auto", duration: durM, ease: "InOut",
          onComplete: () => { gsap.set(panel, { clearProps: "height" }); ScrollTrigger.refresh(); } });
        run("ctn", panel.firstElementChild, "reveal");
      } else {
        gsap.to(panel, { height: 0, duration: durS, ease: "In",
          onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: "height" }); ScrollTrigger.refresh(); } });
      }
    });
  });
}
