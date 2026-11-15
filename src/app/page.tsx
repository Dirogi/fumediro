import { ClosingCta } from "@/components/ClosingCta";
import { CollectionIndex } from "@/components/CollectionIndex";
import { DiroCore } from "@/components/DiroCore";
import { Hero } from "@/components/Hero";
import { RevealOnView } from "@/components/RevealOnView";

export default function Home() {
  return (
    // tabIndex -1: el skip link ("#contenido") deja el foco aquí, no en <body>.
    <main id="contenido" tabIndex={-1}>
      <Hero />

      <div className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(3rem,6vw,5.5rem)] pt-[clamp(4.5rem,9vw,8rem)]">
        <p className="reveal mx-auto max-w-[20em] text-balance text-center font-display text-[clamp(1.875rem,4.6vw,4rem)] font-light leading-[1.12] text-ivory">
          Fragancias concebidas como experiencias olfativas y objetos escultóricos.
        </p>
      </div>

      <CollectionIndex />
      <DiroCore />
      <ClosingCta />
      <RevealOnView />
    </main>
  );
}
