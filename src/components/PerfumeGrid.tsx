import { PerfumeCard } from "@/components/PerfumeCard";
import { perfumeRoute, resolveHref } from "@/lib/routes";
import type { Perfume } from "@/lib/types";

// 1 columna móvil / 2 tablet / 3 escritorio, coherente con las clases del grid.
const SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw";

/** Rejilla de tarjetas; los enlaces se resuelven aquí y siguen inactivos mientras la ficha no esté lista. */
export function PerfumeGrid({ perfumes, preloadCount = 0 }: { perfumes: Perfume[]; preloadCount?: number }) {
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {perfumes.map((p, i) => (
        <PerfumeCard
          key={p.id}
          perfume={p}
          sizes={SIZES}
          href={resolveHref(perfumeRoute(p.slug, p.name))}
          preload={i < preloadCount}
        />
      ))}
    </ul>
  );
}
