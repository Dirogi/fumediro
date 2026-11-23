import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import type { Collection, Perfume } from "@/lib/types";

export const getCollections = (): Collection[] => collections;
export const getPerfumes = (): Perfume[] => perfumes;

export const getCollectionBySlug = (slug: string) =>
  collections.find((c) => c.slug === slug);

export const getPerfumeBySlug = (slug: string) =>
  perfumes.find((p) => p.slug === slug);

export const getPerfumesByCollection = (collectionId: string): Perfume[] =>
  perfumes.filter((p) => p.collectionId === collectionId);

export const getCollectionOfPerfume = (perfume: Perfume) =>
  collections.find((c) => c.id === perfume.collectionId);

export const getPerfumeSlugs = (): string[] => perfumes.map((p) => p.slug);
export const getCollectionSlugs = (): string[] => collections.map((c) => c.slug);

/** Colecciones contiguas en el orden del catálogo, de forma circular. */
export const getAdjacentCollections = (slug: string) => {
  const i = collections.findIndex((c) => c.slug === slug);
  if (i < 0) return undefined;
  const n = collections.length;
  const prev = collections[(i - 1 + n) % n];
  const next = collections[(i + 1) % n];
  return prev && next ? { prev, next } : undefined;
};

/** Hermanos de la misma colección, en orden estable y sin el propio perfume. */
export const getRelatedPerfumes = (perfume: Perfume, limit = 2): Perfume[] =>
  getPerfumesByCollection(perfume.collectionId)
    .filter((p) => p.id !== perfume.id)
    .slice(0, limit);
