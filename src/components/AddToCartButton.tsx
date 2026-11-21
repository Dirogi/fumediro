"use client";

import { useCart } from "@/components/CartProvider";
import { GlassButton } from "@/components/GlassButton";

/** Añade una unidad sin abrir el panel ni mover el foco; la confirmación llega por la región de estado. */
export function AddToCartButton({ perfumeId }: { perfumeId: string }) {
  const { add } = useCart();
  return (
    <GlassButton onClick={() => add(perfumeId)} className="w-full sm:w-auto sm:min-w-64">
      Añadir al carrito
    </GlassButton>
  );
}
