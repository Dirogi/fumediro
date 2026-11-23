"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { GlassPanel } from "@/components/GlassPanel";
import { ScentQuestion } from "@/components/ScentQuestion";
import { ScentResult } from "@/components/ScentResult";
import { dimensionLabels, questions, type Answers } from "@/data/scentFinder";
import { parseAnswers, recommend } from "@/lib/scentFinder";

// Las respuestas viven solo en este estado de React: no se guardan ni se envían.
type Phase = "welcome" | "done" | number; // número = índice de pregunta

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";

export function ScentFinder() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [selection, setSelection] = useState<Partial<Answers>>({});
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const stepRef = useRef<HTMLLegendElement & HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // El resultado se deriva de las respuestas vigentes (nunca se guarda): cambiar una respuesta lo recalcula.
  const result = useMemo(() => {
    const answers = phase === "done" ? parseAnswers(selection) : null;
    return answers && recommend(answers);
  }, [phase, selection]);

  // Gestión de foco: al cambiar de pantalla el foco pasa a su título (se anuncia una sola vez); no al cargar.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const target = (phase === "welcome" ? h1Ref : stepRef).current;
    if (!target) return;
    target.focus({ preventScroll: true });
    // Pantallas de distinta altura: se alinea el título arriba (el scroll-padding de <html> deja sitio a la cabecera fija).
    target.scrollIntoView({ block: "start" });
  }, [phase]);

  const reset = () => {
    setSelection({});
    setPhase("welcome");
  };
  const back = () => setPhase((p) => (p === "done" ? questions.length - 1 : p === 0 ? "welcome" : (p as number) - 1));
  const next = () => {
    if (typeof phase !== "number") return;
    if (phase < questions.length - 1) return setPhase(phase + 1);
    const answers = parseAnswers(selection);
    if (answers && recommend(answers)) setPhase("done"); // solo avanza con las cuatro respuestas válidas
  };

  const welcome = phase === "welcome";
  const q = typeof phase === "number" ? questions[phase] : undefined;

  return (
    <div>
      {phase !== "done" && (
        <h1
          ref={h1Ref}
          tabIndex={-1}
          className={
            welcome
              ? "mt-8 font-display text-[clamp(3rem,9vw,6.5rem)] font-light leading-[0.95] tracking-[0.02em] text-ivory md:mt-12"
              : `mt-8 md:mt-12 ${eyebrow}`
          }
        >
          Descubre tu aroma{welcome ? "." : ""}
        </h1>
      )}

      {welcome && (
        <div className="scent-step mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-16">
          <div className="max-w-[38rem]">
            <p className="text-lg leading-relaxed text-silver md:text-xl">
              Un recorrido de cuatro preguntas por tus preferencias estéticas y olfativas: color, territorio, forma e idea.
              No hay respuestas correctas; sirven para orientarte entre los quince perfumes de Fumediro.
            </p>
            <div className="mt-10">
              <GlassButton onClick={() => setPhase(0)}>Comenzar</GlassButton>
            </div>
            <p className="mt-6 text-sm text-silver">
              Tus respuestas no se almacenan ni se envían: solo existen en esta página mientras la tienes abierta.
            </p>
          </div>
          <GlassPanel className="p-6 md:p-8">
            <p className={eyebrow}>Tu recorrido</p>
            <ol className="mt-5 divide-y divide-border">
              {questions.map((question, i) => (
                <li key={question.dimension} className="flex items-baseline gap-4 py-3 text-ivory">
                  <span className="font-display text-2xl text-champagne">{String(i + 1).padStart(2, "0")}</span>
                  <span>{dimensionLabels[question.dimension]}</span>
                </li>
              ))}
            </ol>
          </GlassPanel>
        </div>
      )}

      {q && typeof phase === "number" && (
        <ScentQuestion
          key={q.dimension}
          question={q}
          step={phase + 1}
          total={questions.length}
          value={selection[q.dimension]}
          onChange={(id) => setSelection((s) => ({ ...s, [q.dimension]: id }))}
          onNext={next}
          onBack={back}
          onReset={reset}
          legendRef={stepRef}
        />
      )}

      {result && <ScentResult result={result} titleRef={stepRef} onChange={back} onReset={reset} />}
    </div>
  );
}
