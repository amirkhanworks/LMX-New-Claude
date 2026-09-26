# Motion map

One row per section. Check this before adding a new scroll behaviour — the whole point of the cinematic build is that no two sections share a mechanic.

| Page | Section | Mechanic | Wrapper height | Module |
| --- | --- | --- | --- | --- |
| Home | Hero | Dive: content lift + background scale 1&#8594;2 | 340vh (200vh mobile) | `sections/hero-dive.js` |
| Home | No rewiring | `word-spacing` scrub, 0&#8594;10rem | flow (~100vh) | `sections/word-spread.js` |
| Home | Every room, automated | Horizontal track, height = track width | height = track scrollWidth | `sections/rooms-track.js` |
| Home | Three ways in | Zoom-through hand-off, grid scale 1&#8594;2 | 285vh | `sections/controls-zoom.js` |
| Home | One press (keychain) | Static receiver; SVG stroke draw-in; testimonial | flow | `ui/draw.js` (no section module) |
| Home | Safe by design | Clip-path curtains open, frame scale 1&#8594;1.84 | 190vh | `sections/safe-curtains.js` |
| Home | It moves with you (renters) | Sticky split + rule clip-path scrub | flow | `sections/renter-split.js` |
| Home | Bridge to Engineering | `slide` polygon wipe, no scrub | flow | reveal primitive only |
| Home | Ready + footer | Final-screen clip-path close | 200vh | `sections/close.js` |
| Engineering | Hero | Iris: `circle(0%)&#8594;circle(75%)` | flow | `sections/eng-hero.js` |
| Engineering | Six capabilities | `ctn` reveal, `data-reveal-first` on grid | flow | reveal primitive only |
| Engineering | How we deliver | Step-swap, 5 steps + rail fill | calc(5 &#215; 80vh) | `sections/step-swap.js` |
| Engineering | Why clients choose | `ctn` reveal, `data-reveal-first` | flow | reveal primitive only |
| Engineering | Case studies | Accordion + `data-img-scale` (1.15&#8594;1) | flow | `ui/accordion.js`, `sections/img-scale.js` |
| Engineering | What we work with | `ctn` reveal per group | flow | reveal primitive only |
| Engineering | How we engage | `ctn` reveal per card | flow | reveal primitive only |
| Engineering | FAQ | Accordion | flow | `ui/accordion.js` |
| Engineering | CTA + footer | Same page-close as Home | 200vh | `sections/close.js` |
| About | Hero | `p` line-mask reveal | flow | reveal primitive only |
| About | Vision / Mission | Step-swap, 2 items, no rail | 200vh | `sections/step-swap.js` |
| About | Team | Vertical polygon wipe + `img-in` parallax | flow | `sections/team.js` |
| About | FAQ | ARIA tabs (Before/After) + accordions inside | flow | `ui/tabs.js`, `ui/accordion.js` |
| About | CTA + footer | Same page-close as Home, no waitlist | 200vh | `sections/close.js` |

## Fixed UI (all pages)
- Corner mark: velocity-driven rotation &#8212; `ui/corner-mark.js`
- Progress counter + draggable rail &#8212; `ui/progress.js`
- Preloader: house-aperture mask open/dive &#8212; `ui/preloader.js`
- Theme swap (`theme_on-light/dark/color` on fixed UI) &#8212; `core/theme.js`, one ScrollTrigger per `[data-bg]` section

## Rule reminder
Backgrounds, scale and clip **scrub**. Type **never** scrubs &#8212; it fires discretely via the reveal primitives (`reveal/primitives.js`), even inside a scrubbed section.
