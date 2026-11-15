"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal, .reveal-fade, .light-sig, .diro-panel, .diro-row";
const OUT = "rv-out";

// Bidireccional: entra al acercarse al viewport (arriba o abajo) y se atenúa solo cuando está del todo
// fuera de él. Las dos zonas son distintas (histéresis): entra al asomar por el borde (margen inferior del 8 %) y sale a >15 % de pantalla
// de distancia, así que nada se atenúa mientras se ve ni oscila en el borde. Sin JS, o con movimiento
// reducido, nada se oculta.
export function RevealOnView() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const enter = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.remove(OUT);
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const exit = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (!e.isIntersecting) e.target.classList.add(OUT);
      },
      { rootMargin: "15% 0px 15% 0px" },
    );

    for (const el of document.querySelectorAll(SELECTOR)) {
      if (el.getBoundingClientRect().top >= innerHeight) el.classList.add(OUT); // bajo el pliegue; lo ya visible no se toca
      enter.observe(el);
      exit.observe(el);
    }

    return () => {
      enter.disconnect();
      exit.disconnect();
      for (const el of document.querySelectorAll(`.${OUT}`)) el.classList.remove(OUT);
    };
  }, []);

  return null;
}
