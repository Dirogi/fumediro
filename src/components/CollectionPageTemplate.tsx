import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { collectionLight } from "@/components/collectionLight";
import { GlassButton } from "@/components/GlassButton";
import { GlassPanel } from "@/components/GlassPanel";
import { PerfumeGrid } from "@/components/PerfumeGrid";
import type { CollectionContent } from "@/data/collectionContent";
import { getAdjacentCollections, getCollections, getPerfumesByCollection } from "@/lib/catalog";
import { toRoman } from "@/lib/roman";
import type { Collection } from "@/lib/types";

// Rutas entre colecciones: solo se llega a esta plantilla si la página está disponible, así que sus enlaces
// internos son siempre válidos y no dependen de `resolveHref` ni de los flags públicos.
const collectionHref = (slug: string) => `/colecciones/${slug}`;

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";

interface Props {
  collection: Collection;
  content: CollectionContent;
  /** Experiencia interactiva de la colección (D4-C). Sin ella, la sección no se muestra. */
  experience?: ReactNode;
}

function SiblingLink({ collection, label, align }: { collection: Collection; label: string; align: "start" | "end" }) {
  return (
    <Link
      href={collectionHref(collection.slug)}
      className={`group flex min-h-11 flex-col gap-1 rounded-2xl py-2 ${align === "end" ? "items-end text-right" : "items-start"}`}
    >
      <span className={eyebrow}>{label}</span>
      <span className="font-display text-[clamp(1.25rem,3.4vw,2.5rem)] font-medium tracking-[0.04em] text-ivory underline decoration-transparent decoration-1 underline-offset-8 transition-[text-decoration-color] duration-150 group-hover:decoration-current">
        {collection.name}
      </span>
    </Link>
  );
}

export function CollectionPageTemplate({ collection, content, experience }: Props) {
  const perfumes = getPerfumesByCollection(collection.id);
  const adjacent = getAdjacentCollections(collection.slug);
  const numeral = toRoman(getCollections().findIndex((c) => c.id === collection.id) + 1);
  const { technology } = content;

  return (
    <main id="contenido" tabIndex={-1} className="pt-28">
      <div className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,10rem)]">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Colecciones", href: "/colecciones" }, { label: collection.name }]}
        />

        {/* Hero de identidad: la firma de luz propia de la colección, la misma del índice y de la Home. */}
        <section
          aria-labelledby="coleccion-titulo"
          className="relative isolate mt-8 overflow-clip border-y border-border md:mt-10"
        >
          <div
            aria-hidden="true"
            className="light-sig"
            data-sig={collection.id}
            style={{ backgroundImage: collectionLight[collection.id] }}
          />
          <div className="relative max-w-[40rem] py-[clamp(4rem,9vw,8rem)]">
            <p className={eyebrow}>Colección {numeral}</p>
            <h1
              id="coleccion-titulo"
              className="mt-4 font-display text-[clamp(3rem,10vw,6.5rem)] font-light leading-[0.95] tracking-[0.04em] text-ivory"
            >
              {collection.name}
            </h1>
            <p className="mt-5 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-light text-silver">{collection.tagline}</p>
            <p className="mt-8 max-w-[28rem] text-base leading-relaxed text-ivory md:text-lg">{content.summary}</p>
          </div>
        </section>

        {/* Concepto y tecnología conceptual. Sin tecnología (FLORA ARCANA) el concepto ocupa el ancho sin dejar hueco. */}
        <section
          aria-labelledby="coleccion-concepto"
          className={`reveal mt-[clamp(3.5rem,7vw,6rem)] grid gap-10 ${technology ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16" : ""}`}
        >
          <div>
            <h2 id="coleccion-concepto" className={eyebrow}>
              Concepto
            </h2>
            <p className="mt-5 max-w-[34em] font-display text-[clamp(1.375rem,2.3vw,1.875rem)] font-light leading-[1.45] text-ivory">
              {content.concept}
            </p>
          </div>
          {technology && (
            <GlassPanel className="self-start p-6 md:p-8">
              <h2 className={eyebrow}>Tecnología</h2>
              <h3 className="mt-4 font-display text-3xl font-medium tracking-[0.04em] text-ivory">{technology.name}</h3>
              <p className="mt-3 text-base leading-relaxed text-silver">{technology.description}</p>
              <p className="mt-5 text-sm text-silver">Una tecnología conceptual del universo FUMEDIRO.</p>
            </GlassPanel>
          )}
        </section>

        {experience}

        <section aria-labelledby="coleccion-perfumes" className="mt-[clamp(4rem,8vw,7rem)]">
          <h2 id="coleccion-perfumes" className="mb-10 font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory md:mb-14">
            Los tres perfumes
          </h2>
          <PerfumeGrid perfumes={perfumes} />
        </section>

        <nav aria-label="Seguir explorando" className="mt-[clamp(4rem,8vw,7rem)] border-t border-border pt-10">
          <div className="flex justify-center">
            <GlassButton href={`/perfumes?collection=${collection.slug}`}>Ver estos perfumes en el catálogo</GlassButton>
          </div>
          {adjacent && (
            <div className="mt-10 grid grid-cols-2 gap-6">
              <SiblingLink collection={adjacent.prev} label="Anterior" align="start" />
              <SiblingLink collection={adjacent.next} label="Siguiente" align="end" />
            </div>
          )}
        </nav>
      </div>
    </main>
  );
}
