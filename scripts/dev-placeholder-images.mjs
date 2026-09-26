// TEMPORARY dev stopgap for Batch 3, so the site has something to render and
// build with before real stock photography is sourced. Produces flat, labelled
// placeholder JPGs directly (no responsive widths, no AVIF, no manifest) — this
// is NOT the real image pipeline described in the Build Prompt Step 12.2 / the
// Technical Spec's scripts/images.mjs, which lands in Batch 4 once real masters
// exist in /assets-src/img. Safe to delete once that pipeline is producing
// real derivatives.
import sharp from "sharp";
import fs from "node:fs/promises";

const OUT = "public/img";
await fs.mkdir(OUT, { recursive: true });

const NAVY = "#0D1D35", PAPER = "#FAFAF8", INK = "#16213A";

const slots = [
  { name: "hero-living-room", w: 1600, h: 1000, label: "apartment living room, evening lamps" },
  { name: "room-lights",      w: 960,  h: 1280, label: "ceiling fan / warm pendant light" },
  { name: "room-fans",        w: 960,  h: 1280, label: "ceiling fan" },
  { name: "room-leds",        w: 960,  h: 1280, label: "LED strip ceiling" },
  { name: "room-tv",          w: 960,  h: 1280, label: "living room TV, evening" },
  { name: "room-water-pump",  w: 960,  h: 1280, label: "rooftop water tank / pump" },
  { name: "room-security",    w: 960,  h: 1280, label: "home security camera, unbranded" },
  { name: "room-curtains",    w: 960,  h: 1280, label: "sheer curtains, window light" },
  { name: "room-ac",          w: 960,  h: 1280, label: "split AC unit, wall" },
  { name: "moving-boxes",     w: 960,  h: 1200, label: "moving boxes, empty apartment" },
  { name: "pcb-macro",        w: 1600, h: 1000, label: "PCB macro / circuit board close up" },
  { name: "case-camelx",      w: 1200, h: 900,  label: "desert / racing camel, GCC" },
  { name: "case-soil",        w: 1200, h: 900,  label: "farm field / soil sensor close up" },
];

function svg(w, h, label) {
  return Buffer.from(`
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${NAVY}"/>
          <stop offset="1" stop-color="${INK}"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#g)"/>
      <text x="50%" y="46%" fill="${PAPER}" font-family="monospace" font-size="${Math.round(w / 34)}"
            text-anchor="middle" opacity="0.85">PLACEHOLDER</text>
      <text x="50%" y="54%" fill="${PAPER}" font-family="monospace" font-size="${Math.round(w / 52)}"
            text-anchor="middle" opacity="0.6">${label.replace(/&/g, "&amp;")}</text>
    </svg>`);
}

for (const s of slots) {
  await sharp(svg(s.w, s.h, s.label)).jpeg({ quality: 70 }).toFile(`${OUT}/${s.name}.jpg`);
  console.log(`[placeholder] ${s.name}.jpg (${s.w}x${s.h})`);
}
