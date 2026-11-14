import { GlassButton } from "@/components/GlassButton";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { resolveHref, routes } from "@/lib/routes";

export function Hero() {
  const href = resolveHref(routes.collections);

  return (
    <section
      aria-labelledby="marca"
      className="hero relative isolate flex min-h-[max(34rem,100svh)] flex-col overflow-hidden pb-[var(--hero-pb)] pt-[var(--hero-pt)] [justify-content:var(--hero-justify)] [@media(max-height:480px)]:min-h-svh"
    >
      <HeroBackdrop />

      <div className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)]">
        <h1
          id="marca"
          className="hero-wordmark whitespace-nowrap font-display font-light uppercase leading-[0.9] tracking-[0.05em] text-ivory md:tracking-[0.1em] xl:tracking-[0.12em]"
        >
          Fumediro
        </h1>

        <div className="glass-band flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-5 [@media(max-height:480px)]:flex-row [@media(max-height:480px)]:items-center [@media(max-height:480px)]:justify-between [@media(max-height:480px)]:py-3">
          <p
            lang="en"
            className="text-balance font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-light leading-tight text-ivory [@media(max-height:480px)]:text-xl"
          >
            Beyond scent. Beyond form.
          </p>
          {href && (
            <GlassButton href={href} className="w-full md:w-auto [@media(max-height:480px)]:w-auto">
              Explorar colecciones
            </GlassButton>
          )}
        </div>
      </div>
    </section>
  );
}
