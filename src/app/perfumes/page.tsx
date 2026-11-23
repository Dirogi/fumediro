import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({ title: "Perfumes · Fumediro", description: "Los quince perfumes de Fumediro, proyecto conceptual de portfolio.", path: "/perfumes" });
}

// Leer `searchParams` hace la ruta dinámica: el HTML inicial ya llega filtrado y `useSearchParams` coincide (sin parpadeo ni Suspense).
export default async function PerfumesPage({ searchParams }: { searchParams: Promise<unknown> }) {
  await searchParams;
  return (
    <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,10rem)] pt-28">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Perfumes" }]} />
      <header className="mb-10 mt-8 grid gap-6 md:mb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-end lg:gap-16">
        <h1 className="font-display text-[clamp(3rem,9vw,6.5rem)] font-light leading-[0.95] tracking-[0.02em] text-ivory">Perfumes</h1>
        <p className="text-base leading-relaxed text-silver md:text-lg lg:pb-2">
          Quince fragancias, cinco universos. Recórrelas todas o entra por la colección que más te atraiga.
        </p>
      </header>
      <div className="border-t border-border pt-8 md:pt-10">
        <CatalogExplorer />
      </div>
    </main>
  );
}
