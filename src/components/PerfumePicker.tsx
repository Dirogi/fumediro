"use client";

import { useId } from "react";
import type { Perfume } from "@/lib/types";

export const experienceEyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";
export const experienceRing = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-focus";

/** Selector de perfume de una experiencia de colección: radios nativos (teclado y lector gratis). */
export function PerfumePicker({ perfumes, value, onChange }: { perfumes: Perfume[]; value: string; onChange: (id: string) => void }) {
  const group = useId();
  return (
    <fieldset>
      <legend className={experienceEyebrow}>Perfume</legend>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {perfumes.map((p) => (
          <label key={p.id} className="relative">
            <input type="radio" name={group} value={p.id} checked={p.id === value} onChange={() => onChange(p.id)} className="peer sr-only" />
            <span
              className={`flex min-h-11 items-center justify-center rounded-full border border-border px-1 text-xs font-medium uppercase tracking-[0.08em] sm:px-3 sm:tracking-[0.12em] text-silver transition-colors duration-150 peer-checked:border-champagne peer-checked:bg-champagne peer-checked:text-charcoal ${experienceRing}`}
            >
              {p.name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
