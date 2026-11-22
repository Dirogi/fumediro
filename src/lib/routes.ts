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
  collections: { label: "Colecciones", href: "/colecciones", ready: true, fallback: "/#colecciones" },
  perfumes: { label: "Perfumes", href: "/perfumes", ready: true },
  quiz: { label: "Descubre tu aroma", href: "/descubre-tu-aroma", ready: true },
  story: { label: "Nuestra historia", href: "/historia", ready: false },
  contact: { label: "Contacto", href: "/contacto", ready: false },
  // Checkout simulado (D5): no figura en la navegación; se llega desde el carrito.
  checkout: { label: "Finalizar selección", href: "/checkout", ready: true },
} satisfies Record<string, AppRoute>;

// Páginas /colecciones/[slug]: activas desde D4-D.
export const collectionPage = { href: "/colecciones", ready: true };

// Fichas /perfumes/[slug]: activas desde D5 (las 15 rutas salen de generateStaticParams).
export const perfumePage = { href: "/perfumes", ready: true };

export const perfumeRoute = (slug: string, label: string): AppRoute => ({
  label,
  href: `${perfumePage.href}/${slug}`,
  ready: perfumePage.ready,
});

export const collectionRoute = (slug: string, label: string): AppRoute => ({
  label,
  href: `${collectionPage.href}/${slug}`,
  ready: collectionPage.ready,
});

export const primaryNav: AppRoute[] = [routes.collections, routes.perfumes, routes.quiz, routes.story];
export const footerNav: AppRoute[] = [...primaryNav, routes.contact];

/** Destino real de la ruta, o null si todavía no existe (el elemento debe quedar inactivo). */
export const resolveHref = (route: AppRoute): string | null =>
  route.ready ? route.href : (route.fallback ?? null);
