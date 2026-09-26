import { gsap, MQ, delayReveal } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";

export function initClose({ reduced }) {
  const area = document.querySelector("[data-close]");
  const footer = document.querySelector("[data-footer]");
  if (!area || !footer || reduced) return;
  const clip = area.querySelector("[data-page-clip]");
  const inner = footer.querySelector(".footer-inner");
  const texts = footer.querySelectorAll("[data-footer-text]");

  gsap.matchMedia().add(MQ.desk, () => {
    footer.classList.add("footer--fixed");
    run("ctn", texts, "initial");
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
      trigger: area, start: "top top", end: "bottom bottom", scrub: true,
      onEnter: () => { footer.classList.add("is-active"); run("ctn", texts, "reveal", delayReveal); },
      onLeaveBack: () => { run("ctn", texts, "hide"); footer.classList.remove("is-active"); },
    } });
    tl.fromTo(clip, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(8% 22% 8% 22% round 24px)", duration: 1 }, 0)
      .fromTo(inner, { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, duration: 1 }, 0);

    return () => {
      footer.classList.remove("footer--fixed", "is-active");
      gsap.set([inner, ...texts], { clearProps: "all" });
    };
  });
}
