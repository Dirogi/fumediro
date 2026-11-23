import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GlassButton } from "@/components/GlassButton";
import { GlassPanel } from "@/components/GlassPanel";
import { RevealOnView } from "@/components/RevealOnView";
import { StoryForms } from "@/components/StoryForms";
import { StoryUniverses } from "@/components/StoryUniverses";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Nuestra historia · Fumediro",
  description:
    "Fumediro, una marca imaginaria que explora el perfume a través de la forma, la luz y la materia. Proyecto conceptual de portfolio.",
};

const wrap = "mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)]";
const chapterPad = "py-[clamp(5rem,12vw,10rem)]";
const label = "reveal-fade font-display text-xl font-light text-silver";
const h2 = "reveal mt-3 font-display text-[clamp(2.25rem,6vw,5rem)] font-light leading-[1.02] text-ivory";
const body = "reveal text-base leading-relaxed text-silver md:text-lg";
const textLink =
  "inline-flex min-h-11 items-center text-sm font-medium text-ivory underline underline-offset-8 hover:text-champagne";

export default function StoryPage() {
  return (
    <main id="contenido" tabIndex={-1} className="pt-28">
      <div className={`${wrap} relative isolate`}>
        <div aria-hidden="true" className="diro-glow pointer-events-none absolute inset-0 -z-10" />
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Nuestra historia" }]} />
        <header className="pb-[clamp(4rem,9vw,8rem)] pt-12 md:pt-20">
          <h1 className="font-display text-[clamp(3.25rem,11vw,9rem)] font-light leading-[0.92] tracking-[0.01em] text-ivory">
            Nuestra historia.
          </h1>
          <p className="mt-8 max-w-[34rem] font-display text-[clamp(1.375rem,2.6vw,2rem)] font-light leading-snug text-silver">
            Una marca imaginaria que explora el perfume a través de la forma, la luz y la materia.
          </p>
        </header>
      </div>

      <section aria-labelledby="manifiesto" className={`${wrap} pb-[clamp(5rem,12vw,10rem)]`}>
        <p aria-hidden="true" className={label}>
          I
        </p>
        <h2 id="manifiesto" className={`${h2} max-w-[16em]`}>
          Un perfume no termina en su aroma.
        </h2>
        <div className="mt-10 grid gap-6 md:ml-[calc(100%/12*4)] md:max-w-[36rem]">
          <p className={body}>
            Una fragancia es invisible, pero el objeto que la contiene puede contar su propia historia.
          </p>
          <p className={body}>
            FUMEDIRO nace de esa idea: imaginar perfumes en los que el frasco no sea solo un recipiente, sino parte de la
            experiencia. Su forma, su color y su relación con la luz anticipan algo de lo que todavía no podemos oler.
          </p>
        </div>
        <p
          lang="en"
          className="reveal mt-16 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-light italic leading-tight text-champagne md:mt-24"
        >
          Beyond scent. Beyond form.
        </p>
      </section>

      <section aria-labelledby="forma" className={`overflow-clip bg-graphite ${chapterPad}`}>
        <div className={wrap}>
          <p aria-hidden="true" className={label}>
            II
          </p>
          <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
            <h2 id="forma" className={h2}>
              La forma también habla.
            </h2>
            <div className="grid gap-6 lg:pt-4">
              <p className={body}>
                Una esfera concentra la luz. Una faceta multiplica los reflejos. Una estructura de pétalos transforma un
                frasco en una flor imaginaria.
              </p>
              <p className={body}>
                Cada colección explora un lenguaje visual propio, donde la geometría y el color son tan importantes como
                la identidad de la fragancia.
              </p>
              <p className={body}>
                Ese ejercicio de imaginación se extiende a DiroCore™, una familia ficticia de materiales concebida para
                explorar posibilidades de diseño que van más allá de las convencionales.
              </p>
            </div>
          </div>
          <div className="mt-16 md:mt-24">
            <StoryForms />
          </div>
        </div>
      </section>

      <section aria-labelledby="universos" className={`${wrap} ${chapterPad}`}>
        <p aria-hidden="true" className={label}>
          III
        </p>
        <h2 id="universos" className={`${h2} mb-12 md:mb-16`}>
          Cinco formas de imaginar.
        </h2>
        <StoryUniverses />
      </section>

      <section aria-labelledby="invitacion" className={`${wrap} relative isolate pb-[clamp(5rem,10vw,9rem)]`}>
        <div aria-hidden="true" className="diro-glow pointer-events-none absolute inset-0 -z-10" />
        <GlassPanel className="reveal p-8 md:p-14">
          <p aria-hidden="true" className={label}>
            IV
          </p>
          <h2
            id="invitacion"
            className="mt-3 font-display text-[clamp(2.25rem,6vw,5rem)] font-light leading-[1.02] text-ivory"
          >
            Empieza por donde quieras.
          </h2>
          <p className="mt-8 max-w-[36rem] text-base leading-relaxed text-silver md:text-lg">
            Explora los cinco universos, descubre sus quince fragancias o deja que cuatro preguntas te ayuden a encontrar
            tu favorita.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2">
            <GlassButton href={routes.quiz.href}>Descubre tu aroma</GlassButton>
            <Link href={routes.perfumes.href} className={textLink}>
              Ver los quince perfumes
            </Link>
            <Link href={routes.collections.href} className={textLink}>
              Explorar colecciones
            </Link>
          </div>
          <p className="mt-12 max-w-[40rem] border-t border-border pt-6 text-sm leading-relaxed text-silver">
            FUMEDIRO es una marca y un proyecto conceptual de portfolio. Sus perfumes, materiales y tecnologías son
            ficticios; no se trata de una tienda operativa.
          </p>
        </GlassPanel>
      </section>
      <RevealOnView />
    </main>
  );
}
