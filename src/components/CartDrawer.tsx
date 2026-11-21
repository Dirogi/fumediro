"use client";

import { useRef } from "react";
import { CartLine } from "@/components/CartLine";
import { useCart } from "@/components/CartProvider";
import { GlassButton } from "@/components/GlassButton";
import { routes } from "@/lib/routes";
import { subtotal } from "@/lib/cart";
import { getCartLines } from "@/lib/cartView";
import { formatEUR, getDemoPrice } from "@/lib/money";

/**
 * Panel lateral sobre <dialog> modal nativo (foco atrapado, Escape y restitución del foco al botón
 * que lo abrió los gestiona el navegador). Al desaparecer una línea el foco pasa al título.
 */
export function CartDrawer({ onClosed }: { onClosed: () => void }) {
  const { items, ready, open, dialogRef, message } = useCart();
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Las líneas (y sus miniaturas) solo existen con el panel abierto: nada se descarga antes de pedirlo.
  const lines = open ? getCartLines(items) : [];
  const close = () => {
    dialogRef.current?.close();
    onClosed(); // no depender solo del evento `close`, que algunos navegadores emiten con retraso
  };

  return (
    <dialog
      ref={dialogRef}
      id="carrito"
      aria-labelledby="carrito-titulo"
      className="cart-dialog"
      onCancel={onClosed} // Escape
      onClose={onClosed}
      // Clic en el fondo (el propio dialog, no su contenido): cerrar.
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="cart-panel">
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <h2 id="carrito-titulo" ref={headingRef} tabIndex={-1} className="font-display text-3xl font-light text-ivory">
            Tu selección
          </h2>
          <button
            type="button"
            onClick={close}
            className="min-h-11 min-w-11 rounded-full px-4 text-sm font-medium text-ivory transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Cerrar
          </button>
        </div>

        <div className="cart-body px-6">
          {open && ready && lines.length === 0 ? (
            <p className="py-10 text-silver">Tu selección está vacía. Explora las colecciones y añade un perfume.</p>
          ) : (
            <ul>
              {lines.map((l) => (
                <CartLine key={l.perfume.id} line={l} onEmptied={() => headingRef.current?.focus()} />
              ))}
            </ul>
          )}
        </div>

        <div className="cart-footer space-y-4 border-t border-border px-6 pt-5">
          {lines.length > 0 && (
            <p className="flex items-baseline justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-silver">Subtotal</span>
              <span className="text-2xl font-medium tabular-nums text-ivory">{formatEUR(subtotal(items, getDemoPrice))}</span>
            </p>
          )}
          <p className="text-sm text-silver">Compra simulada: proyecto de portfolio. No se realiza ningún cobro ni pedido.</p>
          {lines.length > 0 && (
            // Cierra el panel al pulsar (la ruta puede tardar en cambiar) y conserva el carrito.
            <GlassButton href={routes.checkout.href} onClick={close} className="w-full">
              Finalizar selección
            </GlassButton>
          )}
          <GlassButton variant="secondary" onClick={close} className="w-full">
            Seguir explorando
          </GlassButton>
        </div>

        {/* Anuncios mientras el panel está abierto (la región de fuera queda inerte tras el modal). */}
        <p role="status" className="sr-only">
          {message}
        </p>
      </div>
    </dialog>
  );
}
