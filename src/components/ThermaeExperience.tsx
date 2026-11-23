"use client";

import { useId, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { experienceEyebrow, experienceRing, PerfumePicker } from "@/components/PerfumePicker";
import { ProductImage } from "@/components/ProductImage";
import type { Perfume } from "@/lib/types";

type Heat = "cold" | "mild" | "warm";

const states: { id: Heat; label: string; note: string }[] = [
  { id: "cold", label: "Frío", note: "El matiz se enfría y vira hacia tonos azulados." },
  { id: "mild", label: "Templado", note: "El acabado en su tono original, sin cambio." },
  { id: "warm", label: "Cálido", note: "El matiz se calienta y vira hacia tonos rojizos." },
];

// Matiz de cada extremo por perfume; "Templado" no lleva capa. Opacidad baja y mezcla `color`: cambia el matiz, no la luz.
// provisional: tonos pendientes de aprobación junto a los acentos de `collectionLight.ts`.
const tint: Record<string, { cold: string; warm: string }> = {
  blush: { cold: "150 165 215", warm: "232 120 120" },
  glacier: { cold: "110 165 225", warm: "215 165 160" },
  terra: { cold: "120 135 150", warm: "215 110 60" },
};

// La capa solo cubre el frasco y su superficie, no el fondo de la fotografía.
const bottleMask = "radial-gradient(ellipse 42% 50% at 50% 58%, #000 55%, transparent 100%)";

const fade = "transition-opacity duration-500 ease-out motion-reduce:transition-none";

/** Experiencia de THERMAE: tres estados térmicos simulados con capas de color. No mide ninguna temperatura real. */
export function ThermaeExperience({ perfumes, technology }: { perfumes: Perfume[]; technology: string }) {
  const [selectedId, setSelectedId] = useState(perfumes[0]?.id);
  const [heat, setHeat] = useState<Heat>("mild");
  const group = useId();
  const selected = perfumes.find((p) => p.id === selectedId) ?? perfumes[0];
  if (!selected) return null;
  const traits = [selected.colorway, selected.specialFeature, selected.olfactoryFamily].filter(Boolean).join(" · ");
  const state = states.find((s) => s.id === heat) ?? states[1]!;

  return (
    <section aria-labelledby="thermae-exp-titulo" className="mt-[clamp(4rem,8vw,7rem)]">
      <GlassPanel className="grid gap-8 overflow-clip p-6 md:p-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-x-16">
        <div className="lg:col-start-2 lg:row-start-1">
          <h2 id="thermae-exp-titulo" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
            El tacto del calor
          </h2>
          <p className="mt-3 max-w-[30rem] text-base leading-relaxed text-silver">
            Elige un estado y observa cómo cambia el matiz del frasco. Una simulación visual inspirada en {technology}, la
            tecnología conceptual de FUMEDIRO.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[22rem] lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          <div className="relative aspect-[1086/1448]">
            {perfumes.map((p) => {
              const image = p.images[0];
              const t = tint[p.id];
              if (!image) return null;
              const active = p.id === selected.id;
              return (
                <div key={p.id} aria-hidden={!active} className={`absolute inset-0 ${fade} ${active ? "opacity-100" : "opacity-0"}`}>
                  <ProductImage
                    image={image}
                    sizes="(min-width: 1024px) 416px, (min-width: 768px) 352px, calc(100vw - 4rem)"
                    className="rounded-2xl"
                  />
                  {t &&
                    (["cold", "warm"] as const).map((k) => (
                      <div
                        key={k}
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 rounded-2xl mix-blend-color ${fade} ${heat === k ? "opacity-35" : "opacity-0"}`}
                        style={{ backgroundColor: `rgb(${t[k]})`, maskImage: bottleMask, WebkitMaskImage: bottleMask }}
                      />
                    ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-start-2">
          <PerfumePicker perfumes={perfumes} value={selected.id} onChange={setSelectedId} />

          <fieldset className="mt-6">
            <legend className={experienceEyebrow}>Estado térmico simulado</legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {states.map((s) => (
                <label key={s.id} className="relative">
                  <input type="radio" name={group} value={s.id} checked={s.id === heat} onChange={() => setHeat(s.id)} className="peer sr-only" />
                  <span
                    className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-border px-1 text-xs font-medium uppercase tracking-[0.08em] text-silver transition-colors duration-150 peer-checked:border-champagne peer-checked:bg-champagne peer-checked:text-charcoal sm:px-3 sm:tracking-[0.12em] ${experienceRing}`}
                  >
                    {s.id === heat && <span aria-hidden="true">●</span>}
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-sm text-silver">{state.note}</p>
          </fieldset>

          <div className="mt-8 border-t border-border pt-6">
            <p className="font-display text-3xl font-medium tracking-[0.04em] text-ivory">{selected.name}</p>
            <p className="mt-2 text-base text-silver">{traits}</p>
          </div>
          <p role="status" className="sr-only">
            {selected.name}, estado {state.label.toLowerCase()}
          </p>
        </div>
      </GlassPanel>
    </section>
  );
}
