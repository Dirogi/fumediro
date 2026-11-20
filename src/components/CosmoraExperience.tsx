"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { GlassButton } from "@/components/GlassButton";
import { GlassPanel } from "@/components/GlassPanel";
import { experienceEyebrow, PerfumePicker } from "@/components/PerfumePicker";
import { LAST_PARTICLE, particles } from "@/lib/cosmoraParticles";
import type { Perfume } from "@/lib/types";

// Atmósfera de la cámara por perfume, a partir de los colores aprobados (verde polar/azul petróleo, cobre oscuro/negro,
// azul oscuro/plata). `a` tiñe las partículas y el resplandor; `b` el fondo. provisional: sin consolidar como tokens.
const mood: Record<string, { a: string; b: string }> = {
  aurora: { a: "88 205 175", b: "22 78 92" },
  eclipse: { a: "214 140 96", b: "96 50 38" },
  orion: { a: "205 212 230", b: "44 66 140" },
};

const STAGE = 1312 / 1199;
const fade = "transition-opacity duration-500 ease-out motion-reduce:transition-none";

type Phase = "rest" | "moving" | "scattered";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(subscribe, () => window.matchMedia(reducedQuery).matches, () => false);

/** Experiencia de COSMORA: una cámara decorativa de partículas que el visitante agita; vuelve sola al reposo. Simulación visual. */
export function CosmoraExperience({ perfumes, technology }: { perfumes: Perfume[]; technology: string }) {
  const [selectedId, setSelectedId] = useState(perfumes[0]?.id);
  const [phase, setPhase] = useState<Phase>("rest");
  // `run` cambia en cada agitación: remonta las partículas y reinicia la animación, sin acumular ni dejar estados a medias.
  const [run, setRun] = useState(0);
  // Último evento anunciado (región `status`): se redacta como hecho puntual, no como estado, para no quedar obsoleto.
  const [note, setNote] = useState<"" | "agitated" | "rest">("");
  const reduced = useReducedMotion();
  // Si la preferencia cambia en vivo, el CSS retira la animación al instante y `animationend` nunca llegaría:
  // se resuelve aquí (ajuste de estado durante el render, sin efectos ni timers).
  //  · activa y en movimiento → el estado estático equivalente (agitada); · desactivada y estática → reposo normal.
  const [prevReduced, setPrevReduced] = useState(reduced);
  if (reduced !== prevReduced) {
    setPrevReduced(reduced);
    if (reduced && phase === "moving") setPhase("scattered");
    else if (!reduced && phase === "scattered") {
      setPhase("rest");
      setNote("rest");
    }
  }
  const selected = perfumes.find((p) => p.id === selectedId) ?? perfumes[0];
  if (!selected) return null;
  const m = mood[selected.id];
  const traits = [selected.colorway, selected.specialFeature, selected.olfactoryFamily].filter(Boolean).join(" · ");

  const shake = () => {
    if (reduced) {
      const next = phase === "scattered" ? "rest" : "scattered";
      setPhase(next);
      setNote(next === "rest" ? "rest" : "agitated");
    } else {
      setPhase("moving");
      setRun((n) => n + 1);
      setNote("agitated");
    }
  };
  const pick = (id: string) => {
    setSelectedId(id);
    setNote("");
  };
  const stateText = phase === "moving" ? "En movimiento" : phase === "scattered" ? "Agitada" : "En reposo";

  return (
    <section aria-labelledby="cosmora-exp-titulo" className="mt-[clamp(4rem,8vw,7rem)]">
      <GlassPanel className="grid gap-8 overflow-clip p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-x-16">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 id="cosmora-exp-titulo" className="font-display text-[clamp(2rem,4vw,3.25rem)] font-light text-ivory">
            Un universo contenido
          </h2>
          <p className="mt-3 max-w-[30rem] text-base leading-relaxed text-silver">
            Cada frasco guarda una cámara sellada. Agítala y observa cómo se mueven sus partículas antes de volver al reposo. Una
            simulación visual inspirada en {technology}, la tecnología conceptual de FUMEDIRO.
          </p>
        </div>

        <div className="relative isolate mx-auto aspect-[1312/1199] w-full max-w-[26rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none lg:self-center">
          {perfumes.map((p) => {
            const image = p.images[0];
            if (!image) return null;
            const active = p.id === selected.id;
            return (
              <div key={p.id} aria-hidden={!active} className={`absolute inset-0 grid place-items-center ${fade} ${active ? "opacity-100" : "opacity-0"}`}>
                <div
                  className={`relative overflow-clip rounded-2xl ${image.width / image.height >= STAGE ? "w-full" : "h-full"}`}
                  style={{ aspectRatio: `${image.width} / ${image.height}` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 512px, (min-width: 768px) 416px, calc(100vw - 4rem)"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <PerfumePicker perfumes={perfumes} value={selected.id} onChange={pick} />

          {/* Cámara: decorativa e independiente de la foto. El estado importante también está como texto. */}
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className={experienceEyebrow}>Cámara decorativa</p>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-ivory">{stateText}</p>
            </div>
            <div
              aria-hidden="true"
              data-moving={phase === "moving"}
              data-scattered={phase === "scattered"}
              className="relative mt-3 aspect-[5/2] overflow-clip rounded-2xl border border-border"
              style={{
                backgroundColor: "rgb(9 11 15)",
                backgroundImage: m
                  ? `radial-gradient(ellipse 60% 90% at 25% 40%, rgb(${m.b} / 0.5), transparent), radial-gradient(ellipse 50% 70% at 78% 70%, rgb(${m.a} / 0.16), transparent)`
                  : undefined,
              }}
            >
              <div
                key={run}
                className="absolute inset-0"
                onAnimationEnd={(e) => {
                  if (e.target === e.currentTarget.children[LAST_PARTICLE]) setPhase("rest");
                }}
              >
                {particles.map((p, i) => (
                  <span
                    key={i}
                    className="cosmora-particle absolute rounded-full"
                    style={
                      {
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        opacity: p.rest,
                        backgroundColor: m ? `rgb(${m.a})` : undefined,
                        boxShadow: m ? `0 0 ${p.size * 2}px rgb(${m.a} / 0.5)` : undefined,
                        "--dx": `${p.dx}px`,
                        "--dy": `${p.dy}px`,
                        "--rest": p.rest,
                        "--delay": `${p.delay}s`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-silver">Partículas decorativas: no son ingredientes de la fragancia.</p>
          </div>

          <GlassButton onClick={shake} className="mt-5">
            {reduced && phase === "scattered" ? "Devolver al reposo" : "Agitar la cámara"}
          </GlassButton>

          <div className="mt-8 border-t border-border pt-6">
            <p className="font-display text-3xl font-medium tracking-[0.04em] text-ivory">{selected.name}</p>
            <p className="mt-2 text-base text-silver">{traits}</p>
          </div>
          {/* Un solo aviso por perfume y por acción; el regreso automático al reposo (1,2 s) no se anuncia, el explícito sí. */}
          <p role="status" className="sr-only">
            {selected.name}
            {note === "agitated" ? ": se ha agitado la cámara" : note === "rest" ? ": la cámara vuelve al reposo" : ""}
          </p>
        </div>
      </GlassPanel>
    </section>
  );
}
