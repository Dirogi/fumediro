import { CART_KEY, parseCart, serializeCart, type Cart } from "@/lib/cart";
import { isCartableId } from "@/lib/cartView";

// Almacén externo para useSyncExternalStore. El servidor y la hidratación usan siempre EMPTY; el
// valor persistido se lee en cliente tras hidratar, y solo se escribe al mutar (nunca al restaurar).
const EMPTY: Cart = [];
let cart: Cart = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const read = (raw?: string | null): Cart => {
  try {
    return parseCart(raw !== undefined ? raw : window.localStorage.getItem(CART_KEY), isCartableId);
  } catch {
    return EMPTY; // almacenamiento no disponible: el carrito sigue funcionando en memoria
  }
};

const emit = () => listeners.forEach((l) => l());

// Otra pestaña cambió el carrito: se adopta su valor sin reescribirlo (evita bucles de escritura).
const onStorage = (e: StorageEvent) => {
  if (e.key !== null && e.key !== CART_KEY) return;
  const next = read(e.newValue);
  if (serializeCart(next) === serializeCart(cart)) return;
  cart = next;
  loaded = true; // el valor recibido manda: una lectura posterior no debe pisarlo
  emit();
};

export const subscribe = (listener: () => void) => {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
};

export const getSnapshot = (): Cart => {
  if (!loaded) {
    cart = read();
    loaded = true;
  }
  return cart;
};

export const getServerSnapshot = (): Cart => EMPTY;

/** Aplica una operación pura; persiste y notifica solo si cambió algo. Devuelve si hubo cambio. */
export function updateCart(op: (c: Cart) => Cart): boolean {
  const next = op(getSnapshot());
  if (next === cart) return false;
  cart = next;
  try {
    if (next.length) window.localStorage.setItem(CART_KEY, serializeCart(next));
    else window.localStorage.removeItem(CART_KEY);
  } catch {
    // sin almacenamiento o cuota agotada: queda solo en memoria
  }
  emit();
  return true;
}
