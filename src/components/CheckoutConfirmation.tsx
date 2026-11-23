"use client";

import { useEffect, useRef } from "react";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { GlassButton } from "@/components/GlassButton";
import type { Cart } from "@/lib/cart";

/** Confirmación ficticia. Recibe una copia en memoria de la selección: no se persiste como pedido. */
export function CheckoutConfirmation({ cart, demoId }: { cart: Cart; demoId: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <div className="mx-auto mt-10 max-w-3xl md:mt-14">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-silver">Demostración completada</p>
      <h1 ref={heading} tabIndex={-1} className="mt-2 font-display text-[clamp(2.75rem,7vw,5rem)] font-light leading-[0.95] tracking-[0.04em] text-ivory">
        Una selección imaginada.
      </h1>
      <p className="mt-6 max-w-[38rem] text-lg text-silver">
        Has completado la experiencia de compra de FUMEDIRO. Esta demostración no ha generado ningún pedido ni realizado ningún cobro.
      </p>
      <p className="mt-6 text-sm text-silver">
        Identificador de demostración (no es una referencia de pedido real):{" "}
        <span className="font-medium tracking-[0.08em] text-ivory">{demoId}</span>
      </p>

      <section aria-labelledby="confirmacion-seleccion" className="mt-12">
        <h2 id="confirmacion-seleccion" className="mb-6 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-light text-ivory">
          Tu selección
        </h2>
        <CheckoutSummary cart={cart} />
      </section>

      <div className="mt-12">
        <GlassButton href="/">Seguir explorando FUMEDIRO</GlassButton>
      </div>
    </div>
  );
}
