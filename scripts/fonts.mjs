import fs from "node:fs/promises";
import path from "node:path";

const OUT = "public/fonts";
const MAP = [
  ["node_modules/@fontsource-variable/space-grotesk/files", /-latin-wght-normal\.woff2$/, "space-grotesk-var.woff2"],
  ["node_modules/@fontsource/ibm-plex-sans/files", /-latin-300-normal\.woff2$/, "plex-sans-300.woff2"],
  ["node_modules/@fontsource/ibm-plex-sans/files", /-latin-400-normal\.woff2$/, "plex-sans-400.woff2"],
  ["node_modules/@fontsource/ibm-plex-sans/files", /-latin-600-normal\.woff2$/, "plex-sans-600.woff2"],
  ["node_modules/@fontsource/ibm-plex-mono/files", /-latin-500-normal\.woff2$/, "plex-mono-500.woff2"],
];

await fs.mkdir(OUT, { recursive: true });
for (const [dir, re, out] of MAP) {
  const hit = (await fs.readdir(dir)).find((f) => re.test(f));
  if (!hit) throw new Error(`[fonts] no match for ${re} in ${dir}`);
  await fs.copyFile(path.join(dir, hit), path.join(OUT, out));
  console.log(`[fonts] ${hit} -> ${out}`);
}
console.log("[fonts] done. Now run: npx fontpie public/fonts/space-grotesk-var.woff2 --name \"Space Grotesk\" (and the Plex files) to generate metric-matched fallback @font-face blocks for src/styles/fonts.css.");
