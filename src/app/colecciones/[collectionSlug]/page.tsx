import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPageTemplate } from "@/components/CollectionPageTemplate";
import { CosmoraExperience } from "@/components/CosmoraExperience";
import { FloraArcanaExperience } from "@/components/FloraArcanaExperience";
import { PrismaticaExperience } from "@/components/PrismaticaExperience";
import { RevealOnView } from "@/components/RevealOnView";
import { ThermaeExperience } from "@/components/ThermaeExperience";
import { VoltaraExperience } from "@/components/VoltaraExperience";
import { collectionContent } from "@/data/collectionContent";
import { getCollectionBySlug, getCollectionSlugs, getPerfumesByCollection } from "@/lib/catalog";
import { collectionPage } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => getCollectionSlugs().map((collectionSlug) => ({ collectionSlug }));

type Props = { params: Promise<{ collectionSlug: string }> };

async function load({ params }: Props) {
  const collection = getCollectionBySlug((await params).collectionSlug);
  const content = collection && collectionContent[collection.id];
  if (!collectionPage.ready || !collection || !content) notFound();
  return { collection, content };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { collection, content } = await load(props);
  return pageMetadata({
    title: `${collection.name} · Fumediro`,
    description: `${collection.name}: ${content.summary} Colección de Fumediro, proyecto conceptual de portfolio.`,
    path: `${collectionPage.href}/${collection.slug}`,
  });
}

export default async function CollectionPage(props: Props) {
  const { collection, content } = await load(props);
  const perfumes = getPerfumesByCollection(collection.id);
  const technology = content.technology?.name ?? collection.name;
  const experience =
    collection.experienceType === "led-light" ? (
      <VoltaraExperience perfumes={perfumes} technology={technology} />
    ) : collection.experienceType === "botanical-explorer" ? (
      <FloraArcanaExperience perfumes={perfumes} />
    ) : collection.experienceType === "particle-chamber" ? (
      <CosmoraExperience perfumes={perfumes} technology={technology} />
    ) : collection.experienceType === "optical-slider" ? (
      <PrismaticaExperience perfumes={perfumes} technology={technology} />
    ) : collection.experienceType === "thermal-reactive" ? (
      <ThermaeExperience perfumes={perfumes} technology={technology} />
    ) : undefined;
  return (
    <>
      <CollectionPageTemplate
        collection={collection}
        content={content}
        experience={experience}
      />
      <RevealOnView />
    </>
  );
}
