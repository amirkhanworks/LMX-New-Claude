# Luminox Automation — Cinematic Rebuild

Vanilla HTML/CSS/JS, GSAP + ScrollTrigger + SplitText + CustomEase, Lenis smooth scroll, Vite build. See `LMX_Build_Prompt_v2.md` (content and section concepts) and `LMX_Technical_Spec.md` (architecture and code contract) in the repo root for the full spec this project implements. See `MOTION.md` for the section-to-mechanic map.

## Status: all 4 batches complete (Phase 1: desktop + mobile baseline)

**Batch 1 — Tooling & shell:** `package.json`, `vite.config.js` (multi-page), `plugins/picture.js`, self-hosted fonts, design tokens/base/type CSS, core boot modules (`tokens.js`, `lenis.js`, `scroll-lock.js`, `gate.js`, `doc-scroll.js`, `theme.js`), all 5 page shells, Privacy page copy.

**Batch 2 — Motion primitives:** reveal system (`reveal/primitives.js`, `reveal/groups.js` — the six primitives `a`/`h`/`p`/`ctn`/`line`/`slide`), parallax (`parallax/parallax.js`), corner mark, progress rail/counter, preloader (house-aperture CSS mask + open/dive timeline).

**Batch 3 — Home page:** nav/accordion/tabs/video/draw/waitlist components, all 9 Home sections each with a distinct mechanic (hero dive, word-spacing spread, horizontal rooms track, zoom-through hand-off, keychain receiver, safe-by-design curtains, renter sticky-split, engineering bridge, final CTA/footer close), two original SVG illustrations, stopgap placeholder photography.

**Batch 4 — Engineering + About + launch prep:**
- Engineering page (`services.html`): iris hero, six capabilities grid, step-swap "how we deliver" process (5 steps + rail fill), why-us grid, three case-study accordions (CamelX delivered/GCC, Soil Health delivered/India, Canine in-progress/US) with `data-img-scale`, tech-stack chips, three engagement-model cards, FAQ accordion, CTA/footer close
- About page (`about.html`): hero with real founding story, vision/mission step-swap, three team cards with real 800&#215;800 headshots (vertical wipe + parallax), FAQ as two real ARIA tabs (Before/After You Buy, carried over from the original site's copy) with accordions inside, CTA/footer close (no waitlist)
- Real image pipeline (`scripts/images.mjs`) run against your uploaded headshots &#8594; `public/img/team/{fahad,saad,amir}.webp`, genuine 800&#215;800 processed photos, not placeholders
- Two new placeholder photos for the case studies (`case-camelx.jpg`, `case-soil.jpg`), generated the same way as Batch 3's set
- Three real OG images generated (`og-home.jpg`, `og-about.jpg`, `og-engineering.jpg`) and wired into all three pages' meta tags
- `robots.txt`, `sitemap.xml`, `.htaccess` (GoDaddy/Apache-ready, HTTPS redirect, cache headers, correct MIME types)
- `scripts/check-content.mjs`: build-time QA — fails the build on an em dash, "across the GCC", an installation-time or LoRa-range claim, a missing `<img alt>`, a `target="_blank"` without `rel="noopener"`, curtains/AC presented as live, or more/fewer than one `<h1>` per page; lists every `PLACEHOLDER` as a warning (not a failure) so the build still succeeds
- `MOTION.md` and `public/img/CREDITS.md` (Step 18 deliverables)

**`npm run build` passes end to end**: all 5 pages, ~64 KB gzipped JS (well under the 110 KB budget), 0 content-check failures, 9 flagged placeholders (all listed below).

## What's genuinely NOT done (by design, not oversight)
- **Real photography and video.** Every non-team photo on the site is a generated placeholder (flat navy/paper JPG stamped with what to search for). See `public/img/CREDITS.md` for the exact sourcing workflow: drop a real master into `/assets-src/img/` under the matching name, run `npm run images`, delete the placeholder of the same name. No video loops exist at all yet (optional, per Build Prompt Step 12.1).
- **Mobile polish (Phase 2).** The build ships mobile-*safe* (every section stacks, reads, and has no horizontal overflow or sticky traps at 375&#8211;768px), but the per-section "Mobile" refinements described throughout Build Prompt Step 10 (counter-drift on the rooms track, a lighter renters layout, etc.) haven't been hand-tuned or device-tested yet.
- **Fallback font metrics, Formspree ID, and the privacy-page content placeholders** — see the checklist below.

## Commands
```bash
npm install            # already run in this environment
npm run dev             # local dev server
npm run build            # production build + content QA (fails on a real issue, warns on PLACEHOLDERs)
npm run images           # (re)run the real image pipeline against /assets-src/img
npm run fonts             # re-copy font files from node_modules if needed
npm run video             # encode /assets-src/video masters (once ffmpeg + real clips exist)
node scripts/dev-placeholder-images.mjs   # regenerate the stopgap placeholder JPGs (delete this script once real photos are in)
```

## Before launch
- [ ] Source real photography (13 slots) and video (optional, 2 slots) — see `public/img/CREDITS.md` for the exact list and workflow
- [ ] `FORMSPREE_FORM_ID` for the waitlist form (`index.html`, and `src/ui/waitlist.js`'s `configured` check will pick it up automatically once set)
- [ ] Fallback font metric overrides in `src/styles/fonts.css` (run `npx fontpie` per the comment in that file, so the font swap causes zero layout shift)
- [ ] Privacy page: publish date, analytics stance, data-retention periods, grievance contact name (4 placeholders in `privacy.html`)
- [ ] About page FAQ: confirm whether a typical installation time can be stated (1 placeholder)
- [ ] Higher-resolution Fahad headshot (current source is 284&#215;284, upscaled; not a launch blocker — swap the file in `assets-src/img/team/` and rerun `npm run images`)
- [ ] Register the domain's DNS/hosting per Technical Spec Step 15 (GoDaddy shared hosting + Cloudflare) and run the Step 15.2 deploy checklist
- [ ] Run the manual test matrix (Technical Spec 16.2): Safari mask rendering, reduced motion, JS-disabled, keyboard-only, screen reader pass
- [ ] Mobile polish pass (Phase 2) on a real throttled Android profile
