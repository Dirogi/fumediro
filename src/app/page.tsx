import { GlassPanel } from "@/components/GlassPanel";
import { getCollections } from "@/lib/catalog";

export default function Home() {
  return (
    <main id="contenido" className="mx-auto flex min-h-[70dvh] max-w-5xl flex-col gap-12 px-4 pb-16 pt-32 sm:px-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-[clamp(3rem,10vw,6rem)] font-light tracking-wide">FUMEDIRO</h1>
        <p className="text-lg text-muted">Beyond scent. Beyond form.</p>
      </header>

      <section aria-labelledby="colecciones" className="flex flex-col gap-6">
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
