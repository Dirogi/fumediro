"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { GlassButton } from "@/components/GlassButton";
import { GlassFilterBar } from "@/components/GlassFilterBar";
import { PerfumeGrid } from "@/components/PerfumeGrid";
import { ResultsTransition } from "@/components/ResultsTransition";
import { getPerfumes } from "@/lib/catalog";
import {
  applyCatalogQuery,
  getFilterOptions,
  parseCatalogQuery,
  serializeCatalogQuery,
  type CatalogQuery,
} from "@/lib/catalogQuery";

// La URL es la fuente de verdad. `history.pushState` está integrado con Next (sincroniza `useSearchParams`),
// no hace petición al servidor y deja cada cambio como entrada de historial (atrás/adelante).
function useCatalogQuery() {
  const { collection, sort } = parseCatalogQuery(useSearchParams()); // `family` no se expone en la UI
  const query: CatalogQuery = { collection, sort };
  const key = serializeCatalogQuery(query);

  const go = (next: CatalogQuery) => {
    const qs = serializeCatalogQuery(next);
    if (qs === key) return;
    window.history.pushState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  return {
    query,
    key,
    setCollection: (c?: string) => go({ ...query, collection: c }),
    toggleSort: () => go({ ...query, sort: sort ? undefined : "name" }),
    reset: () => go({}),
  };
}

export function CatalogExplorer() {
  const q = useCatalogQuery();
  const { collections } = getFilterOptions();
  const results = applyCatalogQuery(getPerfumes(), q.query);
  const root = useRef<HTMLDivElement>(null);
  const prevKey = useRef(q.key);

  // Al reducir resultados el navegador deja el scroll al final de una página corta y la barra queda oculta arriba.
  // Solo en ese caso se devuelve la barra a la vista (96 px = barra de navegación fija); si ya es visible no se toca el scroll.
  useEffect(() => {
    if (prevKey.current === q.key) return;
    prevKey.current = q.key;
    const top = root.current?.getBoundingClientRect().top ?? 0;
    if (top < 96) window.scrollBy({ top: top - 96, behavior: "auto" });
  }, [q.key]);

  const activeName = collections.find((c) => c.slug === q.query.collection)?.name;

  return (
    <div ref={root}>
      <GlassFilterBar
        collections={collections}
        collection={q.query.collection}
        sortedByName={q.query.sort === "name"}
        onCollection={q.setCollection}
        onToggleSort={q.toggleSort}
        onReset={q.reset}
      />
      <p role="status" className="mb-8 mt-6 text-sm text-silver">
        {results.length} perfumes{activeName && ` · ${activeName}`}
      </p>
      {/* Evita el salto h1 → h3 de las tarjetas (axe heading-order) sin tocar PerfumeCard. */}
      <h2 className="sr-only">Resultados</h2>
      {results.length > 0 ? (
        <ResultsTransition resultKey={q.key}>
          <PerfumeGrid perfumes={results} preloadCount={3} />
        </ResultsTransition>
      ) : (
        <div className="py-16">
          <p className="mb-6 font-display text-3xl text-ivory">Ningún perfume coincide con esta selección.</p>
          <GlassButton variant="secondary" onClick={q.reset}>
            Restablecer filtros
          </GlassButton>
        </div>
      )}
    </div>
  );
}
