// Lógica pura del carrito de demostración. Solo se guardan ids y cantidades; precios y datos se
// resuelven siempre desde el catálogo. El máximo es un límite de interfaz, no stock.
export const MAX_QTY = 9;
export const CART_KEY = "fumediro:cart:v1";
const VERSION = 1;

export interface CartItem {
  id: string;
  qty: number;
}
export type Cart = readonly CartItem[];

const isQty = (n: unknown): n is number => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= MAX_QTY;

/**
 * Restaura el carrito desde texto no confiable. JSON roto, estructura o versión desconocidas → vacío.
 * Entradas con id desconocido, cantidad no entera o fuera de 1–9 se descartan; con ids repetidos manda la primera.
 */
export function parseCart(raw: string | null, isKnownId: (id: string) => boolean): Cart {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  const d = data as { v?: unknown; items?: unknown } | null;
  if (typeof d !== "object" || d === null || d.v !== VERSION || !Array.isArray(d.items)) return [];
  const seen = new Set<string>();
  const out: CartItem[] = [];
  for (const e of d.items as unknown[]) {
    const it = e as { id?: unknown; qty?: unknown } | null;
    if (typeof it !== "object" || it === null) continue;
    const { id, qty } = it;
    if (typeof id !== "string" || seen.has(id) || !isKnownId(id) || !isQty(qty)) continue;
    seen.add(id);
    out.push({ id, qty });
  }
  return out;
}

export const serializeCart = (cart: Cart): string =>
  JSON.stringify({ v: VERSION, items: cart.map(({ id, qty }) => ({ id, qty })) });

export const getQty = (cart: Cart, id: string): number => cart.find((i) => i.id === id)?.qty ?? 0;

/** Fija la cantidad (entera; ≤0 elimina; se limita a MAX_QTY). Devuelve el mismo carrito si no cambia nada. */
export function setQty(cart: Cart, id: string, qty: number): Cart {
  if (!Number.isInteger(qty)) return cart;
  const next = Math.min(qty, MAX_QTY);
  const current = getQty(cart, id);
  if (next === current || (next <= 0 && current === 0)) return cart;
  if (next <= 0) return removeItem(cart, id);
  return current === 0 ? [...cart, { id, qty: next }] : cart.map((i) => (i.id === id ? { id, qty: next } : i));
}

export const addItem = (cart: Cart, id: string): Cart => setQty(cart, id, getQty(cart, id) + 1);
export const decrementItem = (cart: Cart, id: string): Cart => setQty(cart, id, getQty(cart, id) - 1);
export const removeItem = (cart: Cart, id: string): Cart => (getQty(cart, id) ? cart.filter((i) => i.id !== id) : cart);
export const clearCart = (): Cart => [];

export const totalUnits = (cart: Cart): number => cart.reduce((n, i) => n + i.qty, 0);

/** Subtotal en céntimos enteros (sin coma flotante). */
export const subtotal = (cart: Cart, priceOf: (id: string) => number | undefined): number =>
  cart.reduce((sum, i) => sum + i.qty * (priceOf(i.id) ?? 0), 0);
