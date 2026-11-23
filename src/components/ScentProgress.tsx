// Progreso visual. Es decorativo para tecnologías de asistencia: «Pregunta n de N» ya forma parte del
// nombre accesible del grupo (legend) y el foco lo anuncia al cambiar de pregunta, así que no se repite.
export function ScentProgress({ step, total }: { step: number; total: number }) {
  return (
    <div aria-hidden="true">
      <p className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] text-silver">
        Pregunta {step} de {total}
      </p>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-0.5 flex-1 rounded-full ${i < step ? "bg-champagne" : "bg-border"}`} />
        ))}
      </div>
    </div>
  );
}
