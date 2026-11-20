"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { GlassPanel } from "@/components/GlassPanel";
import { experienceEyebrow, PerfumePicker } from "@/components/PerfumePicker";
import type { Perfume } from "@/lib/types";

// Óptica por perfume. `mask` es la silueta aproximada del frasco en % sobre la foto: la luz solo actúa ahí,
// así que reaviva las facetas en vez de cruzar el fondo. `glow` y `shade` son provisionales (acentos de `collectionLight.ts`).
const optics: Record<string, { mask: string; glow: string; shade: string }> = {
  amethys: { mask: "ellipse 30% 50% at 50% 50%", glow: "142 99 181", shade: "28 14 52" },
  aureon: { mask: "ellipse 36% 46% at 48% 47%", glow: "199 173 131", shade: "84 52 20" },
  chroma: { mask: "ellipse 28% 50% at 51% 50%", glow: "169 211 230", shade: "20 40 80" },
};

// Tres capas, cada una con su modo de mezcla (el modo solo actúa sobre la foto si la capa no está agrupada con las otras):
//  · sombra (multiply): oscurece las caras que quedan fuera de la banda; da contraste también sobre fotos claras,
//  · brillo (overlay): realza la luminosidad de las facetas bajo la banda sin teñir de blanco,
//  · destellos (screen): dos filos finos que se mueven más rápido que la banda (paralaje de aristas).
const layers = (o: { glow: string; shade: string }) => [
  { blend: "mix-blend-multiply", speed: 0.5, image: `linear-gradient(105deg, rgb(${o.shade} / 0.6) 0%, transparent 36%, transparent 64%, rgb(${o.shade} / 0.6) 100%)` },
  { blend: "mix-blend-overlay", speed: 1, image: `linear-gradient(105deg, transparent 34%, rgb(255 255 255 / 0.7) 50%, transparent 66%)` },
  {
    blend: "mix-blend-screen",
    speed: 1.4,
    image: `linear-gradient(105deg, transparent 43%, rgb(255 255 255 / 0.75) 48%, transparent 50%, transparent 54%, rgb(${o.glow} / 0.8) 57%, transparent 59%)`,
  },
];

const fade = "transition-opacity duration-500 ease-out motion-reduce:transition-none";

/** Experiencia de PRISMATICA: un destello de luz exterior que barre el frasco según el regulador. Simulación visual. */
export function PrismaticaExperience({ perfumes, technology }: { perfumes: Perfume[]; technology: string }) {
  const [selectedId, setSelectedId] = useState(perfumes[0]?.id);
  const [angle, setAngle] = useState(50);
  const sliderId = useId();
  const selected = perfumes.find((p) => p.id === selectedId) ?? perfumes[0];
  if (!selected) return null;
  const traits = [selected.colorway, selected.specialFeature, selected.olfactoryFamily].filter(Boolean).join(" · ");
  const side = angle < 34 ? "izquierda" : angle > 66 ? "derecha" : "el centro";

  return (
    <section aria-labelledby="prismatica-exp-titulo" className="mt-[clamp(4rem,8vw,7rem)]">
      <GlassPanel className="grid gap-8 overflow-clip p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="prismatica-exp-titulo" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
            La luz que llega
          </h2>
          <p className="mt-3 max-w-[30rem] text-base leading-relaxed text-silver">
            Mueve el regulador y observa cómo la luz exterior recorre las facetas. Una simulación visual inspirada en{" "}
            {technology}, la tecnología conceptual de FUMEDIRO.
          </p>
        </div>

        {/* Escenario de proporción fija: cada foto (proporción propia) se centra con su destello encima, sin recortarse. */}
        <div className="relative isolate mx-auto aspect-[1312/1199] w-full max-w-[26rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
          {perfumes.map((p) => {
            const image = p.images[0];
            if (!image) return null;
            const active = p.id === selected.id;
            return (
              <div key={p.id} aria-hidden={!active} className={`absolute inset-0 grid place-items-center ${fade} ${active ? "opacity-100" : "opacity-0"}`}>
                <div className="relative w-full overflow-clip rounded-2xl" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 512px, (min-width: 768px) 416px, calc(100vw - 4rem)"
                    className="object-cover"
                  />
                  {/* Luz: solo transform, sin transición para seguir al dedo. */}
                  {optics[p.id] &&
                    layers(optics[p.id]!).map((l, i) => {
                      const mask = `radial-gradient(${optics[p.id]!.mask}, #000 60%, transparent 100%)`;
                      return (
                        <div key={i} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${l.blend}`} style={{ maskImage: mask, WebkitMaskImage: mask }}>
                          <div className="absolute inset-0" style={{ transform: `translateX(${(angle - 50) * 0.7 * l.speed}%)`, backgroundImage: l.image }} />
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <PerfumePicker perfumes={perfumes} value={selected.id} onChange={setSelectedId} />

          <div className="mt-6">
            <label htmlFor={sliderId} className={experienceEyebrow}>
              Dirección de la luz
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              aria-valuetext={`Luz desde ${side}`}
              className="mt-3 block h-11 w-full cursor-pointer accent-champagne focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus"
            />
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <p className="font-display text-3xl font-medium tracking-[0.04em] text-ivory">{selected.name}</p>
            <p className="mt-2 text-base text-silver">{traits}</p>
          </div>
        </div>
      </GlassPanel>
    </section>
  );
}
