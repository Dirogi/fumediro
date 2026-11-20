"use client";

import { useId, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { experienceEyebrow, experienceRing, PerfumePicker } from "@/components/PerfumePicker";
import { ProductImage } from "@/components/ProductImage";
import type { Perfume } from "@/lib/types";

type View = "whole" | "feature" | "profile";

const views: { id: View; numeral: string; label: string }[] = [
  { id: "whole", numeral: "I", label: "Forma" },
  { id: "feature", numeral: "II", label: "Rasgo" },
  { id: "profile", numeral: "III", label: "Perfil" },
];

// Encuadre del "Rasgo": punto de la foto (% x, y) y ampliación. Solo se amplía la fotografía original dentro de su marco;
// no se superpone nada ni se retoca. provisional: encuadres elegidos a ojo, pendientes de aprobación.
const closeup: Record<string, { x: number; y: number; scale: number }> = {
  aurelis: { x: 0.55, y: 0.6, scale: 1.6 },
  corallis: { x: 0.5, y: 0.58, scale: 1.3 },
  virelia: { x: 0.52, y: 0.42, scale: 1.5 },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Lo que cada vista dice del perfume, solo con datos aprobados (nada se infiere: AURELIS no tiene familia definida). */
function readout(p: Perfume, view: View): { kicker: string; text: string } {
  if (view === "feature") return { kicker: "Rasgo escultórico", text: cap(p.specialFeature ?? p.name) };
  if (view === "profile") {
    return p.notes?.length
      ? { kicker: "Notas", text: p.notes.map(cap).join(" · ") }
      : { kicker: "Familia olfativa", text: cap(p.olfactoryFamily ?? "—") };
  }
  return { kicker: "Color", text: cap(p.colorway ?? p.name) };
}

const move = "transition-transform duration-700 ease-out motion-reduce:transition-none";
const fade = "transition-opacity duration-500 ease-out motion-reduce:transition-none";

/** Experiencia de FLORA ARCANA: recorrido guiado de cada frasco (forma, rasgo ampliado, perfil). Sin simulación de luz. */
export function FloraArcanaExperience({ perfumes }: { perfumes: Perfume[] }) {
  const [selectedId, setSelectedId] = useState(perfumes[0]?.id);
  const [view, setView] = useState<View>("whole");
  const group = useId();
  const selected = perfumes.find((p) => p.id === selectedId) ?? perfumes[0];
  if (!selected) return null;
  const out = readout(selected, view);
  const zoomed = view === "feature";

  return (
    <section aria-labelledby="flora-exp-titulo" className="mt-[clamp(4rem,8vw,7rem)]">
      <GlassPanel className="grid gap-8 overflow-clip p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="flora-exp-titulo" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
            Esculturas de jardín
          </h2>
          <p className="mt-3 max-w-[30rem] text-base leading-relaxed text-silver">
            Tres flores que no existen, convertidas en frasco. Elige una y recórrela: su forma, el rasgo que la define y su perfil.
          </p>
        </div>

        <figure className="mx-auto w-full max-w-[22rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          <div className="relative aspect-[1086/1448] overflow-clip rounded-2xl">
            {perfumes.map((p) => {
              const image = p.images[0];
              const c = closeup[p.id];
              if (!image || !c) return null;
              const active = p.id === selected.id;
              const s = zoomed ? c.scale : 1;
              const transform = `translate(${(-(c.x - 0.5) * s * 100).toFixed(1)}%, ${(-(c.y - 0.5) * s * 100).toFixed(1)}%) scale(${s})`;
              return (
                <div key={p.id} aria-hidden={!active} className={`absolute inset-0 ${fade} ${active ? "opacity-100" : "opacity-0"}`}>
                  <div className={move} style={{ transform: zoomed ? transform : "none" }}>
                    <ProductImage
                      image={image}
                      sizes="(min-width: 1024px) 416px, (min-width: 768px) 352px, calc(100vw - 4rem)"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <figcaption className="mt-3 text-sm text-silver">
            {zoomed ? "Detalle ampliado de la fotografía" : "Fotografía completa"}
          </figcaption>
        </figure>

        <div className="lg:col-start-1 lg:row-start-2">
          <PerfumePicker perfumes={perfumes} value={selected.id} onChange={setSelectedId} />

          <fieldset className="mt-6">
            <legend className={experienceEyebrow}>Recorrido</legend>
            <div className="mt-3 flex flex-col">
              {views.map((v) => (
                <label key={v.id} className="relative">
                  <input type="radio" name={group} value={v.id} checked={v.id === view} onChange={() => setView(v.id)} className="peer sr-only" />
                  <span
                    className={`flex min-h-11 items-center gap-4 border-l-2 border-border pl-4 text-sm font-medium uppercase tracking-[0.14em] text-silver transition-colors duration-150 peer-checked:border-champagne peer-checked:text-ivory ${experienceRing}`}
                  >
                    <span aria-hidden="true" className="w-6 font-display text-base normal-case tracking-normal">
                      {v.numeral}
                    </span>
                    {v.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 border-t border-border pt-6">
            <p className={experienceEyebrow}>
              {selected.name} · {out.kicker}
            </p>
            <p className="mt-3 min-h-[2.5em] font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-light leading-tight text-ivory">{out.text}</p>
          </div>
          <p role="status" className="sr-only">
            {selected.name}, {out.kicker.toLowerCase()}: {out.text}
          </p>
        </div>
      </GlassPanel>
    </section>
  );
}
