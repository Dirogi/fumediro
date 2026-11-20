import { describe, expect, it } from "vitest";
import { collections } from "@/data/collections";
import { collectionContent } from "@/data/collectionContent";
import { perfumes } from "@/data/perfumes";

// Correspondencia confirmada (PRODUCT.md §4 + aprobación): FLORA ARCANA no tiene subtecnología.
const TECHNOLOGY: Record<string, string | undefined> = {
  voltara: "LumaCore™",
  "flora-arcana": undefined,
  cosmora: "Nebula Chamber™",
  prismatica: "PrismaLayer™",
  thermae: "ThermaSkin™",
};

const words = (s: string) => s.trim().split(/\s+/).length;

describe("collectionContent", () => {
  it("tiene una entrada por colección, con las mismas claves que los ids", () => {
    expect(Object.keys(collectionContent).sort()).toEqual(collections.map((c) => c.id).sort());
  });

  it.each(collections.map((c) => [c.id] as const))("%s: summary y concept válidos", (id) => {
    const c = collectionContent[id]!;
    expect(c.summary.trim()).toBe(c.summary);
    expect(c.summary.length).toBeGreaterThan(0);
    expect(words(c.concept)).toBeGreaterThanOrEqual(50);
    expect(words(c.concept)).toBeLessThanOrEqual(80);
  });

  it("la tecnología conceptual corresponde a la aprobada (y FLORA ARCANA no tiene)", () => {
    for (const c of collections) {
      const tech = collectionContent[c.id]?.technology;
      expect(tech?.name).toBe(TECHNOLOGY[c.id]);
      if (tech) expect(tech.description.length).toBeGreaterThan(0);
    }
  });

  it("el concepto nombra exactamente los tres perfumes de su colección y ninguno de otra", () => {
    for (const c of collections) {
      const text = collectionContent[c.id]!.concept;
      for (const p of perfumes) {
        const mentioned = new RegExp(String.raw`\b${p.name}\b`).test(text);
        expect(mentioned, `${c.id} / ${p.name}`).toBe(p.collectionId === c.id);
      }
    }
  });

  it("no menciona otras colecciones, «Maison», precios ni cifras", () => {
    for (const c of collections) {
      const content = collectionContent[c.id]!;
      const all = [content.summary, content.concept, content.technology?.name, content.technology?.description].join(" ");
      for (const other of collections.filter((o) => o.id !== c.id)) expect(all).not.toContain(other.name);
      expect(all).not.toMatch(/maison|€|\$|\d/i);
    }
  });
});

describe("experiencias interactivas", () => {
  it("cada colección tiene un tipo de experiencia distinto (las cinco del catálogo)", () => {
    const types = collections.map((c) => c.experienceType).sort();
    expect(new Set(types).size).toBe(5);
    expect(types).toEqual(["botanical-explorer", "led-light", "optical-slider", "particle-chamber", "thermal-reactive"]);
  });
});
