import Link from "next/link";
import { collectionLight } from "@/components/collectionLight";
import { getCollections, getPerfumesByCollection } from "@/lib/catalog";
import { toRoman } from "@/lib/roman";
import { collectionRoute, resolveHref } from "@/lib/routes";
import type { Collection } from "@/lib/types";

type Variant = "home" | "page";

function CollectionRow({ collection, index, variant }: { collection: Collection; index: number; variant: Variant }) {
  const page = variant === "page";
  // En la página el h1 es externo: cada colección es h2 (en la Home, bajo el h2 de sección, es h3).
  const Heading = page ? "h2" : "h3";
  const href = resolveHref(collectionRoute(collection.slug, collection.name));
  const perfumes = getPerfumesByCollection(collection.id);

  const body = (
    <>
      <div
        aria-hidden="true"
        className="light-sig"
        data-sig={collection.id}
        style={{ backgroundImage: collectionLight[collection.id] }}
      />
      <div className={`reveal relative grid gap-x-8 gap-y-4 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-end md:pr-[clamp(2.5rem,3vw,3rem)] ${
          page ? "py-12 md:py-[clamp(4.5rem,8vw,7rem)]" : "py-9 md:py-14"
        }`}
      >
        <span aria-hidden="true" className="font-display text-2xl font-light text-silver md:pb-3">
          {toRoman(index + 1)}
        </span>
        <div>
          <Heading
            className={`font-display font-medium leading-[0.95] tracking-[0.04em] text-ivory ${
              page
                ? "text-[clamp(2.25rem,10vw,3.5rem)] md:text-[clamp(3rem,5.5vw,5rem)]"
                : "text-[clamp(2rem,9vw,3.25rem)] md:text-[clamp(3.25rem,6vw,5.5rem)]"
            }`}
          >
            {collection.name}
            {/* Sin ruta de colección todavía: el bloque es informativo, no un enlace. */}
            {!href && <span className="sr-only">, página de colección aún no disponible</span>}
          </Heading>
          <p className={page ? "mt-4 font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-light text-silver" : "mt-3 text-base text-silver"}>
            {collection.tagline}
          </p>
        </div>
        <ul
          aria-label={`Perfumes de ${collection.name}`}
          className="flex flex-wrap gap-x-5 gap-y-1 pr-9 text-sm font-medium tracking-[0.14em] text-ivory md:flex-col md:items-end md:gap-y-2 md:pr-0"
        >
          {perfumes.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
      {href && (
        <span
          aria-hidden="true"
          // En móvil la flecha baja a la fila de perfumes (a la altura del relleno inferior) para no tocar el título.
          className={`absolute right-0 text-2xl text-champagne md:top-1/2 md:-translate-y-1/2 ${page ? "bottom-[2.625rem]" : "bottom-[1.875rem]"} md:bottom-auto`}
        >
          →
        </span>
      )}
    </>
  );

  // overflow-clip (no -hidden): recorta la firma sin crear un contenedor de scroll.
  const cls = "relative isolate block overflow-clip border-b border-border";
  return (
    <li>
      {href ? (
        // Sin aria-label: el nombre accesible deriva del contenido visible (WCAG 2.5.3).
        <Link href={href} className={cls}>
          {body}
        </Link>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  );
}

/** `home`: con su propio h2 «Cinco universos» (destino de #colecciones). `page`: sin título propio; la página aporta el h1 (`labelledBy`). */
export function CollectionIndex({ variant = "home", labelledBy }: { variant?: Variant; labelledBy?: string } = {}) {
  const page = variant === "page";
  return (
    <section
      aria-labelledby={page ? labelledBy : "colecciones"}
      className={`mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,10rem)] ${
        page ? "pt-0" : "pt-[clamp(3rem,6vw,5.5rem)]"
      }`}
    >
      {/* Destino del ancla #colecciones: revelado solo de opacidad; un transform movería la posición real del destino. */}
      {!page && (
        <h2 id="colecciones" className="reveal-fade font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
          Cinco universos
        </h2>
      )}
      <ol className={`border-t border-border ${page ? "" : "mt-10 md:mt-14"}`}>
        {getCollections().map((c, i) => (
          <CollectionRow key={c.id} collection={c} index={i} variant={variant} />
        ))}
      </ol>
    </section>
  );
}
