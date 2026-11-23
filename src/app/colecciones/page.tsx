import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionIndex } from "@/components/CollectionIndex";
import { RevealOnView } from "@/components/RevealOnView";
import { routes } from "@/lib/routes";

export function generateMetadata(): Metadata {
  if (!routes.collections.ready) notFound();
  return { title: "Colecciones · Fumediro", description: "Las cinco colecciones de Fumediro, proyecto conceptual de portfolio." };
}

export default function CollectionsPage() {
  if (!routes.collections.ready) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="pt-28">
      <div className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)]">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Colecciones" }]} />
        <header className="mb-12 mt-8 grid gap-6 md:mb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-end lg:gap-16">
          <h1
            id="colecciones-titulo"
            className="font-display text-[clamp(3rem,9vw,6.5rem)] font-light leading-[0.95] tracking-[0.02em] text-ivory"
          >
            Colecciones
          </h1>
          <p className="text-base leading-relaxed text-silver md:text-lg lg:pb-2">
            Cinco universos, tres fragancias en cada uno. Entra por el que más te atraiga.
          </p>
        </header>
      </div>
      <CollectionIndex variant="page" labelledBy="colecciones-titulo" />
      <RevealOnView />
    </main>
  );
}
