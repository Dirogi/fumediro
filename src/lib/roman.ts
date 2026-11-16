const STEPS: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** Numeral romano para índices editoriales (1–39). */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 39) throw new RangeError(`Numeral romano fuera de rango: ${n}`);
  let out = "";
  for (const [value, symbol] of STEPS) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}
