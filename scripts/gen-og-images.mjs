import sharp from "sharp";
import fs from "node:fs/promises";

const NAVY = "#0D1D35", PAPER = "#FAFAF8", INK = "#16213A";

const pages = [
  { file: "og-home", line: "THE HOME YOU ALREADY HAVE" },
  { file: "og-about", line: "OUR STORY" },
  { file: "og-engineering", line: "IOT ENGINEERS BY TRADE" },
];

function svg(line) {
  return Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="${NAVY}"/>
      <rect x="90" y="90" width="300" height="90" rx="12" fill="${PAPER}"/>
      <text x="240" y="145" fill="${INK}" font-family="Arial, sans-serif" font-weight="700" font-size="34"
            text-anchor="middle" letter-spacing="1">LUMINOX</text>
      <text x="90" y="420" fill="${PAPER}" font-family="Arial, sans-serif" font-weight="700" font-size="64"
            letter-spacing="-1">${line}</text>
      <text x="90" y="560" fill="${PAPER}" fill-opacity="0.6" font-family="monospace" font-size="22"
            letter-spacing="2">LUMINOX AUTOMATION &#183; MUMBAI &#183; EST. 2020</text>
    </svg>`);
}

await fs.mkdir("public", { recursive: true });
for (const p of pages) {
  await sharp(svg(p.line)).jpeg({ quality: 82 }).toFile(`public/${p.file}.jpg`);
  console.log(`[og] ${p.file}.jpg`);
}
