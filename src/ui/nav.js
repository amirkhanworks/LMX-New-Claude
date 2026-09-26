import { lockScroll, unlockScroll } from "../core/scroll-lock.js";

export function initNav({ lenis }) {
  const btn = document.querySelector("[data-nav-toggle]");
  const sheet = btn && document.getElementById(btn.getAttribute("aria-controls"));
  if (!btn || !sheet) return;
  let open = false;
  const focusables = () => [btn, ...sheet.querySelectorAll('a[href], button:not([disabled])')];

  const set = (v, returnFocus = true) => {
    if (v === open) return;
    open = v;
    btn.setAttribute("aria-expanded", String(v));
    sheet.hidden = !v;
    document.body.classList.toggle("nav-open", v);
    v ? lockScroll(lenis) : unlockScroll(lenis);
    if (v) focusables()[1]?.focus(); else if (returnFocus) btn.focus();
  };

  btn.addEventListener("click", () => set(!open));
  sheet.addEventListener("click", (e) => { if (e.target.closest("a")) set(false, false); });
  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") { e.preventDefault(); set(false); return; }
    if (e.key !== "Tab") return;
    const f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  matchMedia("(min-width: 992px)").addEventListener("change", (m) => m.matches && set(false, false));
}
