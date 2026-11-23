import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import type { FragranceFamily, Perfume } from "@/lib/types";

export interface CatalogQuery {
  collection?: string;
  family?: FragranceFamily;
  /** `name` = A–Z; ausente = orden editorial. */
  sort?: "name";
}

type SearchParams = Record<string, string | string[] | undefined> | URLSearchParams;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const read = (params: SearchParams, key: string) =>
  params instanceof URLSearchParams ? (params.get(key) ?? undefined) : first(params[key]);

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
  const collection = read(params, "collection");
  const family = read(params, "family");
  const query: CatalogQuery = {};
  if (read(params, "sort") === "name") query.sort = "name";
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

/** Query string canónica (sin `?`) de lo que la UI expone: colección y orden. `family` no se serializa. */
export const serializeCatalogQuery = ({ collection, sort }: CatalogQuery) => {
  const sp = new URLSearchParams();
  if (collection) sp.set("collection", collection);
  if (sort) sp.set("sort", sort);
  return sp.toString();
};

/** Filtra y ordena sin mutar la lista de entrada. */
export function applyCatalogQuery(list: Perfume[], query: CatalogQuery): Perfume[] {
  const result = filterPerfumes(list, query);
  return query.sort === "name" ? result.sort((a, b) => a.name.localeCompare(b.name, "es")) : result;
}
