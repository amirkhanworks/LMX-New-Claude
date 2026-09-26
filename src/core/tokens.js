import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, CustomEase };

export const BREAKPOINT = 992;
export const durS = 0.4, durM = 0.8, durL = 1.2;
export const stagger = 0.1, delayReveal = 0.3;

CustomEase.create("InOut", "0.75,0,0.25,1");
CustomEase.create("Out", "0.25,1,0.5,1");
CustomEase.create("In", "0.5,0,0.75,0");
CustomEase.create("Ease", "0.25,0.1,0.25,1");
CustomEase.create("diveIn", "0.6,0,0,1");
CustomEase.create("horScroll", "0.25,0,0.75,1");
// Preloader bar only: surges and settles.
CustomEase.create("loadSurge",
  "M0,0 C0.08,0.32 0.14,0.36 0.22,0.4 0.3,0.44 0.34,0.45 0.42,0.58 0.5,0.71 0.6,0.74 0.7,0.78 0.82,0.83 0.88,0.97 1,1");

export const MQ = {
  desk: `(min-width: ${BREAKPOINT}px) and (prefers-reduced-motion: no-preference)`,
  mob: `(max-width: ${BREAKPOINT - 1}px) and (prefers-reduced-motion: no-preference)`,
  reduce: "(prefers-reduced-motion: reduce)",
};
export const isReduced = () => window.matchMedia(MQ.reduce).matches;
