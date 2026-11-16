import { NavLink } from "@/components/NavLink";
import { routes } from "@/lib/routes";

// El título es el CTA: inactivo (texto punteado, sin foco) hasta que exista /descubre-tu-aroma.
export function ClosingCta() {
  return (
    <section aria-labelledby="descubre" className="mx-auto w-full max-w-[90rem] px-[max(1rem,5vw)]">
      <div className="grid gap-6 border-t border-border py-[clamp(4rem,8vw,7rem)] md:grid-cols-[1fr_minmax(0,24rem)] md:items-end md:gap-12">
        <h2 id="descubre" className="reveal font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-none">
          <NavLink route={routes.quiz} className="font-light" />
        </h2>
        <p className="reveal text-base leading-relaxed text-silver">
          Una experiencia para explorar tus preferencias y descubrir tu universo olfativo.
        </p>
      </div>
    </section>
  );
}
