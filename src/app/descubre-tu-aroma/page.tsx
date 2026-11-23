import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScentFinder } from "@/components/ScentFinder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Descubre tu aroma · Fumediro",
  description:
    "The Scent Finder: cuatro preguntas para orientarte entre los quince perfumes de Fumediro, proyecto conceptual de portfolio.",
  path: "/descubre-tu-aroma",
});

export default function DiscoverPage() {
  return (
    <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,10rem)] pt-28">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Descubre tu aroma" }]} />
      <ScentFinder />
    </main>
  );
}
