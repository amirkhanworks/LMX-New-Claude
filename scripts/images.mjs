import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const SRC = "assets-src/img", OUT = "public/img";
const WIDTHS = [640, 1024, 1600, 2400, 3840];
const HERO_BUDGET = 400 * 1024, CARD_BUDGET = 180 * 1024;

await fs.mkdir(OUT, { recursive: true });
await fs.mkdir(path.join(OUT, "team"), { recursive: true });
const manifest = {};

const graded = (file) => sharp(file).rotate().modulate({ brightness: 1.01, saturation: 0.97 });

for (const entry of await fs.readdir(SRC, { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(jpe?g|png|webp|tiff?|avif)$/i.test(entry.name)) continue;
  const file = path.join(SRC, entry.name);
  const name = path.parse(entry.name).name;
  const hash = crypto.createHash("sha1").update(await fs.readFile(file)).digest("hex").slice(0, 8);
  const base = `${name}-${hash}`;
  const { width, height } = await graded(file).toBuffer({ resolveWithObject: true }).then((r) => r.info);
  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.length) widths.push(width);

  for (const w of widths) {
    await graded(file).resize({ width: w }).avif({ quality: 50, effort: 6 }).toFile(`${OUT}/${base}-${w}.avif`);
    await graded(file).resize({ width: w }).webp({ quality: 72 }).toFile(`${OUT}/${base}-${w}.webp`);
  }
  const lqip = (await graded(file).resize({ width: 24 }).webp({ quality: 40 }).toBuffer()).toString("base64");
  manifest[name] = { file: base, width, height, widths, lqip: `data:image/webp;base64,${lqip}` };

  if (widths.includes(1600)) {
    const size = (await fs.stat(`${OUT}/${base}-1600.avif`)).size;
    const budget = name.startsWith("hero") ? HERO_BUDGET : CARD_BUDGET;
    if (size > budget) console.warn(`[budget] ${base}-1600.avif is ${Math.round(size / 1024)} KB (limit ${budget / 1024} KB)`);
  }
}

// Team headshots: single 800x800 WebP, stable names (not part of the responsive/manifest set).
for (const f of await fs.readdir(path.join(SRC, "team")).catch(() => [])) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  await sharp(path.join(SRC, "team", f)).rotate().resize(800, 800, { fit: "cover", kernel: "lanczos3" })
    .webp({ quality: 80 }).toFile(path.join(OUT, "team", `${path.parse(f).name}.webp`));
  console.log(`[images] team/${f} -> team/${path.parse(f).name}.webp (800x800)`);
}

await fs.writeFile(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`[images] ${Object.keys(manifest).length} responsive image(s) processed into manifest.json`);
