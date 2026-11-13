import { NavLink } from "@/components/NavLink";
import { footerNav } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-8">
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
