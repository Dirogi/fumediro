import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PerfumeDetail } from "@/components/PerfumeDetail";
import { getCollectionOfPerfume, getPerfumeBySlug, getPerfumeSlugs } from "@/lib/catalog";
import { formatEUR, getDemoPrice } from "@/lib/money";

// Solo los 15 slugs del catálogo existen; cualquier otro (p. ej. la grafía antigua «coralis») da 404.
export const dynamicParams = false;
export const generateStaticParams = () => getPerfumeSlugs().map((perfumeSlug) => ({ perfumeSlug }));

type Props = { params: Promise<{ perfumeSlug: string }> };

async function load({ params }: Props) {
  const slug = (await params).perfumeSlug;
  const perfume = getPerfumeBySlug(slug);
  if (!perfume) notFound();
  return { perfume, collection: getCollectionOfPerfume(perfume) };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { perfume, collection } = await load(props);
  const price = getDemoPrice(perfume.id);
  return {
    title: `${perfume.name} · Fumediro`,
    description: `${perfume.name}${collection ? `, perfume de la colección ${collection.name}` : ""} de Fumediro${price !== undefined ? `. Precio de demostración: ${formatEUR(price)}` : ""}. Proyecto conceptual de portfolio.`,
  };
}

export default async function PerfumePage(props: Props) {
  const { perfume, collection } = await load(props);
  return <PerfumeDetail perfume={perfume} collection={collection} />;
}
