import Link from "next/link";

export interface Crumb {
  label: string;
  /** Ausente en el último elemento (página actual). */
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-silver">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-x-2">
              {c.href && !last ? (
                <Link href={c.href} className="underline underline-offset-4 hover:text-ivory">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ivory" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
