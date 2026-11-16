import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLink } from "@/components/NavLink";
import { primaryNav } from "@/lib/routes";

export function GlassNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1rem,env(safe-area-inset-top))]">
      <nav
        aria-label="Principal"
        className="glass-nav mx-auto flex min-h-14 max-w-5xl items-center justify-between gap-6 rounded-full py-1.5 pl-6 pr-2 md:pr-8"
      >
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-2xl font-medium tracking-[0.14em] text-ivory">
          FUMEDIRO
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {primaryNav.map((r) => (
            <li key={r.label}>
              <NavLink route={r} className="inline-block py-3.5" />
            </li>
          ))}
        </ul>

        <MobileMenu>
          <ul className="grid grid-cols-1 py-2 [@media(max-height:480px)]:grid-cols-2 [@media(max-height:480px)]:gap-x-6">
            {primaryNav.map((r) => (
              <li key={r.label}>
                <NavLink route={r} className="block py-2.5 font-display text-3xl" />
              </li>
            ))}
          </ul>
          <p className="pt-3 text-sm text-silver">Otras secciones se abrirán por fases.</p>
        </MobileMenu>
      </nav>
    </header>
  );
}
