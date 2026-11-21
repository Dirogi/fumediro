import { describe, expect, it } from "vitest";
import { demoPricing } from "@/data/demoPricing";
import { perfumes } from "@/data/perfumes";
import { formatEUR, getDemoPrice } from "@/lib/money";

describe("demoPricing", () => {
  it("tiene precio para los 15 perfumes y ninguno de más", () => {
    expect(Object.keys(demoPricing).sort()).toEqual(perfumes.map((p) => p.id).sort());
  });

  it("son céntimos enteros positivos", () => {
    for (const c of Object.values(demoPricing)) expect(Number.isInteger(c) && c > 0).toBe(true);
  });

  it("coincide con los importes aprobados", () => {
    expect(demoPricing).toMatchObject({ aurelis: 13500, corallis: 13900, virelia: 14200, ion: 14500, orion: 17500, blush: 12500 });
  });
});

describe("formatEUR", () => {
  const norm = (s: string) => s.replace(/\s/g, " ");
  it("formatea en es-ES con euro", () => {
    expect(norm(formatEUR(13500))).toBe("135 €");
    expect(norm(formatEUR(14250))).toBe("142,50 €");
  });
  it("getDemoPrice devuelve undefined para ids desconocidos", () => {
    expect(getDemoPrice("aurelis")).toBe(13500);
    expect(getDemoPrice("coralis")).toBeUndefined();
  });
});
