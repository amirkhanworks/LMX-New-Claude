import fs from "node:fs/promises";
import path from "node:path";

const DIR = process.argv[2] || "dist";
let fail = 0;
const placeholders = [];
const err = (f, m) => { console.error(`\u2717 ${f}: ${m}`); fail++; };

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(html|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

for (const file of await walk(DIR)) {
  const src = await fs.readFile(file, "utf8");
  const rel = path.relative(DIR, file);
  if (src.includes("\u2014")) err(rel, "em dash found");
  if (/across the GCC/i.test(src)) err(rel, '"across the GCC" (use "in the GCC")');
  if (/under an hour|\b2\s?km\+?/i.test(src)) err(rel, "unapproved claim (install time or LoRa range)");
  if (!file.endsWith(".html")) continue;

  const html = src.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err(rel, `expected exactly one <h1>, found ${h1}`);
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt=/.test(tag)) err(rel, `img without alt: ${tag.slice(0, 80)}`);
  for (const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(tag)) err(rel, `target=_blank without noopener: ${tag.slice(0, 80)}`);
  if (/(curtain|\bAC\b)[^<]{0,80}(live|available now)/i.test(html)) err(rel, "curtains/AC presented as live");
  for (const m of src.matchAll(/PLACEHOLDER[^<"\n]*/g)) placeholders.push(`${rel}: ${m[0].trim()}`);
}

if (placeholders.length) {
  console.log(`\nPLACEHOLDERS (${placeholders.length}), resolve before launch:`);
  placeholders.forEach((p) => console.log("  - " + p));
}
if (fail) { console.error(`\n${fail} content check(s) failed.`); process.exit(1); }
console.log("\n\u2713 content checks passed");
