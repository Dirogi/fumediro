import { GlassButton } from "@/components/GlassButton";

interface Props {
  collections: { slug: string; name: string }[];
  /** Slug activo; undefined = todas. */
  collection?: string;
  sortedByName: boolean;
  onCollection: (slug: string | undefined) => void;
  onToggleSort: () => void;
  onReset: () => void;
}

const chip =
  // md→xl: padding algo menor para que las 6 colecciones quepan en una fila a 768 px (con px-5 suman 702 px y hay 635).
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border px-5 text-sm font-medium md:max-xl:px-3.5 " +
  "transition-[background-color,color,border-color] duration-150 ease-out";
const on = "border-champagne bg-champagne text-charcoal";
const off = "border-border text-ivory hover:bg-graphite";

/** Filtros del catálogo: chips de colección (selección única) + orden A–Z. Los chips envuelven; nunca hay scroll horizontal. */
export function GlassFilterBar({ collections, collection, sortedByName, onCollection, onToggleSort, onReset }: Props) {
  return (
    <div className="glass-panel flex flex-col gap-5 rounded-2xl p-4 sm:p-5 xl:flex-row xl:items-end xl:justify-between xl:gap-8">
      <div>
        <p id="filtro-coleccion" className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-silver">
          Colección
        </p>
        <div role="group" aria-labelledby="filtro-coleccion" className="flex flex-wrap gap-2 md:max-xl:gap-1.5">
          <button type="button" aria-pressed={!collection} onClick={() => onCollection(undefined)} className={`${chip} ${!collection ? on : off}`}>
            Todas
          </button>
          {collections.map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={collection === c.slug}
              onClick={() => onCollection(c.slug)}
              className={`${chip} ${collection === c.slug ? on : off}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={sortedByName} onClick={onToggleSort} className={`${chip} ${sortedByName ? on : off}`}>
          Ordenar A–Z
        </button>
        {/* Siempre habilitado: así el foco nunca se pierde al pulsarlo; sin filtros activos no hace nada. */}
        <GlassButton variant="secondary" onClick={onReset}>
          Restablecer
        </GlassButton>
      </div>
    </div>
  );
}
