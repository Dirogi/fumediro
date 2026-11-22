import type { Ref } from "react";
import { GlassButton } from "@/components/GlassButton";
import { ScentProgress } from "@/components/ScentProgress";
import { getCollections } from "@/lib/catalog";
import type { Dimension, ScentOption, ScentQuestion as Question } from "@/data/scentFinder";

// Muestras CSS decorativas. Los tonos reutilizan los acentos provisionales ya definidos en collectionLight.ts.
const DOTS: Record<string, string[]> = {
  verdes: ["#2FB58A", "#4FA58B"],
  "azules-plata": ["#3B5BA8", "#A9D3E6", "#B9C0C7"],
  "rosas-corales": ["#E8806A", "#D98A9A"],
  "magenta-violeta": ["#C2308A", "#8E63B5"],
  "oro-cobre-tierra": ["#C7AD83", "#B8714A", "#B5593C"],
  voltara: ["#C2308A", "#E0A33A"],
  "flora-arcana": ["#4FA58B", "#E8806A"],
  cosmora: ["#3B5BA8", "#B8714A"],
  prismatica: ["#8E63B5", "#A9D3E6"],
  thermae: ["#D98A9A", "#B5593C"],
};

const SHAPES: Record<string, string> = {
  "curvas-botanicas": "rounded-[60%_0_60%_0] border border-champagne",
  "facetas-geometria": "bg-champagne/70 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)]",
  "luz-reflejos":
    "rounded-full border border-champagne/60 bg-[radial-gradient(circle,#f2eee6_0_14%,rgb(199_173_131/0.5)_15%_45%,transparent_46%)]",
  "volumenes-vetas":
    "rounded-xl border border-silver/50 bg-[repeating-linear-gradient(120deg,transparent_0_5px,rgb(185_192_199/0.35)_5px_6px)]",
};

function Swatch({ dimension, id }: { dimension: Dimension; id: string }) {
  if (dimension === "palette" || dimension === "concept") {
    return (
      <span aria-hidden="true" className="flex w-14 shrink-0">
        {DOTS[id]?.map((c) => (
          <span key={c} className="first:ml-0 -ml-2 size-6 rounded-full border border-charcoal" style={{ background: c }} />
        ))}
      </span>
    );
  }
  if (dimension === "shape") return <span aria-hidden="true" className={`size-9 shrink-0 ${SHAPES[id] ?? ""}`} />;
  return null;
}

interface Props {
  question: Question;
  step: number;
  total: number;
  value: string | undefined;
  onChange: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  /** Objetivo del foco al llegar a esta pregunta. */
  legendRef: Ref<HTMLLegendElement>;
}

export function ScentQuestion({ question, step, total, value, onChange, onNext, onBack, onReset, legendRef }: Props) {
  const last = step === total;
  const collectionNames = Object.fromEntries(getCollections().map((c) => [c.id, c.name]));
  const hintFor = (o: ScentOption) => (question.dimension === "concept" ? (collectionNames[o.id] ?? o.hint) : o.hint);
  const ready = value !== undefined;

  return (
    <section className="scent-step mt-8 max-w-4xl md:mt-12">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0 flex-1">
          <ScentProgress step={step} total={total} />
        </div>
        <button
          type="button"
          onClick={onReset}
          className="-mb-2 min-h-11 shrink-0 px-2 text-sm text-silver underline underline-offset-4 hover:text-ivory"
        >
          Reiniciar
        </button>
      </div>

      <fieldset className="mt-8 min-w-0 md:mt-10">
        <legend
          ref={legendRef}
          tabIndex={-1}
          className="mb-8 w-full font-display text-[clamp(2.1rem,6vw,3.75rem)] font-light leading-[1.05] tracking-[0.02em] text-ivory md:mb-10"
        >
          <span className="sr-only">
            Pregunta {step} de {total}:{" "}
          </span>
          {question.title}
        </legend>

        <div className="grid gap-3 sm:grid-cols-2">
          {question.options.map((o) => {
            const selected = value === o.id;
            return (
              <label key={o.id} className="block cursor-pointer">
                <input
                  type="radio"
                  name={question.dimension}
                  value={o.id}
                  checked={selected}
                  onChange={() => onChange(o.id)}
                  className="peer sr-only"
                />
                <span
                  className={`glass-panel flex min-h-[4.75rem] items-center gap-4 rounded-2xl px-5 py-4 transition-[border-color,background-color] duration-150 ease-out peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus ${
                    selected ? "border-champagne bg-champagne/10" : "hover:border-silver"
                  }`}
                >
                  <Swatch dimension={question.dimension} id={o.id} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg leading-snug text-ivory">{o.label}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-silver">{hintFor(o)}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-champagne bg-champagne text-charcoal" : "border-silver/60"
                    }`}
                  >
                    {selected && (
                      <svg viewBox="0 0 12 12" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m2.5 6.2 2.4 2.4 4.6-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <GlassButton variant="secondary" onClick={onBack}>
          Atrás
        </GlassButton>
        <GlassButton
          aria-disabled={!ready}
          aria-describedby={ready ? undefined : "scent-continue-hint"}
          onClick={() => ready && onNext()}
          className="aria-disabled:cursor-not-allowed aria-disabled:border aria-disabled:border-border aria-disabled:bg-transparent aria-disabled:text-silver aria-disabled:hover:bg-transparent"
        >
          {last ? "Ver mi recomendación" : "Continuar"}
        </GlassButton>
        {!ready && (
          <p id="scent-continue-hint" className="text-sm text-silver">
            Elige una opción para continuar.
          </p>
        )}
      </div>
    </section>
  );
}
