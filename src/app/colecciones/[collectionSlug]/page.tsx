import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PerfumeGrid } from "@/components/PerfumeGrid";
import { getCollectionBySlug, getCollectionSlugs, getPerfumesByCollection } from "@/lib/catalog";
import { collectionPage } from "@/lib/routes";

// D4 construye la página real. Hasta que `collectionPage.ready` sea true toda colección responde 404.
export const dynamicParams = false;
export const generateStaticParams = () => getCollectionSlugs().map((collectionSlug) => ({ collectionSlug }));

type Props = { params: Promise<{ collectionSlug: string }> };

async function load({ params }: Props) {
  const collection = getCollectionBySlug((await params).collectionSlug);
  if (!collectionPage.ready || !collection) notFound();
  return collection;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const collection = await load(props);
  return {
    title: `${collection.name} · Fumediro`,
    description: `${collection.name}: ${collection.tagline}. Colección de Fumediro, proyecto conceptual de portfolio.`,
  };
}

export default async function CollectionPage(props: Props) {
  const collection = await load(props);
  return (
    <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-24 pt-28">
      <Breadcrumbs
        items={[{ label: "Inicio", href: "/" }, { label: "Colecciones", href: collectionPage.href }, { label: collection.name }]}
      />
      <h1 className="mb-10 mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light text-ivory">{collection.name}</h1>
      <PerfumeGrid perfumes={getPerfumesByCollection(collection.id)} />
    </main>
  );
}
