import { gsap, MQ } from "../core/tokens.js";
import { run } from "../reveal/primitives.js";
import { setTheme } from "../core/theme.js";

export function initControlsZoom({ reduced }) {
  const area = document.querySelector("[data-zoom]");
  if (!area || reduced) return;
  const over = area.querySelector("[data-zoom-over]");
  const grid = area.querySelector("[data-zoom-grid]");
  const focus = area.querySelector("[data-zoom-focus]");
  const text = area.querySelectorAll("[data-zoom-text]");

  // Layout offsets, unaffected by transforms, so refresh never measures a scaled grid.
  const origin = () => {
    const x = ((focus.offsetLeft + focus.offsetWidth / 2) / grid.offsetWidth) * 100;
    const y = ((focus.offsetTop + focus.offsetHeight / 2) / grid.offsetHeight) * 100;
    return `${x}% ${y}%`;
  };

  gsap.matchMedia().add(MQ.desk, () => {
    let textOut = false;
    gsap.set(grid, { z: 10 });
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
      trigger: area, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true,
      onUpdate: ({ progress: p }) => {
        if (p > 0.2 && !textOut) { textOut = true; run("ctn", text, "hide"); }
        else if (p <= 0.2 && textOut) { textOut = false; run("ctn", text, "reveal"); }
        setTheme(p > 0.6 ? "dark" : "light");
      },
    } });
    tl.fromTo(grid, { scale: 1, transformOrigin: origin }, { scale: 2, duration: 1 }, 0)
      .fromTo(over, { opacity: 1 }, { opacity: 0, duration: 1 }, 0);
  });
}
