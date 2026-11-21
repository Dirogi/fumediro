"use client";

import { useCart } from "@/components/CartProvider";

export function CartButton() {
  const { units, ready, open, openCart } = useCart();
  const label = !ready
    ? "Abrir tu selección"
    : units > 0
      ? `Abrir tu selección, ${units} ${units === 1 ? "unidad" : "unidades"}`
      : "Abrir tu selección, vacía";

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="carrito"
      aria-label={label}
      onClick={openCart}
      className="glass-panel relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ivory transition-transform duration-150 ease-out active:scale-[0.97]"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
      {ready && units > 0 && (
        <span aria-hidden="true" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-champagne px-1 text-[0.6875rem] font-semibold leading-none tabular-nums text-charcoal">
          {units}
        </span>
      )}
    </button>
  );
}
