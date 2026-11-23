import type { MetadataRoute } from "next";
import { getCollectionSlugs, getPerfumeSlugs } from "@/lib/catalog";
import { collectionPage, perfumePage, routes } from "@/lib/routes";
import { SITE_URL } from "@/lib/seo";

// Solo páginas editoriales públicas e indexables. Sin checkout ni variantes con filtros, y sin
// `lastModified`/`priority`/`changeFrequency`: no hay fuente fiable que los justifique.
export default function sitemap(): MetadataRoute.Sitemap {
  const editorial = [routes.home, routes.collections, routes.perfumes, routes.quiz, routes.story, routes.contact];
  const paths = [
    ...editorial.filter((r) => r.ready).map((r) => r.href),
    ...getCollectionSlugs().map((s) => `${collectionPage.href}/${s}`),
    ...getPerfumeSlugs().map((s) => `${perfumePage.href}/${s}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
