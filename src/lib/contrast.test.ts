import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";

// Los tokens se leen de globals.css para detectar deriva entre CSS y test.
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const token = (name: string) => {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!m) throw new Error(`Token --color-${name} no encontrado`);
  return m[1]!;
};

describe("contrastRatio", () => {
  it("negro/blanco = 21 y es simétrico", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 5);
  });
});

describe("pares de tokens de texto (AA ≥ 4.5)", () => {
  const pairs: [string, string][] = [
    ["ivory", "charcoal"],
    ["ivory", "graphite"],
    ["silver", "charcoal"],
    ["silver", "graphite"],
    ["champagne", "charcoal"],
    ["charcoal", "champagne"], // texto del botón primario
  ];
  it.each(pairs)("%s sobre %s", (fg, bg) => {
    expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });
});
