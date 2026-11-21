import type { Cart } from "@/lib/cart";
import { getCollectionOfPerfume, getPerfumes } from "@/lib/catalog";
import { getDemoPrice } from "@/lib/money";
import type { Collection, Perfume } from "@/lib/types";

export interface CartLineView {
  perfume: Perfume;
  collection?: Collection;
  qty: number;
  unitCents: number;
  lineCents: number;
}

/** Un id se acepta solo si existe en el catálogo y tiene precio de demostración. */
export const isCartableId = (id: string): boolean => getDemoPrice(id) !== undefined && getPerfumes().some((p) => p.id === id);

/** Líneas enriquecidas desde el catálogo y los precios de demostración (nada se lee del almacenamiento). */
export function getCartLines(cart: Cart): CartLineView[] {
  return cart.flatMap(({ id, qty }) => {
    const perfume = getPerfumes().find((p) => p.id === id);
    const unitCents = getDemoPrice(id);
    if (!perfume || unitCents === undefined) return [];
    return [{ perfume, collection: getCollectionOfPerfume(perfume), qty, unitCents, lineCents: qty * unitCents }];
  });
}
