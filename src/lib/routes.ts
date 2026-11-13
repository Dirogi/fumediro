export interface AppRoute {
  label: string;
  href: string;
  /** Pasa a true cuando la ruta está implementada. */
  ready: boolean;
  /** Destino alternativo ya funcional (p. ej. una ancla de la Home) mientras `ready` es false. */
  fallback?: string;
}

// Rutas de UX-SPEC §2. Activar una ruta = poner `ready: true` en su fase.
export const routes = {
  home: { label: "Inicio", href: "/", ready: true },
  collections: { label: "Colecciones", href: "/colecciones", ready: false, fallback: "/#colecciones" },
  perfumes: { label: "Perfumes", href: "/perfumes", ready: false },
  quiz: { label: "Descubre tu aroma", href: "/descubre-tu-aroma", ready: false },
  story: { label: "Nuestra historia", href: "/historia", ready: false },
  contact: { label: "Contacto", href: "/contacto", ready: false },
} satisfies Record<string, AppRoute>;

export const primaryNav: AppRoute[] = [routes.collections, routes.perfumes, routes.quiz, routes.story];
export const footerNav: AppRoute[] = [...primaryNav, routes.contact];

/** Destino real de la ruta, o null si todavía no existe (el elemento debe quedar inactivo). */
export const resolveHref = (route: AppRoute): string | null =>
  route.ready ? route.href : (route.fallback ?? null);
