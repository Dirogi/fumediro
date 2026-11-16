import { NavLink } from "@/components/NavLink";
import { footerNav } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-[max(1rem,5vw)] py-12">
        <p className="font-display text-2xl font-medium tracking-[0.14em]">FUMEDIRO</p>
        <nav aria-label="Secundaria">
          <ul className="flex flex-wrap gap-x-8 text-sm">
            {footerNav.map((r) => (
              <li key={r.label}>
                <NavLink route={r} className="inline-block py-3.5" />
              </li>
            ))}
          </ul>
        </nav>
        <p className="max-w-prose text-sm text-silver">
          Fumediro es una marca y un proyecto conceptual de portfolio; no es una tienda operativa.
          DiroCore™ y sus tecnologías son ficticias.
        </p>
      </div>
    </footer>
  );
}
