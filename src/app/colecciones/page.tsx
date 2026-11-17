import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CollectionIndex } from "@/components/CollectionIndex";
import { routes } from "@/lib/routes";

// D4 construye el índice real. Hasta que `routes.collections.ready` sea true esta ruta responde 404.
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
      </div>
      <CollectionIndex />
    </main>
  );
}
