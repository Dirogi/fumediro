"use client";

import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckoutConfirmation } from "@/components/CheckoutConfirmation";
import { CheckoutForm } from "@/components/CheckoutForm";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { useCart } from "@/components/CartProvider";
import { GlassButton } from "@/components/GlassButton";
import { totalUnits, subtotal, type Cart } from "@/lib/cart";
import { checkoutPhase, makeDemoId } from "@/lib/checkout";
import { formatEUR, getDemoPrice } from "@/lib/money";

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";
const h1 = "mt-2 font-display text-[clamp(2.75rem,7vw,5rem)] font-light leading-[0.95] tracking-[0.04em] text-ivory";

/** Copia en memoria de la selección confirmada; vive solo en este componente (se pierde al recargar o salir). */
interface Receipt {
  id: string;
  cart: Cart;
}

/** Estado vacío. Si llega por un vaciado con la página abierta, el foco pasa al título (anuncia el cambio). */
function EmptyState({ emptied }: { emptied: boolean }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!emptied) return;
    const focusHeading = () => heading.current?.focus();
    // Con el carrito abierto el fondo es inerte y el foco debe quedarse en el modal: se recoge al cerrarlo
    // (el botón que lo abrió, «Editar selección», ya no existe y el navegador no tendría dónde devolverlo).
    const dialog = document.getElementById("carrito") as HTMLDialogElement | null;
    if (!dialog?.open) return focusHeading();
    // Se observa el atributo `open`: el evento `close` no llega de forma fiable. El aplazamiento deja
    // que el navegador termine su propia restitución del foco antes de recogerlo.
    let timer: number | undefined;
    const observer = new MutationObserver(() => {
      if (dialog.open) return;
      observer.disconnect();
      timer = window.setTimeout(focusHeading, 0);
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [emptied]);

  return (
    <div className="mt-10 max-w-[38rem] md:mt-14">
      <p className={eyebrow}>Checkout de demostración</p>
      <h1 ref={heading} tabIndex={-1} className={h1}>
        {emptied ? "Tu selección se ha vaciado." : "Tu selección está vacía."}
      </h1>
      <p className="mt-6 text-lg text-silver">
        {emptied
          ? "Ya no hay artículos para continuar. Explora el catálogo y añade perfumes cuando quieras."
          : "Todavía no has elegido ningún perfume. Explora el catálogo y añade los que quieras para probar la experiencia de compra."}
      </p>
      <div className="mt-10">
        <GlassButton href="/perfumes">Explorar los perfumes</GlassButton>
      </div>
    </div>
  );
}

export function CheckoutView() {
  const { items, ready, clear, openCart } = useCart();
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  // ¿Hubo artículos con la página ya hidratada? Distingue «llegó vacío» de «se vació mientras estaba abierta».
  const [hadItems, setHadItems] = useState(false);
  if (ready && items.length > 0 && !hadItems) setHadItems(true);
  const phase = checkoutPhase({ ready, count: items.length, hadItems, confirmed: receipt !== null });

  let content: React.ReactNode;
  if (phase === "confirmed" && receipt) {
    content = <CheckoutConfirmation cart={receipt.cart} demoId={receipt.id} />;
  } else if (phase === "loading") {
    // Antes de hidratar no se sabe si hay carrito: no se muestra un «vacío» engañoso.
    // Misma cabecera (eyebrow + h1) y columna que el formulario, para que hidratar no desplace el título (CLS).
    content = (
      <div className="mt-10 grid items-start gap-10 md:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,6rem)]">
        <div>
          <p className={eyebrow}>Demostración · sin pagos</p>
          <h1 className={h1}>Finalizar selección</h1>
        </div>
      </div>
    );
  } else if (phase === "empty" || phase === "emptied") {
    content = <EmptyState emptied={phase === "emptied"} />;
  } else {
    const units = totalUnits(items);
    content = (
      <div className="mt-10 grid items-start gap-10 md:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,6rem)]">
        <div>
          <p className={eyebrow}>Demostración · sin pagos</p>
          <h1 className={h1}>Finalizar selección</h1>
          <p className="mt-6 max-w-[34rem] text-silver">
            Esto es una simulación de portfolio: no se realiza ningún cobro ni se crea ningún pedido. Los datos de ejemplo se pueden editar y no salen de esta página.
          </p>

          {/* Móvil y tablet: resumen plegable antes del formulario; en escritorio va en la columna lateral. */}
          <details className="group mt-8 rounded-2xl border border-border lg:hidden">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 [&::-webkit-details-marker]:hidden">
              <span className="text-sm font-medium text-ivory">
                Resumen de tu selección ({units} {units === 1 ? "unidad" : "unidades"})
              </span>
              <span className="text-base font-medium tabular-nums text-ivory">{formatEUR(subtotal(items, getDemoPrice))}</span>
            </summary>
            <div className="px-5 pb-5">
              <CheckoutSummary cart={items} />
            </div>
          </details>

          <CheckoutForm
            onConfirm={() => {
              // Primero la copia en memoria, después vaciar: nada de flashes de «vacío».
              setReceipt({ id: makeDemoId(), cart: items });
              clear();
            }}
          />
        </div>

        <aside aria-labelledby="checkout-resumen" className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="checkout-resumen" className="mb-6 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-light text-ivory">
              Tu selección
            </h2>
            <button type="button" onClick={openCart} className="min-h-11 text-sm text-silver underline decoration-border underline-offset-4 hover:text-ivory hover:decoration-current">
              Editar selección
            </button>
          </div>
          <CheckoutSummary cart={items} />
        </aside>
      </div>
    );
  }

  return (
    <main id="contenido" tabIndex={-1} className="mx-auto min-h-svh w-full max-w-[90rem] px-[max(1rem,5vw)] pb-[clamp(5rem,10vw,9rem)] pt-28">
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Checkout de demostración" }]} />
      {content}
    </main>
  );
}
