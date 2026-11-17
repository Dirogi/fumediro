import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PerfumeGrid } from "@/components/PerfumeGrid";
import { getPerfumes } from "@/lib/catalog";
import { routes } from "@/lib/routes";

// D3 construye el catálogo real. Hasta que `routes.perfumes.ready` sea true esta ruta responde 404.
export function generateMetadata(): Metadata {
  if (!routes.perfumes.ready) notFound();
  return { title: "Perfumes · Fumediro", description: "Los quince perfumes de Fumediro, proyecto conceptual de portfolio." };
}

export default function PerfumesPage() {
  if (!routes.perfumes.ready) notFound();
  return (
    <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-24 pt-28">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Perfumes" }]} />
      <h1 className="mb-10 mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-light text-ivory">Perfumes</h1>
      <PerfumeGrid perfumes={getPerfumes()} preloadCount={3} />
    </main>
  );
}
