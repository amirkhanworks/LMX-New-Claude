const GATE_MAX_MS = 3500;

function heroReady() {
  const img = document.querySelector("[data-hero-img]");
  if (!img) return Promise.resolve();
  const decode = () => img.decode().catch(() => {});
  if (img.complete) return decode();
  return new Promise((res) => {
    img.addEventListener("load", () => decode().then(res), { once: true });
    img.addEventListener("error", res, { once: true });
  });
}

/** Resolves when fonts are loaded and the hero image is decoded, or after GATE_MAX_MS. */
export function gate() {
  const all = Promise.all([document.fonts.ready, heroReady()]);
  const cap = new Promise((res) => setTimeout(res, GATE_MAX_MS));
  return Promise.race([all, cap]);
}
