# Build Prompt: Luminox Automation Website, Cinematic Rebuild (v2)

> **Two files, one contract.** This prompt defines *what* to build: content, brand, section concepts, rules. `LMX_Technical_Spec.md` defines *how*: architecture, module APIs, code, build and deploy. Put both in the repo root and read both before writing code. On content and copy, this prompt wins. On implementation details, the Technical Spec wins.

Build a **three-page marketing site for Luminox Automation**, a Mumbai IoT company with two separate business lines: a retrofit smart home product (B2C) and IoT engineering services (B2B). The site should feel like a film reel, not a brochure: **scroll is the medium**. Every section has its own scroll behaviour, its own entrance and its own matching exit.

Restraint over spectacle. The interface is **navy, paper and blue**, with amber used like a pilot light: small, rare, deliberate. The photography carries the warmth.

This prompt adapts a luxury real-estate scroll-choreography spec to Luminox's real brand, real product and real claims. Where this prompt and your instincts disagree, this prompt wins. Where this prompt marks something `PLACEHOLDER`, build the slot and leave it visibly marked; never invent the content.

---

## Step 0: Source of truth and non-negotiables

### 0.1 Existing files you will receive
`index.html`, `about.html`, `services.html`, `styles.css`, `script.js`, `logo-wordmark.svg`, `logo-icon.svg`, `logo-lockup.svg`, `fahad.png`, `saad.png`, `amir.png`, `README.md`.

Treat the existing HTML as the **copy and fact source**, not the design source. Rebuild everything from scratch. Carry over copy only where Step 3 allows it.

### 0.2 Engineering non-negotiables
1. **Desktop first, never broken on mobile.** Build in two phases (Technical Spec, Step 1). **Phase 1:** full desktop choreography behind a `992px` breakpoint with `gsap.matchMedia()`, plus a mobile *baseline*: below 992px every section stacks, reveals discretely and reads correctly, with no horizontal scroll, no snapping and no magnetic hover. **Phase 2:** mobile polish (the per-section "Mobile" notes in Step 10). Phase 1 must ship mobile-safe even before Phase 2 starts.
2. **Respect `prefers-reduced-motion`.** If on: do not initialise smooth scroll, do not scrub anything, set every reveal to its final state immediately, skip the preloader animation entirely.
3. **Real semantic HTML.** Every control is a `<button>` or `<a>`. Real `alt` on every content image. Exactly one `<h1>` per page.
4. **Nothing parked invisible.** Add `html.js` from an inline script in `<head>`; hidden reveal states are scoped under `.js`. If JS fails, all content is visible.
5. **Clean console, CLS 0, LCP under 2.5s on a throttled 4G mobile profile.**

### 0.3 Content non-negotiables (Luminox house rules)
1. **No em dashes anywhere in site copy.** Not in headings, labels, alt text, meta descriptions or button text. Use commas, colons or full stops.
2. **Never invent statistics, client counts, specs, dates, prices or quotes.** Anything unknown is a visible `PLACEHOLDER`.
3. **B2C and B2B stay separate.** Home and About speak to homeowners and renters. The Engineering page speaks to B2B clients. They link to each other; they never blend messaging.
4. **Curtains and AC automation are not live.** They may appear only with a visible "Coming soon" tag. Never give them a date. Never show them as working in copy, imagery or UI.
5. **Stock imagery shows atmosphere, never the product.** No stock photo may be presented as a Luminox device, installation, app screen or customer.

---

## Step 1: Stack (use exactly this, no substitutions)

- Vanilla HTML + CSS + JS modules, no framework. **Vite** for dev server and multi-page build.
- `npm i gsap lenis` : GSAP 3.13+ with ScrollTrigger, SplitText and CustomEase; Lenis 1.3+.
- Fonts self-hosted: `npm i @fontsource-variable/space-grotesk @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono` (or equivalent WOFF2 files in `/public/fonts`). No Google Fonts CDN.
- Dev-only: `sharp` for the image pipeline script (Step 12.2).
- **No WebGL, no canvas, no shader library.** Everything is `transform`, `opacity`, `clip-path`, `mask` and CSS custom properties. Inline SVG is allowed for icons, diagrams and the corner mark.

### 1.1 Project structure
```
/
  index.html
  about.html
  services.html          (keep this filename: it is already linked externally; nav label is "Engineering")
  privacy.html
  404.html
  vite.config.js         (multi-page: rollupOptions.input for all five pages; base: "/")
  /public
    /fonts  /img  /video  /svg   house-aperture.svg  favicon.svg  og-*.jpg  .htaccess  robots.txt  sitemap.xml
  /src
    main.js              (entry: imports and boots everything below)
    /core   tokens.js  lenis.js  theme.js  scroll-lock.js  motion-query.js
    /reveal primitives.js  groups.js
    /parallax parallax.js
    /ui     corner-mark.js  progress-rail.js  nav.js  accordion.js  tabs.js  video.js
    /sections  hero-dive.js  word-spread.js  rooms-track.js  controls-zoom.js  safe-curtains.js  renter-split.js  footer-close.js
               eng-hero.js  process-steps.js  team-cards.js
    /styles  tokens.css  base.css  type.css  components.css  sections.css
  /scripts  images.mjs  video.sh
```

---

## Step 2: Colour and type

### 2.1 Colour
Four roles plus one ink and one paper. These are Luminox's real brand colours mapped onto the cinematic system.

| Token | Hex | Role |
| --- | --- | --- |
| `--navy` | `#0D1D35` | Preloader ground, footer ground, side rails, dark sections. The "closed curtain" colour. |
| `--blue` | `#1A5CB8` | Large calm sections that host oversized display type (`data-bg="color"`). Paper type only on this ground. |
| `--amber` | `#E8B84B` | Accent only: active dots, the progress thumb and focus rings on dark/blue grounds, "Coming soon" pills (amber fill + ink text). **Never a section ground. Never text, hairlines or icons on paper** (contrast under 2:1). |
| `--red` | `#CC2222` | Form error text and error borders only. Nothing else. |
| `--paper` | `#FAFAF8` | Default page ground, and reversed-out type on navy and blue. |
| `--ink` | `#16213A` | All type on paper. Never pure black. |

Rules:
- Only two type colours exist: `--ink` on paper, `--paper` on navy and blue. **No greys.**
- Generate opacity ramps instead of extra colours: `--ink-60 #16213A99`, `--ink-30 #16213A4D`, `--ink-10 #16213A1A`, `--ink-05 #16213A0D`, and the same four for paper. Every hairline, muted label and disabled state is built from these.
- Contrast check at build time: ink on paper, paper on navy, paper on blue must pass WCAG AA at body size. Amber is allowed as text only on navy (9:1). On blue (3.5:1) it is limited to non-text marks: focus rings, the progress fill, dots. On paper it appears only as a fill behind ink text.

### 2.2 Type: three roles, no more
- **Display: Space Grotesk**, UPPERCASE, weight 500, `font-size: clamp(3rem, 12vw, 12rem)`, `letter-spacing: -0.035em`, `line-height: 0.9`, `text-wrap: balance`. Display type is *always* huge and *always* the only thing in its frame. There is no medium-sized display type on this site.
- **Signature: IBM Plex Mono.** This replaces the script role of the reference spec and is Luminox's "engineer's handwriting": coordinates, spec annotations, channel counts, a status line. Uppercase 500, 11 to 13px, `letter-spacing: 0.08em`. Used as annotation only, never as a heading, never for running copy. Example: `19.13° N, 72.83° E / MUMBAI`, `CH 01 TO 10 / HOT-SWAPPABLE`.
- **UI and body: IBM Plex Sans.** Micro-labels UPPERCASE 600 at 11 to 13px with `letter-spacing: 0.05em`. Running copy 400 at 16 to 18px, `line-height: 1.6`, max 62ch.

Font loading: preload the Space Grotesk and Plex Sans WOFF2 files, `font-display: swap`, and define metric-matched fallback `@font-face` rules with `size-adjust`, `ascent-override` and `descent-override` so the swap causes zero layout shift.

### 2.3 Logo rules (hard)
- The wordmark (`logo-wordmark.svg`) has dark lettering. **It only ever sits on paper.** On navy or blue it must sit inside a paper card. Never recolour it, never recreate it in live type.
- The icon (`logo-icon.svg`) is the brand presence in fixed UI (Step 7). It sits on a paper disc everywhere.
- `logo-lockup.svg` is not used.

### 2.4 Continuous theme swapping
Tag every section `data-bg="light" | "dark" | "color"`. Tag every piece of fixed UI (nav labels, scroll counter, progress rail, skip-to-top) with `data-theme`. One ScrollTrigger per section, `start: "top 50%"`, `end: "bottom 50%"`, `onToggle`, swaps fixed UI between `theme_on-light` / `theme_on-dark` / `theme_on-color` with a `durS` colour transition, so the UI stays legible over every ground without a visible flip.

---

## Step 3: Content truth ledger

Use only these facts. Copy may be rewritten for rhythm, but claims may not be added, strengthened or rounded.

### 3.1 Company
- Luminox Automation, Mumbai, India. Founded 2020.
- Patent-pending technology.
- Contact: `+91 96193 10901`, `info@luminoxautomation.com`, WhatsApp `https://wa.me/919619310901`, LinkedIn `https://www.linkedin.com/company/luminoxautomation/`.
- Vision: "To empower people with complete control over their homes through smart and reliable technology."
- Mission: "To make smart home automation affordable, easy to use, and accessible to everyone."

### 3.2 B2C product (Home and About pages)
- Retrofit system that installs behind the existing switchboard. No rewiring, no renovation.
- One visit, fully installed. Serving Mumbai and surrounding areas.
- **Live today:** lights, fans, LEDs (from the switchboard); TV and water pump (via smart socket).
- **Coming soon, tagged, no date:** curtains, AC.
- Control: app, voice, and the Keychain Remote (one press, no phone, no login, built for parents and grandparents who do not want an app).
- Accessories: temperature and humidity sensor; IR learning and blaster (marketed for TV remotes only).
- Modular: start with one room, add more later.
- Safety architecture: the main board is purely low-voltage; 240V never touches it. Relays are hot-swappable and configuration survives a relay swap.
- 2-year warranty.
- Rental-friendly: renters get their system relocated once a year at no extra cost. **This is Luminox's most defensible claim and gets its own section.**
- Data is encrypted and hosted securely on the cloud; never sold.
- **Live today, second product line:** Security and surveillance (smart cameras and sensors that alert you when something needs attention).
- Waiting list: **100+ on the Mumbai waiting list.**
- **Free installation across Mumbai.** Do not claim an installation time.
- Launch status line: **"Soft launching soon"** (as on the current site).

### 3.3 B2C testimonials (exactly two, never altered, combined or reattributed)
- **Zahid Shaikh, Andheri, Homeowner.** Use on the Keychain / family section.
- **Shrazil Khot, Bandra, Renter.** Use on the Renter section.
- Both quotes come from Luminox's **friends and family beta**. Use them verbatim, exactly as below:
  - Zahid: "The best part for us has been my grandparents. They can turn on the lights, fan, or AC with just their voice, without getting out of bed."
  - Shrazil: "I can turn my AC on before I even walk in the door, or check that my smart sockets are switched off when I'm out for the day. It's a small thing, but it's changed how I think about coming home."
- Attribution line format: `Andheri · Homeowner · Beta tester` and `Bandra · Renter · Beta tester`. Disclosure is required: these are early testers with a personal connection to the team, and India's advertising code (ASCI) expects material connections in endorsements to be disclosed.
- Because both quotes mention AC, place this note directly under each quote in Plex Sans 13px `--ink-60`: "AC control was part of our beta and is coming soon for all homes."
- No photos of the customers. Use a typographic monogram (initials in Space Grotesk on an `--ink-05` disc). **Never a stock face.**

### 3.4 B2B services (Engineering page)
- Positioning: "IoT Engineers by Trade."
- Six capabilities: Custom IoT Product Development; Smart Building Automation; Industrial IoT and Monitoring; PCB and Hardware Design; Cloud and Cellular Connectivity; AgriTech Sensor Solutions.
- Verified stats only: 6+ years in IoT engineering (since 2020); 2 delivered case studies; 2 markets served (India, GCC); 1 patent pending.
- Case study 1, delivered, GCC: **CamelX wearable biometric tracker**, client shown as "SurgIQ, Racing Camel Industry". Tracks ECG, SpO2, gait, GNSS speed, body temperature, RFID identity, live over cellular LTE. ESP32-S3, custom 4-layer PCB (KiCad), MQTT, live telemetry dashboard. Say "delivered in the GCC", **never "across the GCC"**.
- Case study 2, delivered, India: **IoT Soil Health Monitoring**. Solar-powered wireless sensor network over LoRa, ESP32, monitors soil moisture, NPK and pH, live dashboard with alerts. Do not state a range figure.
- Optional card 3, **in progress**, clearly tagged: canine health wearable for a US client. The client permits a public mention. Never count it as a delivered case study.
- Three engagement models: Project Engagement (fixed scope); Embedded Engineering Partner (retainer); Architecture and Consultation (standalone session). Each CTA opens WhatsApp with its existing prefilled text.
- B2B proof uses stats, never testimonial quotes.

### 3.5 Team (three active co-founders, in this order)
1. **Fahad Khan**, Founder and CEO. Electrical engineer; built the core hardware. `fahad.png` (see Step 12.4 on resolution). LinkedIn `https://www.linkedin.com/in/fahadkhan6432/`
2. **Saad Khan**, Founder and CPO. Mechanical and product design. `saad.png`. LinkedIn `https://www.linkedin.com/in/saad-khan-604374b7/`
3. **Amir Khan**, **Co-founder** (no CxO title). Bio: "Leads technology and business."  `amir.png`. LinkedIn `https://www.linkedin.com/in/amirkhanworks/`

Headshot filenames map to names as given; verify visually before launch.

### 3.6 Remove from the current site
- Any copy implying AC or curtain control works today (e.g. "check that the AC's off", "curtain motor" as an add-on).
- Emoji icons. Replace with a single line-icon set (Step 12.3).

---

## Step 4: Smooth scroll, wired exactly like this

```js
// src/core/lenis.js
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export let lenis = null;
export function initLenis(reduced) {
  if (reduced) return null;                              // no smooth scroll under reduced motion
  lenis = new Lenis({
    duration: 1.2, smoothWheel: true, touchMultiplier: 2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  lenis.on("scroll", ScrollTrigger.update);              // ScrollTrigger reads Lenis
  gsap.ticker.add((t) => lenis.raf(t * 1000));           // one rAF loop for the whole site
  gsap.ticker.lagSmoothing(0);                           // REQUIRED
  return lenis;
}
```

Non-optional details: `lagSmoothing(0)`; the exponential easing; **do not enable smooth touch** (native momentum on mobile).

Scroll lock (preloader, mobile nav, modals) measures the scrollbar width into `--sbw` and applies `padding-right: var(--sbw)` to `body` and to every fixed element, then calls `lenis.stop()`; unlock reverses both. Anchor links route through `lenis.scrollTo(target, { offset: 0 })` when Lenis exists.

---

## Step 5: Timing language (define once, never write a raw ease again)

```js
// src/core/tokens.js
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
gsap.registerPlugin(CustomEase);

export const BREAKPOINT = 992;
export const durS = 0.4, durM = 0.8, durL = 1.2;
export const stagger = 0.1, delayReveal = 0.3;

CustomEase.create("InOut",     "0.75,0,0.25,1");
CustomEase.create("Out",       "0.25,1,0.5,1");
CustomEase.create("In",        "0.5,0,0.75,0");
CustomEase.create("Ease",      "0.25,0.1,0.25,1");
CustomEase.create("diveIn",    "0.6,0,0,1");     // preloader aperture dive
CustomEase.create("horScroll", "0.25,0,0.75,1"); // horizontal rooms track
```

Every animation uses one of `durS / durM / durL` and one of these six eases, or `ease: "none"` for scrubbed tweens. No ad-hoc numbers.

---

## Step 6: The core mechanic: tall wrapper + CSS sticky. Never `pin: true`.

**The most important instruction in this prompt.** Every "the screen holds still while things happen" moment is an outer wrapper with an explicit height in viewport units, a child at `position: sticky; top: 0; height: 100vh` (use `100svh` with a `100vh` fallback), and one ScrollTrigger on the wrapper with `start: "top top"`, `end: "bottom bottom"` and `scrub`.

```css
.scroll-area         { position: relative; height: 340vh; }
.scroll-area__screen { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
```

**Do not use ScrollTrigger's `pin: true` anywhere.** Put `translateZ: 10` (via `gsap.set(el, { z: 10 })` or `transform: translateZ(10px)`) on every scaled or parallaxed layer. No ancestor of a sticky element may have `overflow: hidden`; use `overflow: clip` on the page wrapper instead.

**Hybrid rule, site-wide:** backgrounds, scale and clip scrub; **type never scrubs**. Text inside scrubbed sections fires discretely from `onEnter` / `onLeaveBack` using the reveal primitives.

---

## Step 7: Constant feedback: the rotating corner mark

A fixed mark in the top-left corner that **never stops spinning**, with speed and direction following scroll velocity.

**Design it for rotation.** A 72px (desktop) / 56px (mobile) paper disc. In the centre, `logo-icon.svg` at 28px, **static** (the house icon must never tilt). Around it, a circular text ring in IBM Plex Mono, 9px, 600, `letter-spacing: 0.2em`, ink: `LUMINOX AUTOMATION · MUMBAI · EST. 2020 ·` set on an SVG `<textPath>` around a circle. **Only the ring rotates.** The disc stays paper on every ground, which also keeps the logo rule (Step 2.3) intact. A hairline `--ink-10` outer stroke.

The mark is an `<a href="/" aria-label="Luminox Automation, home">`. The ring is `aria-hidden`.

Motion: idle 30 deg/sec. On scroll, tween `state.speed` to `dir * (30 + 10 * Math.abs(velocity))` over `durS * 0.75`; after 100ms of quiet, ease back to idle over `durL`. Advance the angle in `gsap.ticker` with `Math.min(delta, 100)` so it does not jump after a tab blur. Ignore programmatic scrolls until a real `wheel`, `touchmove` or `keydown` has happened. Under reduced motion the ring is static.

**Companions**, both driven by **one** document-wide ScrollTrigger that writes `--progress` (0% to 100%) to `:root`:
- A two-digit scroll counter bottom-left in Plex Mono: page progress 00 to 99, `padStart(2, "0")`.
- A draggable progress rail on the right edge (desktop only): 1px `--ink-30` track, thumb (ink on light grounds, amber on dark and blue) at `top: var(--progress)`, fill via `clip-path: inset(0 0 calc(100% - var(--progress)) 0)`. The thumb is a `<button aria-label="Scroll position">` supporting pointer drag and ArrowUp / ArrowDown. Dragging maps to `lenis.scrollTo(target, { duration: 3.2 })`: slow camera move, not a jump.

---

## Step 8: Preloader and the house-aperture reveal

Hold everything behind a full-screen navy curtain until fonts are loaded, the hero image is decoded and all ScrollTriggers are built. Then open a **house-shaped window** (the silhouette of a home: pitched roof over a tall body) that widens and lifts off the top of the screen. The metaphor: the door of your own home opening.

### 8.1 Aperture asset
`/public/svg/house-aperture.svg`: a single filled path, viewBox `0 0 560 1600`. Roof apex at top centre, eaves at y=280, straight walls to the bottom. White fill, no stroke. The tall body lets the aperture cover the full screen when scaled.

### 8.2 Four-layer composited CSS mask
```css
[data-preloader] {
  --ap-w: 36vw;
  --ap-h: calc(var(--ap-w) / (560 / 1600));   /* locked to the asset ratio */
  --ap-y: 100vh;
  position: fixed; inset: 0; z-index: 999; background: var(--navy);
  -webkit-mask-image: linear-gradient(#fff,#fff), linear-gradient(#fff,#fff), linear-gradient(#fff,#fff), url("/svg/house-aperture.svg");
          mask-image: linear-gradient(#fff,#fff), linear-gradient(#fff,#fff), linear-gradient(#fff,#fff), url("/svg/house-aperture.svg");
  mask-size:
    calc(50% - (var(--ap-w) / 2) + 2px) 100%,
    calc(var(--ap-w) + 4px) calc(var(--ap-y) + 2px),
    calc(50% - (var(--ap-w) / 2) + 2px) 100%,
    var(--ap-w) var(--ap-h);
  mask-position: left top, center top, right top, center var(--ap-y);
  mask-repeat: no-repeat;
  mask-mode: alpha;
}
```
Layers 1 to 3 cover everything except an aperture-width gap; layer 4 fills the house shape. Register `--ap-w` and `--ap-y` with `@property` (syntax `<length>`) so GSAP can tween them smoothly. Include `-webkit-` prefixes for every mask property.

Behind the aperture, two concentric house outlines (inline SVG, same path, `vector-effect: non-scaling-stroke`, 1px `--paper-30`), scaled with the same custom properties, offset 12px apart.

### 8.3 Timeline
1. Centre of the navy screen: a paper disc with `logo-icon.svg` scales in (`ctn` primitive), then the label `LUMINOX AUTOMATION` in Plex Sans 600 paper assembles with the `a` primitive. (Live type label, not a recreated wordmark.)
2. Plex Mono signature fades in beneath: `19.13° N, 72.83° E / MUMBAI`.
3. A loading bar (1px paper line, 18vw) fills on a **hand-drawn irregular CustomEase** so it surges and settles. Define it once as `CustomEase.create("loadSurge", "M0,0 C0.08,0.32 0.14,0.36 0.22,0.4 0.3,0.44 0.34,0.45 0.42,0.58 0.5,0.71 0.6,0.74 0.7,0.78 0.82,0.83 0.88,0.97 1,1")`. The bar completes only after the gate promise resolves (fonts + hero decode + triggers built); minimum total loader time 1.6s, maximum 3.5s.
4. Loader content exits with `hide` states.
5. **Open:** `--ap-w: 24vw → 36vw`, `--ap-y: 104vh → 15vh`, `durL`, `ease: "InOut"`.
6. **Dive:** `--ap-w → 125vw`, `--ap-y → -100vh`, `durL`, `ease: "diveIn"`.
7. Unlock scroll, `display: none` the preloader, fire `ScrollTrigger.refresh()`.

**Pre-set the hero image to `scale: 0.75` with `transformOrigin: "center top"` and animate it to `1` on the same frames as the dive, positioned at `"<"`.** One camera move, not two effects. Do not sequence them.

Store `sessionStorage.lmxVisited = "1"`. On a repeat visit in the same session, play only steps 5 to 7. Only the Home page gets the full loader; About, Engineering and Privacy get the short version on first load.

**LCP guard:** the hero `<img>` is in the DOM from first paint with `fetchpriority="high"`. The preloader must not delay its request, only cover it.

---

## Step 9: Site map and navigation

| Page | File | Audience | `<h1>` |
| --- | --- | --- | --- |
| Home | `index.html` | Homeowners, renters, families | Hero display line |
| About | `about.html` | Same, plus trust-seekers | "OUR STORY" |
| Engineering | `services.html` | B2B clients | "IOT ENGINEERS BY TRADE" |
| Privacy | `privacy.html` | Everyone | "PRIVACY" |
| 404 | `404.html` | Lost visitors | "WRONG ROOM" |

**Nav** (fixed, top-right, theme-swapped): `Home`, `About`, `Engineering`, and a primary `Request a Demo` button (paper fill on dark grounds, navy fill on light). Mobile: a `<button aria-expanded>` toggle opening a full-screen navy sheet with scroll lock, focus trap, `Esc` to close. The wordmark does not live in the nav; the corner mark carries the brand.

**Engineering page** keeps its top strip: "Looking for smart home automation for your own home? Go to our home pages →", so B2C visitors who land there are redirected.

---

## Step 10: Home page: nine sections, each with its own behaviour

Do **not** build one reveal component and reuse it as the section behaviour. That is exactly what makes a site feel templated. Reveal primitives (Step 11) handle type everywhere; the *section mechanic* is unique per section.

### 10.1 Hero: "the dive" (`data-bg="dark"`, wrapper `340vh`)
- **Background:** a warm, dusk-lit Indian apartment living room, lamps on, no people, no visible branded devices (Step 12.1). Full-bleed image with a 12% navy scrim gradient at the bottom for type legibility.
- **Content:** `<h1>` display, two lines: `THE HOME` / `YOU ALREADY HAVE`. Beneath, one line of Plex Sans 18px paper: "Made smart in a single visit. No rewiring, no renovation." Then the `Request a Demo` button and a Plex Mono ticker row: `PATENT-PENDING · ONE VISIT, FULLY INSTALLED · FREE INSTALLATION ACROSS MUMBAI · 100+ ON THE MUMBAI WAITING LIST`.
- **Mechanic:** inside the sticky screen, the content group lifts faster than the background (`yPercent: 0 → -60` on content vs `-15` on background), then the background scales `1 → 2` with `transformOrigin: "50% 75%"` so it reads as the camera flying *into* the room. Overlap the scale with the tail of the lift at `"-=0.2"`. Content opacity `1 → 0` over the last 30% of the lift.
- **Build gate:** `img.complete ? build() : img.addEventListener("load", build, { once: true })`, and `await img.decode()` before measuring.
- **Mobile:** wrapper `200vh`, no lift, background scales `1 → 1.4` only; content reveals discretely.

### 10.2 Statement: word-spacing spread (`data-bg="color"`, blue ground)
- **Content:** a single display line, the only thing in the frame: `NO REWIRING.`
- **Mechanic:** scrub `word-spacing` from `0rem` to `10rem` (`ease: "none"`, `start: "top bottom"`, `end: "bottom top"`, `scrub: 0.5`) so the phrase physically pulls itself apart as the section passes. Layout-triggering property, so: short line only, and **nothing else in this section animates**.
- Beneath, static (revealed once before the scrub zone), Plex Mono annotation: `INSTALLS BEHIND YOUR EXISTING SWITCHBOARD`.
- **Mobile:** `0 → 2rem`, same constraints.

### 10.3 "Every Room, Automated": horizontal track (`data-bg="light"`, desktop only)
- **Title block** (left of the track, first panel): display `EVERY ROOM,` / `AUTOMATED`. The two title lines counter-drift on X in alternating directions (`gsap.utils.wrap([-8, 8])` in `vw`), scrubbed.
- **Track panels**, each a portrait card (`aspect-ratio: 3/4`, 32vw wide) with a stock atmosphere photo, a Plex Sans 600 label and a Plex Mono annotation:
  1. Lights. `SWITCHBOARD / LIVE`
  2. Fans. `SWITCHBOARD / LIVE`
  3. LEDs. `SWITCHBOARD / LIVE`
  4. TV. `SMART SOCKET / LIVE`
  5. Water pump. `SMART SOCKET / LIVE`
  6. Security & surveillance. `CAMERAS + SENSORS / LIVE`
  7. Curtains. Amber pill **Coming soon**. `ROADMAP`
  8. AC. Amber pill **Coming soon**. `ROADMAP`
  9. Closing panel: "Start with one room. Add more whenever you are ready." + text link to Request a Demo.
  Coming-soon panels use a desaturated (CSS `filter: grayscale(0.6)`) version of their image so they read as "not yet".
- **Mechanic** (inside `gsap.matchMedia()` at `min-width: 992px`):
```js
const distance = track.scrollWidth - area.offsetWidth;
area.style.height = `${track.scrollWidth}px`;
ScrollTrigger.refresh();
const tween = gsap.to(track, { x: -distance, ease: "horScroll",
  scrollTrigger: { trigger: area, start: "2.5% top", end: "97.5% bottom", scrub: 0.25, invalidateOnRefresh: true } });
area._horizontalTween = tween;
```
  Recompute height on `ScrollTrigger.addEventListener("refreshInit")`. Anything revealed inside the track uses `containerAnimation: area._horizontalTween` and `start: "left bottom"`. Panel images reveal with the `slide` primitive (polygon wipe from the right).
- **Mobile:** vertical stack, two-column grid of shorter cards, `data-reveal-first` on the grid.

### 10.4 "Three ways in": zoom-through hand-off (`data-bg="light"` → reveals 10.5, wrapper `285vh`)
- **Content:** display `THREE WAYS IN`, then a 3-column grid of large cards: **App** ("Your whole home from anywhere."), **Voice** ("Ask, and it happens."), **Keychain Remote** ("One press. No phone, no login."). Each card: line icon, label, one sentence, and a Plex Mono annotation. Below the grid, two smaller accessory chips: Temperature & humidity sensor; IR learning & blaster (for TV remotes).
- **Mechanic:** the grid layer scales `1 → 2` with `transformOrigin` set to the centre of the **Keychain** card, while the layer above it fades `1 → 0` on the same frames, so section 10.5 is revealed *through* the Keychain card. Scrubbed, `ease: "none"`. Grid text fades out in the first 20% (discrete `hide`), before the scale reads.
- **Mobile:** no zoom; cards stack with `ctn` reveals.

### 10.5 Keychain Remote and family (`data-bg="dark"`, the receiver of 10.4)
- **Content:** display `ONE PRESS.` Then running copy: "For a parent or grandparent who does not want to learn an app. A single button on their keychain turns on the porch light, the fan, or a whole scene. No phone, no login, no learning curve." Then the **Zahid Shaikh** testimonial (Step 3.3) as a large pull-quote in Plex Sans 300 at 28 to 36px with the initials monogram, the attribution line and the AC note.
- **Visual:** an original line-drawn SVG illustration of the keychain remote (Step 12.3), paper strokes on navy, drawn in with `stroke-dashoffset` on reveal (discrete, not scrubbed). `PLACEHOLDER: swap for a real product photo when available.`
- **Mechanic:** static receiver. This section's behaviour is the arrival: its content reveals discretely only after the zoom-through completes (`onEnter` at `top 20%`). The quote uses the `p` primitive (line mask).

### 10.6 "Safe by Design": clip-path curtains as a camera (`data-bg="dark"`, wrapper `190vh`)
- **Content (revealed after the curtains open):** display `SAFE BY DESIGN`. Three short facts in a row, Plex Mono labels over Plex Sans sentences:
  - `LOW-VOLTAGE BRAIN` "240V never touches the main board."
  - `HOT-SWAPPABLE RELAYS` "Swap a relay and your settings stay put. No recalibration, no rewiring."
  - `2-YEAR WARRANTY` "Every installation is covered."
  Plus a Plex Mono line: `PATENT-PENDING`.
- **Background:** an original technical SVG diagram of the system (switchboard → relays → low-voltage main board → app, voice, keychain), paper lines on navy, full-bleed (Step 12.3).
- **Mechanic:** two background halves each carry a multi-point `clip-path: polygon()` aperture (left half opens from a vertical slit to full, right half mirrors it) that opens; then the whole frame scales `1 → 1.84` while two decorative motifs (hexagon outlines echoing the icon, `--paper-10`) push outward with `xPercent: ∓50`; the following section scales `0.75 → 1` from `transformOrigin: "center top"` to meet it. All values in percentages. **The most paint-expensive section: nothing else animates here.** Type reveals discretely at the midpoint.
- **Mobile:** single polygon wipe on the diagram, no scale.

### 10.7 Renters: "It moves with you" sticky split (`data-bg="light"`, scales in from 10.6)
- **Content:** left column (sticky, `top: 12vh`): display `IT MOVES` / `WITH YOU.` Right column (scrolls normally), four blocks with generous spacing:
  1. "Renting? Luminox installs without touching your walls or wiring."
  2. "Move homes and we relocate your system once a year, at no extra cost."
  3. "Start with one room. Take every room with you."
  4. The **Shrazil Khot** testimonial (Step 3.3), with attribution line and AC note.
- **Mechanic:** CSS sticky split. The left column holds while the right scrolls past it. A 1px `--ink-10` vertical rule between columns fills top to bottom via `clip-path` scrubbed to the section's progress (the only scrubbed element). Right-column blocks reveal with `ctn`, `data-reveal-first` not applied (only four items).
- **Background image:** a moving-day atmosphere photo (boxes in a bright empty apartment, no faces), `data-parallax="img-in"`, placed between blocks 2 and 3.
- **Mobile:** single column, left heading no longer sticky.

### 10.8 Bridge to Engineering: slide band (`data-bg="dark"`, normal height)
- A short band, visually distinct so it reads as a *different business line*, not part of the home story: Plex Mono label `FOR BUSINESSES`, display `IOT ENGINEERS` / `BY TRADE`, one sentence ("Custom hardware, firmware and cloud, from schematic to deployment."), and a link `Explore Engineering →` to `services.html`.
- **Mechanic:** a macro PCB photograph revealed with the `slide` primitive (4-point polygon wipe, child `scale 1.5 → 1`, `xPercent 25 → 0`). No scrub. This is the only full-section `slide` use on the Home page.

### 10.9 Final CTA and footer: the page closes on itself (CTA `data-bg="color"` on a navy footer)
- **CTA content** (blue ground, so the shrunken card reads clearly against the navy footer): display `READY?` Sentence: "One visit is all it takes. Tell us a bit about your home, and we will handle the rest." Two buttons side by side: `Request a Demo` (Typeform, new tab) and `Chat on WhatsApp`.
- **Waitlist block** (Step 13.2), current-site copy kept: heading "Be first to know", body "The Luminox app is on its way. Leave your email and we'll let you know the moment it's live." The app is on **iOS and Android**.
- **Footer** (navy, fixed behind the closing screen): content arranged in **two side rails** so it sits beside the shrunken card, never under it. Left rail: paper card with `logo-wordmark.svg`, then `Site` links (Home, About, Engineering, Privacy). Right rail: `Get in touch` (phone, email, WhatsApp, LinkedIn with an accessible label). Bottom strip: Plex Mono `LUMINOX AUTOMATION · MUMBAI · EST. 2020` and `© 2026 Luminox Automation. All rights reserved.`
- **Mechanic (desktop):** the CTA lives in a `200vh` close-area whose sticky screen holds `[data-page-clip]`, a full-screen CTA panel. As the close-area scrolls, the panel clips inward to a centred card, `inset(8% 22% 8% 22% round 24px)`, while `.footer-inner` scales `0.75 → 1` and fades in behind it. Clip and scale **scrub**; footer text fires **discretely** on `onEnter` / `onLeaveBack`. Full code in Technical Spec 11.9.
  Why not clip the whole document: with native scroll, percentage insets on a 15,000px-tall page cannot frame a card inside the viewport. Clipping the final sticky screen produces the intended "page closes on itself" read.
- **Mobile:** no clip effect. The CTA is a normal section and the footer is in normal flow.

---

## Step 10B: Engineering page (`services.html`)

Tone: more restrained and technical than Home. Blue and navy grounds dominate; photography is macro hardware and field environments.

1. **Hero** (`data-bg="dark"`, normal height): `<h1>` display `IOT ENGINEERS` / `BY TRADE`. Sentence: "Custom IoT products and industrial systems, engineered end to end: hardware, firmware and cloud." Plex Mono stats row: `6+ YEARS · 2 DELIVERED CASE STUDIES · 2 MARKETS: INDIA, GCC · 1 PATENT PENDING`. Background PCB macro revealed by an **iris**: `clip-path: circle(0% at 50% 50%) → circle(75% at 50% 50%)`, `durL`, `ease: "Out"`, fired once on load.
2. **Six capabilities** (`data-bg="light"`): a 3×2 grid, each with line icon, title, one line. `data-reveal-first` on the grid. Hover (desktop): `--ink-05` fill and a 2px `--blue` underline on the title.
3. **How we deliver** (`data-bg="color"`, wrapper `400vh`): sticky step-through of Discover, Architect, Build, Test & Deploy, Hand Over. A horizontal 5-segment rail at the top fills via scrubbed `clip-path`; step titles and copy swap **discretely** at each 20% boundary (`hide` outgoing, `reveal` incoming). Closing line: "One team. One point of accountability. No handoffs between contractors." Mobile: plain ordered list with `ctn` reveals.
4. **Why clients choose Luminox** (`data-bg="light"`): four points, carried from the current page, with "delivered across the GCC" corrected to "delivered in the GCC".
5. **Case studies** (`data-bg="dark"`): accordion cards built as `<button aria-expanded aria-controls>`, height animated with GSAP (`durM`, `InOut`) using measured `scrollHeight`, content revealed with `ctn`. Each card: status tag (`Delivered` or `In progress`), market tag, title, one-line summary; expanded: Client, Challenge, What We Built, Outcome, Tech Spec table. Card images: CamelX uses a desert or camel-racing atmosphere photo; Soil Health uses a farm field / soil close-up. `data-parallax="img"` on each.
6. **What we work with** (`data-bg="light"`): grouped tech chips (from the current page). No animation beyond one `ctn` per group.
7. **How we engage** (`data-bg="light"`): three cards, each CTA to its prefilled WhatsApp link.
8. **FAQ** (`data-bg="light"`): accordion, same component as 5.
9. **CTA + footer:** display `LET'S SCOPE IT.` WhatsApp button (`Get in Touch`) + `Back to Home`. Same page-close footer mechanic as Home.

---

## Step 10C: About page (`about.html`)

1. **Hero** (`data-bg="light"`): `<h1>` display `OUR STORY`. Story paragraph (below) with the `p` primitive. Plex Mono meta row: `FOUNDED 2020 · PATENT-PENDING · 100+ ON THE MUMBAI WAITING LIST · SOFT LAUNCHING SOON`.
   Story copy (rewrite of the current version, three founders): "Luminox began with Fahad Khan, an electrical engineer who wanted to bring real smart home automation to Indian homes without the cost and hassle of rewiring. Saad Khan joined early to shape the product's design. Amir Khan came on board to lead technology and business. Today the three of them are building both the smart home product and Luminox's engineering services."
2. **Vision and Mission** (`data-bg="color"`): two statements, each in Plex Sans 300 at 32 to 44px (not display type; display is reserved for 2 to 4 word lines). The Vision reveals, then on further scroll the Mission replaces it in the same frame (sticky wrapper `200vh`, discrete swap at 50%).
3. **Team** (`data-bg="light"`): three cards in the order of Step 3.5. Each portrait sits in a `data-parallax="w"` frame with `data-parallax="img-in"` and is revealed with a **vertical** polygon wipe (bottom to top, distinct from the horizontal `slide`). Portraits are rendered in a consistent duotone treatment (CSS `filter: grayscale(1) contrast(1.05)` plus a `mix-blend-mode: multiply` paper overlay) so three differently shot headshots read as one set. Name in Plex Sans 600, role in Plex Mono, one-line bio, LinkedIn icon link with `aria-label="Fahad Khan on LinkedIn"` etc.
4. **FAQ** (`data-bg="light"`): two tabs, `Before You Buy` / `After You Buy`, built as a real ARIA tablist (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, roving `tabindex`, Left/Right/Home/End keys). Panels contain accordions. Carry over the current FAQ copy **minus** anything referencing curtains or AC as available, and with the installation-time and free-installation claims tagged `PLACEHOLDER` until confirmed.
5. **CTA + footer:** same as Home 10.9, without the waitlist block.

---

## Step 11: The reveal system: six primitives, three states, one attribute

Six functions with the signature `(elements, state, delay)` where state is `"reveal" | "hide" | "initial"`. Markup opts in with `data-reveal="<key>"`. **Every primitive has a mirrored exit in the opposite direction**, so scrolling back up feels like rewinding, not re-triggering.

| Attribute | Split | Reveal | Hide (opposite) |
| --- | --- | --- | --- |
| `a` | chars | `opacity 0→1, rotateX 90→0, x 10rem→0`, origin center bottom | `rotateX -90, x -10rem`, origin center top |
| `h` | words, chars | `opacity 0→1, yPercent 50→0, rotateY 90→0` | `yPercent -50, rotateY -90` |
| `p` | lines, words, `mask: "lines"` | `yPercent 110→0` behind the line mask | `yPercent -110` |
| `ctn` | none | `opacity 0→1, y 3.33rem→0` | `opacity 0` |
| `line` | none | `clip-path inset(0 0 100% 0) → inset(0)` | `inset(100% 0 0 0)` |
| `slide` | none | 4-point polygon wipe + child `scale 1.5→1, xPercent 25→0` | reverse wipe, `xPercent -25` |

- Split with SplitText `autoSplit: true` and an `onSplit` that re-applies the current state, so line splits survive resize and font swap. Wait for `document.fonts.ready` before the first split.
- Reveal: `durL`, `ease: "Out"`, `stagger`. Hide: `durS`, `ease: "In"`. Exits are faster than entrances.
- **Group by wrapper:** collect all `[data-reveal]` inside their nearest `[data-reveal="w"]` ancestor; one ScrollTrigger per group, `start: "top 85%"`, so a heading and its paragraph stagger together.
- **Cap the stagger in lists:** mark repeating blocks `data-reveal-first`, group by parent, and strip `data-reveal` from every sibling after the first.
- `once: true` on reveal triggers **except** where a mirrored exit is required on scroll-back (display headings and section intros): those use `onEnter` → reveal, `onLeaveBack` → hide.
- SplitText output spans get `aria-hidden="true"`; the original element keeps an `aria-label` with its full text.

---

## Step 12: Assets

### 12.1 Stock photography and video (Pexels, Unsplash)
Use free-licence libraries (Pexels, Unsplash). Before shipping, re-check each licence page and save the source URL of every asset in `/public/img/CREDITS.md` even where attribution is not required.

**Rules:**
- Atmosphere only. Never present stock as a Luminox device, installation, app, customer or team member.
- **No identifiable faces** anywhere on B2C pages. Hands and silhouettes at a distance are fine.
- **No visible third-party smart home hardware**: smart speakers, branded hubs, touch-panel switches or anyone's app on screen. These would misrepresent the product or show a competitor's.
- Prefer images that read as Indian urban homes: compact apartments, ceiling fans, warm tungsten lamps, balconies, monsoon light. Avoid Western suburban houses.
- Colour-grade every photo for consistency: slight warm lift in highlights, navy-leaning shadows. Apply at export in the image script, not with CSS filters.

**Shot list (search terms):**
- Hero: "apartment living room evening lamps", "cozy Indian living room night".
- Rooms track: "ceiling fan", "warm pendant light", "LED strip ceiling", "living room TV evening", "rooftop water tank" or "water pump", "home security camera wall" (unbranded, no screen UI), "sheer curtains window light", "split AC unit wall" (the last two are coming-soon panels).
- Renters: "moving boxes empty apartment", "bright empty room keys".
- Engineering: "PCB macro", "circuit board close up", "desert racing camel", "farm field soil sensor", "soil close up hands" (hands only).

**Video is texture, never narrative.** 3 to 6s silent loops of movement in a place: a ceiling fan turning, a sheer curtain in a breeze, city lights at dusk, monsoon rain on a window. No people. Use in at most two places: the 10.5 background at 30% opacity, and one inline loop in 10.7 between blocks. Never in 10.2 or 10.6, where nothing else may animate.
- Ship both MP4/H.264 and WebM/VP9, max 1600px wide, under 1.2 MB each. Encode with `scripts/video.sh` (ffmpeg, `-an`, CRF 28 H.264 / CRF 36 VP9, `-movflags +faststart`).
- `muted playsinline loop preload="metadata"`, **no `autoplay`**, always a `poster`. Start and stop from a ScrollTrigger with `onEnter` / `onEnterBack` / `onLeave` / `onLeaveBack` calling `v.play().catch(() => {})` and `v.pause()`. Under reduced motion, never play; show the poster.

### 12.2 Image pipeline
`scripts/images.mjs` (sharp): from masters in `/assets-src/`, output widths `640 / 1024 / 1600 / 2400 / 3840` in AVIF (quality 50) and WebP (quality 72), plus a 32px blurred LQIP as a base64 CSS background on the frame. Target **under 400 KB at 1600px for hero-class images**, under 180 KB for cards. Emit a JSON manifest; a tiny helper writes `<picture>` markup with `srcset`, `sizes`, explicit `width` / `height`.
- Hero only: `fetchpriority="high"`, `loading="eager"`, preloaded via `<link rel="preload" as="image" imagesrcset=... imagesizes=...>`.
- Everything below the second viewport: `loading="lazy" decoding="async"`.
- **Reveal images with geometry, not opacity**, and vary the geometry by section: polygon wipe (rooms track), slide (bridge), iris (Engineering hero), vertical wipe (team), scale `1.15 → 1` (case studies).

### 12.3 Original illustration and icons (no stock illustrations)
- **Icons:** one open-licence line set only (Lucide or Phosphor, "light" weight), inlined as SVG, `stroke: currentColor`, 1.5px. Replaces every emoji on the current site.
- **Product and system visuals:** hand-authored SVG technical drawings in a single style (1px strokes, square caps, Plex Mono callout labels, 8px grid), built from the spec in Step 3.2:
  - `keychain-remote.svg`: keychain fob with a single button and a ring.
  - `system-diagram.svg`: switchboard → relay bank (CH 01 to 10) → low-voltage main board (labelled MIC, SPEAKER, IR, BLE) → three control paths (App, Voice, Keychain). A dashed boundary labelled `240V` stays on the relay side only.
  - `board-outline.svg`: simplified board face used as a decorative motif.
  Each gets `role="img"` and a descriptive `<title>`. Mark each `PLACEHOLDER: replace with real product photography when available` in a code comment only.
- No generic stock illustrations (flat people, isometric scenes). They clash with the photographic system.

### 12.4 Headshots
- Current files are inconsistent: `fahad.png` is 284×284 and pre-cropped to a circle; `saad.png` and `amir.png` are 800×800. Ship all three at 800×800 minimum. Use the current `fahad.png` for now, upscaled into the 800×800 frame with the duotone treatment masking softness. Swap for a higher-resolution original when it is supplied (not a launch blocker).
- Normalise with the duotone treatment in 10C.3 so they read as a set. Real `alt`: "Portrait of Fahad Khan, Founder and CEO" etc.

### 12.5 Open Graph
Three 1200×630 `og-*.jpg` images (Home, About, Engineering): navy ground, paper card with the wordmark, one display line. Titles and descriptions per page, no em dashes.

---

## Step 13: Forms and integrations

### 13.1 Request a Demo (primary B2C CTA)
Every `Request a Demo` control is an `<a href="https://form.typeform.com/to/ywDES3IY" target="_blank" rel="noopener">` with a visually hidden "(opens in a new tab)". No embed.

Typeform plan: confirmed fine as is. Note for later: Typeform's free plan stops collecting after 10 responses a month; revisit if demo volume grows.

### 13.2 App waitlist ("Be first to know")
Implementation: **Formspree** (the endpoint slot already exists in the current site), submitted inline with `fetch` so the visitor never leaves the page.
- A native `<form>` with a labelled `<input type="email" required autocomplete="email">`, a hidden `source=website-waitlist` field, a honeypot field `_gotcha`, and a `<button>`.
- States: idle, submitting (button disabled, `aria-busy`), success (inline message in an `aria-live="polite"` region: "You are on the list."), error (inline message in `--red` with a WhatsApp fallback link).
- Consent line under the field: "We will only email you about the Luminox app launch. See our Privacy page."
- Form ID left blank for now: `action="https://formspree.io/f/FORMSPREE_FORM_ID"`. Until a real ID is set, the script shows the WhatsApp fallback instead of submitting (Technical Spec 10.8). `PLACEHOLDER: FORMSPREE_FORM_ID` stays in the launch checklist.
- Full code in Technical Spec 10.8.

### 13.3 WhatsApp
All WhatsApp links use `https://wa.me/919619310901` with URL-encoded prefilled text per context (demo, fixed-scope quote, retainer, consultation, general). `target="_blank" rel="noopener"`.

### 13.4 Privacy page
Required because the site collects emails. Plain page covering: what is collected (waitlist email, form submissions via Typeform and Formspree), why, who processes it, retention, how to request deletion (email address), contact. A complete draft is in Technical Spec Step 14. `PLACEHOLDER: Amir to approve the final wording.`

### 13.5 Analytics
None by default. `PLACEHOLDER: decide on analytics (e.g. privacy-friendly, cookieless).` If added later, load it after the preloader completes.

---

## Step 14: Parallax primitives

Five attribute-driven variants, all `ease: "none"`, all with `translateZ: 10`, all wrapped in `gsap.matchMedia()` so they **rebuild on breakpoint change**:

```
[data-parallax="img"]      yPercent -15 → 15   start "top bottom", scrub 0.5
[data-parallax="img-out"]  yPercent   0 → 20   start "bottom bottom", end "bottom top", scrub 0.5
[data-parallax="img-in"]   yPercent -20 → 0    start "top bottom", end "bottom bottom", scrub true
[data-parallax="ctn-down"] yPercent -10 → 10   start "top 125%", end "bottom -25%", scrub 0.5
[data-parallax="ctn-up"]   yPercent  10 → -10  start "top 125%", end "bottom -25%", scrub 0.5
```

Each element resolves its trigger from `el.closest('[data-parallax="w"]')`. Parallax images are sized 130% of their frame height so movement never exposes an edge. Per-element opt-out with `data-desk="off"` / `data-mob="off"`. Never inside a section already running a scrubbed mechanic (10.2, 10.6).

---

## Step 15: Accessibility

- Reduced-motion branch: no smooth scroll, no scrub, no preloader animation, no video playback, every `[data-reveal]` in final state, corner ring static, sticky wrappers collapsed to `height: auto`.
- Exactly one `<h1>` per page; sections use `<h2>` / `<h3>` in order. Display lines that are purely decorative repeats get `aria-hidden`.
- `alt=""` + `aria-hidden="true"` on decorative images and all SplitText spans.
- Tabs, accordions, nav toggle and progress thumb are `<button>` elements with `aria-expanded` / `aria-selected` / `aria-controls` and arrow-key support where applicable.
- Visible `:focus-visible` ring: 2px `--ink` with 2px `--paper` offset on light grounds; 2px `--amber` with 2px `--navy` offset on dark and blue grounds.
- Skip link to `#main` as the first focusable element on every page.
- `Esc` closes the mobile nav and any open overlay; focus returns to the trigger.
- Space, PageDown, PageUp, Home and End all work; the custom rail is supplementary.
- **No section snapping.**
- `lang="en-IN"` on `<html>`.

---

## Step 16: Performance and hosting

- **Budgets:** JS under 110 KB gzipped total (GSAP core + ScrollTrigger + SplitText + CustomEase + Lenis + site code); CSS under 30 KB; fonts: 3 WOFF2 files, subset to Latin.
- Kill all ScrollTriggers and SplitText instances on `matchMedia` revert (`gsap.matchMedia()` context cleanup handles this; verify).
- Throttle-test on a mid-range Android profile (4x CPU slowdown, Fast 4G).
- **Hosting target: GoDaddy shared hosting (Economy), Apache.** `npm run build` produces static `/dist`; deploy by uploading `/dist` contents to `public_html`. Include in `/public/.htaccess`:
  - `ErrorDocument 404 /404.html`
  - Long-cache headers (`max-age=31536000, immutable`) for hashed assets in `/assets/`, `/img/`, `/video/`, `/fonts/`; `no-cache` for `.html`
  - Gzip via `mod_deflate` for text types (Brotli if the host supports it)
  - Force HTTPS redirect
  - Correct MIME types for `.avif`, `.webp`, `.webm`, `.woff2`
- `robots.txt` and `sitemap.xml` for the five pages. Canonical URLs on `https://luminoxautomation.com/`.

---

## Step 17: Acceptance checks (verify every one before you finish)

**Motion**
- [ ] Scroll top to bottom at speed: no jitter, no boundary snap, no layout shift.
- [ ] Corner ring spins faster on a flick, reverses on scroll-up, eases back to idle about 1s after stopping; the house icon in the centre never rotates.
- [ ] Preloader: house aperture opens, widens, dives off the top, and the hero scale resolves on the same frames, not after.
- [ ] Second visit in the same session plays only the short loader.
- [ ] Scroll back up through every section: everything exits in the opposite direction it entered.
- [ ] No two sections on the same page share a section mechanic.
- [ ] Resize mid-page across 992px: line splits re-split, parallax and the rooms track rebuild, footer switches between clip mode and flow mode.
- [ ] Safari (macOS and iOS): masks render with `-webkit-` prefixes, videos play, no resampling artefacts during scale.

**Accessibility and resilience**
- [ ] Reduced motion on: page fully readable, nothing moves, all content visible.
- [ ] JS disabled: all content visible, all links work.
- [ ] Keyboard-only pass: every control reachable, focus always visible, tabs and accordions operable by keys, `Esc` closes overlays.
- [ ] Lighthouse accessibility 100; axe DevTools zero violations.

**Performance**
- [ ] LCP under 2.5s on the hero (throttled mobile), CLS 0, clean console.
- [ ] Hero image under 400 KB at 1600px.

**Content truth**
- [ ] Zero em dashes in any rendered text, alt text or meta tag (grep the build for `—`).
- [ ] Curtains and AC appear only with a "Coming soon" tag and no date.
- [ ] Exactly two testimonials, verbatim, attributed with "Beta tester" and the AC note, no photos.
- [ ] Exactly two delivered case studies; any in-progress card is labelled as such.
- [ ] No stock image shows a face, a branded smart device, or anything presented as the Luminox product.
- [ ] Wordmark appears only on paper grounds or inside a paper card.
- [ ] Three co-founders in the order Fahad, Saad, Amir; Amir titled "Co-founder" only.
- [ ] Amber never appears as text, hairline or icon on a paper ground, and never as text on blue.
- [ ] No installation-time claim and no LoRa range figure anywhere.
- [ ] Every `PLACEHOLDER` is listed in `README.md` under "Before launch".

---

## Step 18: Deliverables

1. The complete Vite project, building cleanly with `npm run build`.
2. `README.md` with: run and build commands, deploy steps for GoDaddy, the asset credits file location, and a **"Before launch"** checklist of every `PLACEHOLDER` in the codebase.
3. `/public/img/CREDITS.md` with the source URL of every stock asset.
4. A short `MOTION.md` mapping each section to its mechanic, wrapper height and triggers, so future edits do not accidentally duplicate a behaviour.

All imagery, copy, brand marks and typefaces must be original, Luminox-owned or openly licensed. Do not reproduce any other company's name, logo, product imagery or site design.
