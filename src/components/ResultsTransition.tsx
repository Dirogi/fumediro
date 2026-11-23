"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Entrada discreta (opacidad + 8 px, 250 ms) cuando cambia `resultKey`. No anima el primer render ni con movimiento reducido. */
export function ResultsTransition({ resultKey, children }: { resultKey: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(resultKey);

  useEffect(() => {
    if (prev.current === resultKey) return;
    prev.current = resultKey;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Cancelar al cambiar de nuevo evita estados intermedios con cambios rápidos.
    const anim = ref.current?.animate(
      [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 250, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
    );
    return () => anim?.cancel();
  }, [resultKey]);

  return <div ref={ref}>{children}</div>;
}
