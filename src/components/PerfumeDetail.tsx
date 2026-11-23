import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GlassButton } from "@/components/GlassButton";
import { PerfumeGrid } from "@/components/PerfumeGrid";
import { ProductImage } from "@/components/ProductImage";
import { getRelatedPerfumes } from "@/lib/catalog";
import { formatEUR, getDemoPrice } from "@/lib/money";
import { collectionPage, perfumePage } from "@/lib/routes";
import type { Collection, Perfume } from "@/lib/types";

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";

interface Props {
  perfume: Perfume;
  collection?: Collection;
}

/** Datos aprobados del perfume; una fila ausente no se renderiza (nada se inventa). */
function facts(p: Perfume): { label: string; value: string }[] {
  return [
    p.notes?.length ? { label: "Notas", value: p.notes.join(", ") } : null,
    p.olfactoryFamily ? { label: "Familia olfativa", value: p.olfactoryFamily } : null,
    p.colorway ? { label: "Color del frasco", value: p.colorway } : null,
    p.specialFeature ? { label: "Rasgo de diseño", value: p.specialFeature } : null,
  ].filter((f) => f !== null);
}

export function PerfumeDetail({ perfume, collection }: Props) {
  const image = perfume.images[0];
  const price = getDemoPrice(perfume.id);
  const collectionHref = collection ? `${collectionPage.href}/${collection.slug}` : null;
  const related = getRelatedPerfumes(perfume);

  return (
    <main id="contenido" tabIndex={-1} className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,9rem)] pt-28">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Perfumes", href: perfumePage.href },
          ...(collection && collectionHref ? [{ label: collection.name, href: collectionHref }] : []),
          { label: perfume.name },
        ]}
      />

      <article aria-labelledby="perfume-titulo" className="mt-8 md:mt-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,6rem)]">
          {image && (
            <ProductImage
              image={image}
              preload
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="w-full max-w-[36rem] rounded-2xl border border-border lg:max-w-none lg:self-center"
            />
          )}

          <div className="lg:sticky lg:top-28">
            {collection && collectionHref && (
              <Link href={collectionHref} className={`${eyebrow} inline-flex min-h-11 items-center underline decoration-transparent underline-offset-8 transition-[text-decoration-color] duration-150 hover:decoration-current`}>
                Colección {collection.name}
              </Link>
            )}
            <h1 id="perfume-titulo" className="mt-2 font-display text-[clamp(3.5rem,9vw,6.5rem)] font-light leading-[0.95] tracking-[0.04em] text-ivory">
              {perfume.name}
            </h1>
            {collection && <p className="mt-5 font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-light text-silver">{collection.tagline}</p>}

            <dl className="mt-10 border-t border-border">
              {facts(perfume).map((f) => (
                <div key={f.label} className="grid grid-cols-[8.5rem_1fr] gap-4 border-b border-border py-4 text-sm sm:grid-cols-[10rem_1fr] sm:text-base">
                  <dt className={`${eyebrow} pt-0.5`}>{f.label}</dt>
                  <dd className="text-ivory first-letter:uppercase">{f.value}</dd>
                </div>
              ))}
            </dl>

            {price !== undefined && (
              <div className="mt-10">
                <p className="font-sans text-3xl font-medium text-ivory">{formatEUR(price)}</p>
                <p className="mt-1 text-sm text-silver">Precio de demostración · proyecto de portfolio, no se comercializa.</p>
              </div>
            )}

            <div className="mt-6">
              <AddToCartButton perfumeId={perfume.id} />
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="perfume-relacionados" className="mt-[clamp(4rem,8vw,7rem)] border-t border-border pt-[clamp(2.5rem,5vw,4rem)]">
          <h2 id="perfume-relacionados" className="mb-8 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-light text-ivory md:mb-10">
            {collection ? `También en ${collection.name}` : "De la misma colección"}
          </h2>
          <PerfumeGrid perfumes={related} />
          {collectionHref && collection && (
            <div className="mt-10">
              <GlassButton href={collectionHref} variant="secondary">
                Explorar la colección {collection.name}
              </GlassButton>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
