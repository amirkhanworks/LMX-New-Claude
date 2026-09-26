import { ScrollTrigger } from "../core/tokens.js";

export function initVideos({ reduced }) {
  document.querySelectorAll("video[data-loop]").forEach((v) => {
    v.muted = true;                                // Safari requires the property, not only the attribute
    if (reduced) return;                           // poster only
    const play = () => v.play().catch(() => {});
    const pause = () => v.pause();
    ScrollTrigger.create({ trigger: v, start: "top bottom", end: "bottom top",
      onEnter: play, onEnterBack: play, onLeave: pause, onLeaveBack: pause });
  });
}
