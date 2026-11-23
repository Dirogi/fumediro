import Link from "next/link";
import { collectionLight } from "@/components/collectionLight";
import { universeLines } from "@/data/story";
import { getCollections } from "@/lib/catalog";
import { toRoman } from "@/lib/roman";
import { collectionRoute, resolveHref } from "@/lib/routes";

/**
 * Cinco filas-enlace. La luz de colección aparece con hover y foco; es solo ambiental:
 * nombre, frase y enlace son legibles siempre (también en táctil). La envoltura aplica la opacidad
 * para no chocar con RevealOnView, que gestiona la de `.light-sig`.
 */
export function StoryUniverses() {
  return (
    <ul className="border-t border-border">
      {getCollections().map((c, i) => {
        const href = resolveHref(collectionRoute(c.slug, c.name));
        const body = (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition-opacity motion-safe:duration-300"
            >
              <div className="light-sig" data-sig={c.id} style={{ backgroundImage: collectionLight[c.id] }} />
            </div>
            <div className="reveal relative grid gap-x-8 gap-y-2 py-9 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:items-center md:py-12">
              <span aria-hidden="true" className="font-display text-2xl font-light text-silver">
                {toRoman(i + 1)}
              </span>
              <div>
                <span className="block font-display text-[clamp(2rem,8vw,3.25rem)] font-medium leading-[0.95] tracking-[0.04em] text-ivory">
                  {c.name}
                </span>
                <span className="mt-3 block max-w-[28rem] text-base text-ivory/90">{universeLines[c.id]}</span>
              </div>
              <span aria-hidden="true" className="mt-2 text-2xl text-champagne md:mt-0 md:pr-4">
                →
              </span>
            </div>
          </>
        );
        const cls = "group relative isolate block overflow-clip border-b border-border";
        return (
          <li key={c.id}>
            {href ? (
              <Link href={href} className={cls}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
