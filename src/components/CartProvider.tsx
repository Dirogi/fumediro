"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { addItem, clearCart, decrementItem, getQty, MAX_QTY, removeItem, totalUnits, type Cart } from "@/lib/cart";
import { getServerSnapshot, getSnapshot, subscribe, updateCart } from "@/lib/cartStore";
import { getPerfumes } from "@/lib/catalog";

interface CartApi {
  items: Cart;
  units: number;
  /** false hasta hidratar: evita mostrar «vacío» antes de leer el almacenamiento. */
  ready: boolean;
  open: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
  message: string;
  openCart: () => void;
  add: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  /** Vacía el carrito sin aviso (lo usa el checkout simulado al confirmar). */
  clear: () => void;
}

const Ctx = createContext<CartApi | null>(null);

export function useCart(): CartApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return c;
}

const noSubscribe = () => () => {};
const nameOf = (id: string) => getPerfumes().find((p) => p.id === id)?.name ?? id;
const units = (n: number) => `${n} ${n === 1 ? "unidad" : "unidades"}`;
const LIMIT_MESSAGE = `Máximo de ${MAX_QTY} unidades por perfume en esta demostración.`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noSubscribe, () => true, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  // Una navegación del cliente con el panel abierto lo cierra (el layout persiste entre rutas).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const announce = useCallback((m: string) => {
    setMessage(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 4000);
  }, []);

  const api = useMemo<CartApi>(() => {
    const change = (id: string, op: (c: Cart) => Cart, text: (qty: number) => string) => {
      if (updateCart(op)) announce(text(getQty(getSnapshot(), id)));
    };
    return {
      items,
      units: totalUnits(items),
      ready,
      open,
      dialogRef,
      message,
      openCart: () => {
        if (dialogRef.current && !dialogRef.current.open) {
          dialogRef.current.showModal();
          setOpen(true);
        }
      },
      add: (id) => {
        if (getQty(getSnapshot(), id) >= MAX_QTY) announce(LIMIT_MESSAGE);
        else change(id, (c) => addItem(c, id), (q) => `${nameOf(id)} añadido a tu selección (${units(q)}).`);
      },
      increment: (id) => change(id, (c) => addItem(c, id), (q) => `${nameOf(id)}: ${units(q)}.`),
      decrement: (id) =>
        change(id, (c) => decrementItem(c, id), (q) => (q === 0 ? `${nameOf(id)} eliminado de tu selección.` : `${nameOf(id)}: ${units(q)}.`)),
      remove: (id) => change(id, (c) => removeItem(c, id), () => `${nameOf(id)} eliminado de tu selección.`),
      clear: () => void updateCart(clearCart),
    };
  }, [items, ready, open, message, announce]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <CartDrawer onClosed={() => setOpen(false)} />
      {/* Confirmación discreta; con el panel abierto se oculta y el aviso va en su propia región. */}
      <div role="status" className="cart-toast-region">
        {message && <p className="cart-toast glass-panel">{message}</p>}
      </div>
    </Ctx.Provider>
  );
}
