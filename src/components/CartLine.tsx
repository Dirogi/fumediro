"use client";

import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { MAX_QTY } from "@/lib/cart";
import type { CartLineView } from "@/lib/cartView";
import { formatEUR } from "@/lib/money";

const qtyBtn =
  "inline-flex min-h-11 min-w-11 items-center justify-center text-lg text-ivory transition-transform duration-150 ease-out active:scale-[0.94] disabled:cursor-not-allowed disabled:text-silver/60";

/** Una línea del carrito. `onEmptied` recoge el foco cuando la línea desaparece. */
export function CartLine({ line, onEmptied }: { line: CartLineView; onEmptied: () => void }) {
  const { increment, decrement, remove } = useCart();
  const { perfume, collection, qty } = line;
  const image = perfume.images[0];

  return (
    <li className="flex gap-4 border-b border-border py-5">
      {image && (
        <ProductImage image={image} sizes="80px" decorative className="h-fit w-20 shrink-0 rounded-lg border border-border" />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-2xl font-medium leading-none tracking-[0.06em] text-ivory">{perfume.name}</h3>
        {collection && <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em] text-silver">{collection.name}</p>}
        <p className="mt-1 text-sm text-silver">{formatEUR(line.unitCents)} por unidad</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <div role="group" aria-label={`Cantidad de ${perfume.name}`} className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              aria-label={`Reducir cantidad de ${perfume.name}`}
              className={qtyBtn}
              onClick={() => {
                decrement(perfume.id);
                if (qty === 1) onEmptied();
              }}
            >
              <span aria-hidden="true">−</span>
            </button>
            <span className="min-w-6 text-center text-sm font-medium tabular-nums text-ivory">{qty}</span>
            <button
              type="button"
              aria-label={`Aumentar cantidad de ${perfume.name}`}
              disabled={qty >= MAX_QTY}
              className={qtyBtn}
              onClick={() => increment(perfume.id)}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <p className="text-base font-medium tabular-nums text-ivory">{formatEUR(line.lineCents)}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            remove(perfume.id);
            onEmptied();
          }}
          aria-label={`Eliminar ${perfume.name} de tu selección`}
          className="mt-1 inline-flex min-h-11 items-center text-sm text-silver underline decoration-border underline-offset-4 transition-colors hover:text-ivory hover:decoration-current"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
