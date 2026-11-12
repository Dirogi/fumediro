import { describe, expect, it } from "vitest";
import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import {
  getCollectionBySlug,
  getCollectionOfPerfume,
  getPerfumeBySlug,
  getPerfumesByCollection,
} from "@/lib/catalog";

const EXPECTED: Record<string, string[]> = {
  voltara: ["ion", "pulse", "solaris"],
  "flora-arcana": ["aurelis", "coralis", "virelia"],
  cosmora: ["aurora", "eclipse", "orion"],
  prismatica: ["amethys", "aureon", "chroma"],
  thermae: ["blush", "glacier", "terra"],
};

describe("catálogo V1", () => {
  it("tiene 5 colecciones y 15 perfumes", () => {
    expect(collections).toHaveLength(5);
    expect(perfumes).toHaveLength(15);
  });

  it("cada colección contiene exactamente los 3 perfumes de PRODUCT.md", () => {
    for (const c of collections) {
      expect(c.perfumeIds).toEqual(EXPECTED[c.slug]);
      expect(getPerfumesByCollection(c.id).map((p) => p.slug)).toEqual(EXPECTED[c.slug]);
    }
  });

  it("IDs y slugs son únicos", () => {
    for (const list of [collections, perfumes]) {
      expect(new Set(list.map((x) => x.id)).size).toBe(list.length);
      expect(new Set(list.map((x) => x.slug)).size).toBe(list.length);
    }
  });

  it("las referencias son válidas y mutuamente coherentes", () => {
    const ids = new Set(perfumes.map((p) => p.id));
    for (const c of collections) {
      for (const id of c.perfumeIds) expect(ids.has(id)).toBe(true);
    }
    for (const p of perfumes) {
      expect(getCollectionOfPerfume(p)?.perfumeIds).toContain(p.id);
    }
  });

  it("usa CORALIS y excluye frascos y textos prohibidos", () => {
    const text = JSON.stringify([collections, perfumes]).toLowerCase();
    expect(getPerfumeBySlug("coralis")?.name).toBe("CORALIS");
    expect(text).not.toContain("corallis");
    expect(text).not.toContain("maison");
    for (const s of ["arc", "nymphea-nox", "nebula", "spectra", "ember"]) {
      expect(getPerfumeBySlug(s)).toBeUndefined();
    }
  });

  it("los campos opcionales ausentes no rompen los helpers", () => {
    const aurelis = getPerfumeBySlug("aurelis");
    expect(aurelis?.olfactoryFamily).toBeUndefined();
    expect(aurelis && getCollectionOfPerfume(aurelis)?.slug).toBe("flora-arcana");
  });

  it("slugs desconocidos devuelven undefined", () => {
    expect(getCollectionBySlug("nope")).toBeUndefined();
    expect(getPerfumeBySlug("nope")).toBeUndefined();
  });
});
