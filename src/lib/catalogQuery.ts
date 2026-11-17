import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import type { FragranceFamily, Perfume } from "@/lib/types";

export interface CatalogQuery {
  collection?: string;
  family?: FragranceFamily;
}

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Opciones de filtro derivadas de los datos reales; nunca opciones vacías. */
export const getFilterOptions = () => ({
  collections: collections.map((c) => ({ slug: c.slug, name: c.name })),
  families: [...new Set(perfumes.flatMap((p) => (p.olfactoryFamily ? [p.olfactoryFamily] : [])))].sort((a, b) =>
    a.localeCompare(b, "es"),
  ),
});

/** Solo acepta valores presentes en el catálogo; cualquier otro se ignora. */
export function parseCatalogQuery(params: SearchParams): CatalogQuery {
  const options = getFilterOptions();
  const collection = first(params.collection);
  const family = first(params.family);
  const query: CatalogQuery = {};
  if (collection && options.collections.some((c) => c.slug === collection)) query.collection = collection;
  const known = options.families.find((f) => f === family);
  if (known) query.family = known;
  return query;
}

export function filterPerfumes(list: Perfume[], query: CatalogQuery): Perfume[] {
  const collectionId = query.collection ? collections.find((c) => c.slug === query.collection)?.id : undefined;
  return list.filter(
    (p) => (!query.collection || p.collectionId === collectionId) && (!query.family || p.olfactoryFamily === query.family),
  );
}
