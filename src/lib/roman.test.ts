import { describe, expect, it } from "vitest";
import { toRoman } from "@/lib/roman";

describe("toRoman", () => {
  it("convierte los índices de las cinco colecciones", () => {
    expect([1, 2, 3, 4, 5].map(toRoman)).toEqual(["I", "II", "III", "IV", "V"]);
  });

  it("cubre casos con sustracción y decenas", () => {
    expect([9, 14, 19, 38, 39].map(toRoman)).toEqual(["IX", "XIV", "XIX", "XXXVIII", "XXXIX"]);
  });

  it("rechaza valores fuera de rango o no enteros", () => {
    for (const bad of [0, -1, 40, 2.5, NaN]) expect(() => toRoman(bad)).toThrow(RangeError);
  });
});
