import { describe, expect, it } from "vitest";
import { getCollections, getPerfumeBySlug } from "@/lib/catalog";
import { formPerfumeSlugs, universeLines } from "./story";

describe("contenido de /historia", () => {
  it("hay una frase por colección y ninguna sobra", () => {
    expect(Object.keys(universeLines).sort()).toEqual(getCollections().map((c) => c.id).sort());
  });

  it("los perfumes del capítulo II existen y son de colecciones distintas", () => {
    const found = formPerfumeSlugs.map((s) => getPerfumeBySlug(s));
    expect(found.every(Boolean)).toBe(true);
    expect(new Set(found.map((p) => p?.collectionId)).size).toBe(3);
  });

  it("los textos no usan «Maison»", () => {
    expect(JSON.stringify(universeLines)).not.toMatch(/maison/i);
  });
});
