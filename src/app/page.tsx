import { GlassPanel } from "@/components/GlassPanel";
import { Hero } from "@/components/Hero";
import { getCollections } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="contenido">
      <Hero />

      {/* Provisional hasta D4: lista simple de colecciones; es el destino del CTA del hero. */}
      <section aria-labelledby="colecciones" className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-24 sm:px-8">
        <h2 id="colecciones" className="font-display text-3xl">Colecciones</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getCollections().map((c) => (
            <li key={c.id}>
              <GlassPanel className="h-full">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <p className="mt-1 text-muted">{c.tagline}</p>
              </GlassPanel>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
