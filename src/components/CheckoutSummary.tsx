import { ProductImage } from "@/components/ProductImage";
import { subtotal, type Cart } from "@/lib/cart";
import { getCartLines } from "@/lib/cartView";
import { formatEUR, getDemoPrice } from "@/lib/money";

/** Líneas y total de demostración de una selección. Total = subtotal (sin envío, impuestos ni descuentos). */
export function CheckoutSummary({ cart }: { cart: Cart }) {
  const lines = getCartLines(cart);
  const total = formatEUR(subtotal(cart, getDemoPrice));

  return (
    <div>
      <ul className="border-y border-border">
        {lines.map((l) => {
          const image = l.perfume.images[0];
          return (
            <li key={l.perfume.id} className="flex gap-4 border-b border-border py-4 last:border-b-0">
              {image && <ProductImage image={image} sizes="64px" decorative className="h-fit w-16 shrink-0 rounded-lg border border-border" />}
              <div className="min-w-0 flex-1">
                <p className="font-display text-2xl font-medium leading-none tracking-[0.06em] text-ivory">{l.perfume.name}</p>
                {l.collection && <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.18em] text-silver">{l.collection.name}</p>}
                <p className="mt-1 text-sm tabular-nums text-silver">
                  {l.qty} × {formatEUR(l.unitCents)}
                </p>
              </div>
              <p className="text-base font-medium tabular-nums text-ivory">{formatEUR(l.lineCents)}</p>
            </li>
          );
        })}
      </ul>
      <dl className="mt-6 space-y-3 tabular-nums">
        <div className="flex items-baseline justify-between gap-4 text-sm text-silver">
          <dt>Subtotal</dt>
          <dd>{total}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
          <dt className="text-xs font-medium uppercase tracking-[0.18em] text-silver">Total de demostración</dt>
          <dd className="text-2xl font-medium text-ivory">{total}</dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-silver">No se tramita ninguna compraventa real.</p>
    </div>
  );
}
