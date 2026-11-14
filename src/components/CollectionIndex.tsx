import Link from "next/link";
import { collectionLight } from "@/components/collectionLight";
import { getCollections, getPerfumesByCollection } from "@/lib/catalog";
import { toRoman } from "@/lib/roman";
import { collectionRoute, resolveHref } from "@/lib/routes";
import type { Collection } from "@/lib/types";

function CollectionRow({ collection, index }: { collection: Collection; index: number }) {
  const href = resolveHref(collectionRoute(collection.slug, collection.name));
  const perfumes = getPerfumesByCollection(collection.id);

  const body = (
    <>
      <div
        aria-hidden="true"
        className="light-sig"
        style={{ backgroundImage: collectionLight[collection.id] }}
      />
      <div className="relative grid gap-x-8 gap-y-4 py-9 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-end md:py-14 md:pr-[clamp(1.5rem,3vw,3rem)]">
        <span aria-hidden="true" className="font-display text-2xl font-light text-silver md:pb-3">
          {toRoman(index + 1)}
        </span>
        <div>
          <h3 className="font-display text-[clamp(2rem,9vw,3.25rem)] font-medium md:text-[clamp(3.25rem,6vw,5.5rem)] leading-[0.95] tracking-[0.04em] text-ivory">
            {collection.name}
            {/* Sin ruta de colección todavía: el bloque es informativo, no un enlace. */}
            {!href && <span className="sr-only">, página de colección aún no disponible</span>}
          </h3>
          <p className="mt-3 text-base text-silver">{collection.tagline}</p>
        </div>
        <ul
          aria-label={`Perfumes de ${collection.name}`}
          className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium tracking-[0.14em] text-ivory md:flex-col md:items-end md:gap-y-2"
        >
          {perfumes.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
      {href && (
        <span aria-hidden="true" className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-champagne">
          →
        </span>
      )}
    </>
  );

  const cls = "relative isolate block overflow-hidden border-b border-border";
  return (
    <li>
      {href ? (
        <Link href={href} className={cls}>
          {body}
        </Link>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  );
}

export function CollectionIndex() {
  return (
    <section
      aria-labelledby="colecciones"
      className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,10rem)] pt-[clamp(3rem,6vw,5.5rem)]"
    >
      <h2 id="colecciones" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
        Cinco universos
      </h2>
      <ol className="mt-10 border-t border-border md:mt-14">
        {getCollections().map((c, i) => (
          <CollectionRow key={c.id} collection={c} index={i} />
        ))}
      </ol>
    </section>
  );
}
