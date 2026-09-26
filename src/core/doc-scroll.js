import { ScrollTrigger } from "./tokens.js";

const subs = new Set();
let st = null;

export function onDocScroll(fn) {
  subs.add(fn);
  if (!st) st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => subs.forEach((f) => f(self)) });
  return () => subs.delete(fn);
}
