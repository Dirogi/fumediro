import { describe, expect, it } from "vitest";
import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import {
  getCollectionBySlug,
  getAdjacentCollections,
  getCollectionOfPerfume,
  getCollectionSlugs,
  getPerfumeBySlug,
  getPerfumeSlugs,
  getRelatedPerfumes,
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

describe("helpers de rutas y navegación", () => {
  it("los slugs estáticos coinciden con el catálogo (15 y 5, únicos)", () => {
    expect(getPerfumeSlugs()).toHaveLength(15);
    expect(getCollectionSlugs()).toHaveLength(5);
    expect(new Set(getPerfumeSlugs()).size).toBe(15);
    expect(getPerfumeSlugs()).toEqual(perfumes.map((p) => p.slug));
  });

  it("colecciones adyacentes: circulares y nunca la propia", () => {
    const slugs = getCollectionSlugs();
    for (const [i, slug] of slugs.entries()) {
      const adj = getAdjacentCollections(slug);
      expect(adj?.prev.slug).toBe(slugs[(i + 4) % 5]);
      expect(adj?.next.slug).toBe(slugs[(i + 1) % 5]);
      expect(adj?.next.slug).not.toBe(slug);
    }
    expect(getAdjacentCollections("nope")).toBeUndefined();
  });

  it("perfumes relacionados: hermanos de colección, sin el propio y con orden estable", () => {
    const solaris = getPerfumeBySlug("solaris")!;
    expect(getRelatedPerfumes(solaris).map((p) => p.slug)).toEqual(["ion", "pulse"]);
    expect(getRelatedPerfumes(solaris, 1).map((p) => p.slug)).toEqual(["ion"]);
    for (const p of perfumes) {
      const rel = getRelatedPerfumes(p);
      expect(rel).toHaveLength(2);
      expect(rel.every((r) => r.collectionId === p.collectionId && r.id !== p.id)).toBe(true);
    }
  });
});
