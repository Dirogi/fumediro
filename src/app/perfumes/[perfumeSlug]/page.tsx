import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PerfumeGrid } from "@/components/PerfumeGrid";
import { getCollectionOfPerfume, getPerfumeBySlug, getPerfumeSlugs, getRelatedPerfumes } from "@/lib/catalog";
import { collectionPage, perfumePage } from "@/lib/routes";

// D5 construye la ficha real. Hasta que `perfumePage.ready` sea true toda ficha responde 404.
export const dynamicParams = false;
export const generateStaticParams = () => getPerfumeSlugs().map((perfumeSlug) => ({ perfumeSlug }));

type Props = { params: Promise<{ perfumeSlug: string }> };

async function load({ params }: Props) {
  const perfume = getPerfumeBySlug((await params).perfumeSlug);
  if (!perfumePage.ready || !perfume) notFound();
  return { perfume, collection: getCollectionOfPerfume(perfume) };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { perfume, collection } = await load(props);
  return {
    title: `${perfume.name} · Fumediro`,
    description: `${perfume.name}${collection ? `, perfume de la colección ${collection.name}` : ""} de Fumediro. Proyecto conceptual de portfolio.`,
  };
}

export default async function PerfumePage(props: Props) {
  const { perfume, collection } = await load(props);
  return (
    <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-24 pt-28">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Perfumes", href: perfumePage.href },
          ...(collection ? [{ label: collection.name, href: `${collectionPage.href}/${collection.slug}` }] : []),
          { label: perfume.name },
        ]}
      />
      <h1 className="mb-10 mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light text-ivory">{perfume.name}</h1>
      <PerfumeGrid perfumes={getRelatedPerfumes(perfume)} />
    </main>
  );
}
