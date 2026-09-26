import { gsap, durS, durL, delayReveal } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";

const KEY = "lmxVisited";
const MIN_MS = 1600;

export function removePreloader() {
  const pre = document.querySelector("[data-preloader]");
  if (pre) pre.style.display = "none";
}

/** Starts the intro immediately; returns { finish } which completes the bar and runs open + dive. */
export function startPreloader() {
  const pre = document.querySelector("[data-preloader]");
  if (!pre) return null;
  const frame = document.querySelector("[data-hero-frame]");
  const items = pre.querySelectorAll("[data-pre-in]");
  const bar = pre.querySelector("[data-pre-bar]");

  let short = pre.dataset.preloader === "short";
  try { short = short || sessionStorage.getItem(KEY) === "1"; sessionStorage.setItem(KEY, "1"); } catch {}

  if (frame) gsap.set(frame, { scale: 0.75, transformOrigin: "50% 0%", z: 10 });
  const started = performance.now();
  const intro = gsap.timeline();

  if (short) { gsap.set([items, bar], { autoAlpha: 0 }); }
  else {
    run("ctn", items, "initial");
    intro.add(run("ctn", items, "reveal"))
         .fromTo(bar, { scaleX: 0 }, { scaleX: 0.85, duration: durL * 2, ease: "loadSurge" }, delayReveal);
  }

  return {
    async finish() {
      const wait = short ? 0 : Math.max(0, MIN_MS - (performance.now() - started));
      await new Promise((r) => setTimeout(r, wait));
      await intro;
      const out = gsap.timeline();
      if (!short) {
        out.to(bar, { scaleX: 1, duration: durS, ease: "Out" })
           .add(run("ctn", [...items, bar], "hide"));
      }
      out.fromTo(pre, { "--ap-w": "24vw", "--ap-y": "104vh" }, { "--ap-w": "36vw", "--ap-y": "15vh", duration: durL, ease: "InOut" })
         .to(pre, { "--ap-w": "125vw", "--ap-y": "-100vh", duration: durL, ease: "diveIn" });
      if (frame) out.to(frame, { scale: 1, duration: durL, ease: "diveIn" }, "<");   // same frames as the dive
      await out;
      pre.style.display = "none";
    },
  };
}
