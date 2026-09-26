import { gsap, durL } from "../core/tokens.js";
import { onDocScroll } from "../core/doc-scroll.js";

const IDLE = 30;           // deg/s
const RAMP = 0.3;          // s, speed-up tween
const QUIET_MS = 100;      // settle delay
const MAX = 720;           // deg/s cap
const VEL = 1 / 100;       // px/s -> spec "velocity" units

export function initCornerMark({ reduced }) {
  const ring = document.querySelector("[data-corner-ring]");
  if (!ring || reduced) return;
  const state = { speed: IDLE };
  let angle = 0, armed = false, quiet = 0;

  const arm = () => { armed = true; };
  ["wheel", "touchmove", "keydown"].forEach((t) => addEventListener(t, arm, { passive: true }));

  const rotate = gsap.quickSetter(ring, "rotation", "deg");
  gsap.ticker.add((_, delta) => {
    angle = (angle + (state.speed * Math.min(delta, 100)) / 1000) % 360;
    rotate(angle);
  });

  onDocScroll((self) => {
    if (!armed) return;
    const v = self.getVelocity() * VEL;
    if (Math.abs(v) < 0.01) return;
    const target = Math.sign(v) * Math.min(MAX, IDLE + 10 * Math.abs(v));
    gsap.to(state, { speed: target, duration: RAMP, ease: "Out", overwrite: true });
    clearTimeout(quiet);
    quiet = setTimeout(() => gsap.to(state, { speed: IDLE, duration: durL, ease: "Out", overwrite: true }), QUIET_MS);
  });
}
