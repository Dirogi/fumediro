// Contenido: PRODUCT.md §4. Tecnologías conceptuales; sin especificaciones, cifras ni certificaciones.
const technologies = [
  { name: "LumaCore™", domain: "Luz" },
  { name: "Nebula Chamber™", domain: "Cámara de partículas" },
  { name: "PrismaLayer™", domain: "Óptica" },
  { name: "ThermaSkin™", domain: "Termorreactividad" },
];

export function DiroCore() {
  return (
    <section
      aria-labelledby="dirocore"
      className="relative isolate mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,9rem)] pt-[clamp(1rem,3vw,3rem)]"
    >
      {/* Luz tenue tras el panel: sin ella el cristal no tiene nada que difuminar. */}
      <div aria-hidden="true" className="diro-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-5">
          <h2
            id="dirocore"
            className="font-display text-[clamp(3rem,7vw,6.5rem)] font-light leading-none tracking-[0.02em] text-ivory"
          >
            DiroCore™
          </h2>
          <p className="mt-8 max-w-[34rem] text-lg leading-relaxed text-ivory/90">
            Una familia de materiales conceptual de Fumediro: imagina vidrios avanzados, compuestos
            cerámicos y superficies de gran resistencia.
          </p>
          <p className="mt-6 inline-flex rounded-full border border-champagne/50 px-4 py-1.5 text-sm text-champagne">
            Concepto de marca
          </p>
        </div>

        <div className="glass-band p-6 md:p-10 lg:col-span-7 xl:col-span-6 xl:col-start-7">
          <h3 className="sr-only">Tecnologías de DiroCore™</h3>
          <dl>
            {technologies.map((t, i) => (
              <div
                key={t.name}
                className={`grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8 ${
                  i === 0 ? "pt-0" : "border-t border-border"
                }`}
              >
                <dt className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] font-medium leading-tight text-ivory">
                  {t.name}
                </dt>
                <dd className="text-sm text-silver">{t.domain}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 border-t border-border pt-6 text-sm leading-relaxed text-silver">
            Tecnologías conceptuales del universo ficticio de Fumediro: no son especificaciones ni
            resultados de laboratorio.
          </p>
        </div>
      </div>
    </section>
  );
}
