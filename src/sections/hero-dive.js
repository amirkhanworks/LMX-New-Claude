import { gsap, MQ, delayReveal } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";

export function initHeroDive({ reduced }) {
  const area = document.querySelector("[data-hero]");
  if (!area || reduced) return;
  const bg = area.querySelector(".hero__bg");
  const img = area.querySelector(".hero__img");
  const content = area.querySelector(".hero__content");
  const title = area.querySelector("h1");
  const rest = area.querySelectorAll("[data-hero-in]");

  run("h", title, "initial"); run("ctn", rest, "initial");
  document.addEventListener("lmx:ready", () => { run("h", title, "reveal"); run("ctn", rest, "reveal", delayReveal); }, { once: true });

  gsap.matchMedia().add({ desk: MQ.desk, mob: MQ.mob }, (ctx) => {
    gsap.set([bg, img], { z: 10 });
    const tl = gsap.timeline({ defaults: { ease: "none" },
      scrollTrigger: { trigger: area, start: "top top", end: "bottom bottom", scrub: true } });
    if (ctx.conditions.desk) {
      tl.to(content, { yPercent: -60, duration: 1 }, 0)
        .to(bg, { yPercent: -15, duration: 1 }, 0)
        .to(content, { opacity: 0, duration: 0.3 }, 0.7)
        .to(img, { scale: 2, transformOrigin: "50% 75%", duration: 1 }, "-=0.2");
    } else {
      tl.to(img, { scale: 1.4, transformOrigin: "50% 75%", duration: 1 }, 0)
        .to(content, { opacity: 0, duration: 0.4 }, 0.4);
    }
  });
}
