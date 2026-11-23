import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GlassButton } from "@/components/GlassButton";
import { GlassPanel } from "@/components/GlassPanel";
import { RevealOnView } from "@/components/RevealOnView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contacto · Fumediro",
  description:
    "Contacta con el creador de FUMEDIRO, un proyecto conceptual de diseño y desarrollo web.",
  path: "/contacto",
});

const EMAIL_HREF = "mailto:diegogastonsahun@gmail.com?subject=Sobre%20FUMEDIRO";
const PORTFOLIO_URL = "https://portfolio-web-diego-gaston-sahun.vercel.app/es";

const wrap = "mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)]";

export default function ContactPage() {
  return (
    <main id="contenido" tabIndex={-1} className="pt-28">
      <div className={`${wrap} relative isolate`}>
        <div aria-hidden="true" className="diro-glow pointer-events-none absolute inset-0 -z-10" />
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]} />
        <header className="pb-[clamp(3rem,7vw,6rem)] pt-12 md:pt-20">
          <h1 className="max-w-[12em] font-display text-[clamp(3rem,9vw,7.5rem)] font-light leading-[0.95] tracking-[0.01em] text-ivory">
            Toda idea empieza con una conversación.
          </h1>
          <p className="mt-8 max-w-[38rem] font-display text-[clamp(1.375rem,2.6vw,2rem)] font-light leading-snug text-silver">
            FUMEDIRO es un proyecto conceptual de diseño y desarrollo web. Si te interesa conocer cómo está construido,
            compartir una idea o plantear una colaboración, puedes ponerte en contacto con su creador.
          </p>
        </header>
      </div>

      <div className={`${wrap} grid gap-12 pb-[clamp(5rem,10vw,9rem)] lg:grid-cols-12 lg:gap-y-0`}>
        <section aria-label="Vías de contacto" className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <GlassPanel className="reveal flex flex-col items-start gap-6 p-8 md:p-12">
            <GlassButton href={EMAIL_HREF}>Escribir un correo</GlassButton>
            <GlassButton variant="secondary" href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
              Ver mi portfolio
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </GlassButton>
          </GlassPanel>
        </section>

        <section aria-labelledby="ideas" className="order-2 lg:order-1 lg:col-span-6">
          <h2
            id="ideas"
            className="reveal font-display text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.02] text-ivory"
          >
            Hablemos de ideas.
          </h2>
          <p className="reveal mt-8 max-w-[30rem] text-base leading-relaxed text-silver md:text-lg">
            Diseño digital, desarrollo web, experiencias interactivas y nuevas posibilidades creativas.
          </p>
        </section>
      </div>

      <div className="bg-graphite">
        <div className={`${wrap} py-10 md:py-14`}>
          <p className="reveal-fade max-w-[40rem] text-sm leading-relaxed text-silver">
            FUMEDIRO es una marca ficticia creada como proyecto de portfolio. No es una tienda operativa.
          </p>
        </div>
      </div>
      <RevealOnView />
    </main>
  );
}
