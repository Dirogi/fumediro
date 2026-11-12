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
