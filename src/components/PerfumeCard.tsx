import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { getCollectionOfPerfume } from "@/lib/catalog";
import type { Perfume } from "@/lib/types";

interface Props {
  perfume: Perfume;
  sizes: string;
  /** Destino ya resuelto; null = tarjeta informativa sin enlace (ruta aún no lista). */
  href: string | null;
  preload?: boolean;
}

/**
 * Debe vivir en un <ul> con `display: grid`: ocupa 2 filas con subgrid (imagen / texto), de modo
 * que los textos de una fila quedan alineados y cada imagen se apoya en la base de la suya.
 */
export function PerfumeCard({ perfume, sizes, href, preload }: Props) {
  const image = perfume.images[0];
  const collection = getCollectionOfPerfume(perfume);

  const body = (
    <>
      <div className="row-start-1 self-end">
        {image && (
          <ProductImage
            image={image}
            sizes={sizes}
            preload={preload}
            decorative
            className="rounded-2xl border border-border transition-[border-color] duration-200 group-hover:border-champagne/60 group-focus-visible:border-champagne/60"
            // Solo transform: sin hover real (táctil) no hay efecto, y reduced-motion lo anula.
            imgClassName="transition-transform duration-300 ease-(--ease-out) motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
          />
        )}
      </div>
      <div className="row-start-2 pt-4">
        <h3 className="font-display text-3xl font-medium leading-none tracking-[0.06em] text-ivory">{perfume.name}</h3>
        {collection && (
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-silver">{collection.name}</p>
        )}
        {perfume.olfactoryFamily && <p className="mt-1 text-sm text-silver">{perfume.olfactoryFamily}</p>}
      </div>
    </>
  );

  // outline-offset-8!: separa el anillo del texto (el enlace no tiene padding); "!" porque el :focus-visible global no está en capa y gana a las utilidades.
const cls = "group row-span-2 grid grid-rows-subgrid gap-0 rounded-2xl pb-2 focus-visible:outline-offset-8!";
  return (
    <li className="row-span-2 grid grid-rows-subgrid">
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
