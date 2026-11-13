"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Menú móvil sobre <dialog> modal nativo: foco atrapado, Escape y restitución
 * del foco los gestiona el navegador. `children` llega ya renderizado (servidor).
 */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // Ancla de la Home elegida en el menú: al cerrar, el foco va allí y no al botón «Menú».
  const pendingFocus = useRef<string | null>(null);

  // Si se ensancha la ventana con el menú abierto, el botón desaparece: cerrarlo.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && ref.current?.close();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => {
          ref.current?.showModal();
          setOpen(true);
        }}
        className="glass-panel min-h-11 min-w-11 rounded-full px-5 text-sm font-medium text-ivory transition-transform duration-150 ease-out active:scale-[0.97] md:hidden"
      >
        Menú
      </button>

      <dialog
        ref={ref}
        id="menu-movil"
        aria-label="Menú principal"
        className="menu-dialog"
        onClose={() => {
          setOpen(false);
          const id = pendingFocus.current;
          pendingFocus.current = null;
          const target = id ? document.getElementById(id) : null;
          if (target) {
            // preventScroll: el desplazamiento al ancla lo hace la navegación, sin saltos extra.
            if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
            target.focus({ preventScroll: true });
          }
        }}
        onClick={(e) => {
          const t = e.target as HTMLElement;
          const link = t.closest("a");
          if (link) pendingFocus.current = new URL(link.href).hash.slice(1) || null;
          // Clic en un enlace o en el fondo (el propio dialog): cerrar.
          if (link || t === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className="menu-panel">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="min-h-11 min-w-11 rounded-full px-4 text-sm font-medium text-ivory transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              Cerrar
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
