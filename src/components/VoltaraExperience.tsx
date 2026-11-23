"use client";

import { useId, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { ProductImage } from "@/components/ProductImage";
import type { Perfume } from "@/lib/types";

// Tratamiento de luz por perfume. Las fotos ya traen la luz encendida, así que "apagar" es:
//  · un velo con gradientes concentrados en las fuentes de luz (núcleo, anillo de la base, reflejo en el suelo),
//  · una bajada leve de saturación/luminosidad de la foto,
//  · y un halo ambiental de color detrás del frasco que solo existe encendido.
// Las coordenadas son % sobre la foto (1086×1448): [x, y, radio-x, radio-y, opacidad del velo].
// provisional: el rgb del halo coincide con los acentos de evaluación de `collectionLight.ts`, pendientes de aprobación.
type Source = [x: number, y: number, rx: number, ry: number, alpha: number];
const treatment: Record<string, { rgb: string; sources: Source[] }> = {
  ion: {
    rgb: "47 181 138",
    sources: [[49, 48, 22, 14, 0.8], [49, 63, 24, 14, 0.8], [50, 83.5, 9, 4.5, 0.92], [50, 92, 36, 10, 0.85], [50, 60, 48, 34, 0.25]],
  },
  pulse: {
    rgb: "194 48 138",
    sources: [[50, 53, 24, 13, 0.8], [50, 60, 26, 13, 0.8], [50, 83.5, 9, 4.5, 0.92], [50, 92, 36, 10, 0.85], [50, 60, 50, 32, 0.25]],
  },
  solaris: {
    rgb: "224 163 58",
    sources: [[50, 46, 16, 11, 0.85], [50, 56, 12, 14, 0.7], [50, 82.5, 9, 4.5, 0.92], [50, 92, 36, 10, 0.85], [50, 50, 40, 34, 0.3]],
  },
};

const veil = (sources: Source[]) =>
  sources.map(([x, y, rx, ry, a]) => `radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%, rgb(9 11 15 / ${a}), transparent)`).join(",");

const fade = "transition-opacity duration-500 ease-out motion-reduce:transition-none";
const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";
const ring = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus";

/** Experiencia de VOLTARA: escenario con un perfume, selector y luz simulada. Aislada y sustituible. */
export function VoltaraExperience({ perfumes, technology }: { perfumes: Perfume[]; technology: string }) {
  const [selectedId, setSelectedId] = useState(perfumes[0]?.id);
  const [lit, setLit] = useState(true);
  const group = useId();
  const selected = perfumes.find((p) => p.id === selectedId) ?? perfumes[0];
  if (!selected) return null;
  const traits = [selected.colorway, selected.specialFeature, selected.olfactoryFamily].filter(Boolean).join(" · ");

  return (
    <section aria-labelledby="voltara-exp-titulo" className="mt-[clamp(4rem,8vw,7rem)]">
      <GlassPanel className="grid gap-8 overflow-clip p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="voltara-exp-titulo" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
            La luz interior
          </h2>
          <p className="mt-3 max-w-[30rem] text-base leading-relaxed text-silver">
            Elige un orbe y descubre cómo cambia su luz. Una experiencia visual inspirada en {technology}, la tecnología
            conceptual de FUMEDIRO.
          </p>
        </div>

        {/* Escenario: halo ambiental + las tres fotos apiladas (misma proporción, sin CLS) que se funden entre sí. */}
        <div className="relative isolate mx-auto w-full max-w-[22rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          {perfumes.map((p) => (
            <div
              key={`halo-${p.id}`}
              aria-hidden="true"
              className={`absolute -inset-[12%] -z-10 ${fade} ${lit && p.id === selected.id ? "opacity-100" : "opacity-0"}`}
              style={{ backgroundImage: `radial-gradient(ellipse 60% 55% at 50% 55%, rgb(${treatment[p.id]?.rgb} / 0.36), transparent 100%)` }}
            />
          ))}
          <div className="relative aspect-[1086/1448]">
            {perfumes.map((p) => {
              const t = treatment[p.id];
              const image = p.images[0];
              if (!t || !image) return null;
              const active = p.id === selected.id;
              return (
                <div key={p.id} aria-hidden={!active} className={`absolute inset-0 ${fade} ${active ? "opacity-100" : "opacity-0"}`}>
                  <ProductImage
                    image={image}
                    sizes="(min-width: 1024px) 416px, (min-width: 768px) 352px, calc(100vw - 4rem)"
                    className="rounded-2xl"
                    imgClassName={`transition-[filter] duration-500 ease-out motion-reduce:transition-none ${lit ? "" : "saturate-[.6] brightness-[.82]"}`}
                  />
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 rounded-2xl ${fade} ${lit ? "opacity-0" : "opacity-100"}`}
                    style={{ backgroundImage: veil(t.sources) }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <fieldset>
            <legend className={eyebrow}>Perfume</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {perfumes.map((p) => (
                <label key={p.id} className="relative">
                  <input
                    type="radio"
                    name={group}
                    value={p.id}
                    checked={p.id === selected.id}
                    onChange={() => setSelectedId(p.id)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex min-h-11 items-center justify-center rounded-full border border-border px-1 text-xs font-medium uppercase tracking-[0.08em] sm:px-3 sm:tracking-[0.12em] text-silver transition-colors duration-150 peer-checked:border-champagne peer-checked:bg-champagne peer-checked:text-charcoal ${ring}`}
                  >
                    {p.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-6 flex min-h-11 w-fit cursor-pointer items-center gap-4">
            <input type="checkbox" role="switch" checked={lit} onChange={(e) => setLit(e.target.checked)} className="peer sr-only" />
            <span className="sr-only">Iluminación simulada</span>
            <span
              aria-hidden="true"
              className={`relative h-7 w-12 shrink-0 rounded-full border border-border bg-charcoal transition-colors duration-200 peer-checked:bg-champagne motion-reduce:transition-none ${ring}`}
            >
              <span
                className={`absolute left-0.5 top-0.5 size-5.5 rounded-full transition-transform duration-200 ease-out motion-reduce:transition-none ${lit ? "translate-x-5 bg-charcoal" : "bg-silver"}`}
              />
            </span>
            <span aria-hidden="true" className="text-sm font-medium uppercase tracking-[0.14em] text-ivory">
              {lit ? "Luz encendida" : "Luz apagada"}
            </span>
          </label>

          <div className="mt-8 border-t border-border pt-6">
            <p className="font-display text-3xl font-medium tracking-[0.04em] text-ivory">{selected.name}</p>
            <p className="mt-2 text-base text-silver">{traits}</p>
          </div>
          <p role="status" className="sr-only">
            {selected.name}, {lit ? "luz encendida" : "luz apagada"}
          </p>
        </div>
      </GlassPanel>
    </section>
  );
}
