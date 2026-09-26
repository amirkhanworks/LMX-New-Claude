import { gsap, ScrollTrigger, MQ } from "../core/tokens.js";

export function initRoomsTrack({ reduced }) {
  const area = document.querySelector("[data-hscroll]");
  if (!area || reduced) return;
  const track = area.querySelector("[data-hscroll-track]");
  const lines = area.querySelectorAll("[data-drift]");
  const dir = gsap.utils.wrap([-8, 8]);

  gsap.matchMedia().add(MQ.desk, () => {
    const size = () => { area.style.height = `${track.scrollWidth}px`; };
    size();
    ScrollTrigger.addEventListener("refreshInit", size);

    const tween = gsap.to(track, {
      x: () => -(track.scrollWidth - area.offsetWidth),
      ease: "horScroll",
      scrollTrigger: { trigger: area, start: "2.5% top", end: "97.5% bottom", scrub: 0.25, invalidateOnRefresh: true },
    });
    area._horizontalTween = tween;

    lines.forEach((l, i) => gsap.to(l, { x: `${dir(i)}vw`, ease: "none",
      scrollTrigger: { trigger: area, start: "top top", end: "bottom bottom", scrub: true } }));

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", size);
      area.style.height = "";
      area._horizontalTween = null;
    };
  });
}
