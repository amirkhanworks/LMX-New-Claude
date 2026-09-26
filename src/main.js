import "./styles/index.css";
import { ScrollTrigger, isReduced } from "./core/tokens.js";
import { initLenis } from "./core/lenis.js";
import { lockScroll, unlockScroll } from "./core/scroll-lock.js";
import { gate } from "./core/gate.js";
import { initTheme } from "./core/theme.js";
import { initReveals } from "./reveal/groups.js";
import { initParallax } from "./parallax/parallax.js";
import { initCornerMark } from "./ui/corner-mark.js";
import { initProgress } from "./ui/progress.js";
import { startPreloader, removePreloader } from "./ui/preloader.js";
import { initNav } from "./ui/nav.js";
import { initAccordions } from "./ui/accordion.js";
import { initTabs } from "./ui/tabs.js";
import { initVideos } from "./ui/video.js";
import { initDraw } from "./ui/draw.js";
import { initWaitlist } from "./ui/waitlist.js";
import { initHeroDive } from "./sections/hero-dive.js";
import { initWordSpread } from "./sections/word-spread.js";
import { initRoomsTrack } from "./sections/rooms-track.js";
import { initControlsZoom } from "./sections/controls-zoom.js";
import { initSafeCurtains } from "./sections/safe-curtains.js";
import { initRenterSplit } from "./sections/renter-split.js";
import { initClose } from "./sections/close.js";
import { initEngHero } from "./sections/eng-hero.js";
import { initStepSwap } from "./sections/step-swap.js";
import { initTeam } from "./sections/team.js";
import { initImgScale } from "./sections/img-scale.js";

const html = document.documentElement;
const staticMode = !html.classList.contains("js");   // inline fallback already fired (see page <head>)
window.__lmxBooted = true;
const reduced = staticMode || isReduced();

async function boot() {
  const lenis = initLenis(reduced);
  const ctx = { lenis, reduced };

  // Components that must work regardless of motion.
  initNav(ctx); initAccordions(ctx); initTabs(ctx); initWaitlist(ctx); initVideos(ctx);

  if (reduced) {
    removePreloader();
    html.classList.remove("is-booting");
    initTheme();
    initProgress(ctx);
    return;
  }

  lockScroll(lenis);
  const preloader = startPreloader();          // intro plays while we gate
  await gate();

  // Section mechanics first (they create tweens reveals may reference as
  // containerAnimation), then reveals, then parallax — per Technical Spec 5.7.
  initHeroDive(ctx); initWordSpread(ctx); initRoomsTrack(ctx); initControlsZoom(ctx);
  initSafeCurtains(ctx); initRenterSplit(ctx); initClose(ctx);
  initEngHero(ctx); initStepSwap(ctx); initTeam(ctx); initImgScale(ctx); initDraw(ctx);
  initReveals(ctx);
  html.classList.remove("is-booting");
  initParallax(ctx);
  initTheme();
  initProgress(ctx);
  initCornerMark(ctx);
  ScrollTrigger.refresh();

  await preloader?.finish();
  unlockScroll(lenis);
  document.dispatchEvent(new CustomEvent("lmx:ready"));
}

boot().catch((err) => {
  // Fail open: content visible, scroll unlocked, error reported once.
  console.error("[lmx] boot failed", err);
  html.classList.remove("js", "is-booting");
  removePreloader();
  document.body.classList.remove("is-locked");
});
