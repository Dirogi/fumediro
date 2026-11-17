import { describe, expect, it } from "vitest";
import { collectionPage, collectionRoute, perfumePage, perfumeRoute, resolveHref, routes, type AppRoute } from "@/lib/routes";

describe("perfumeRoute", () => {
  it("compone el href y hoy es inactiva: no enlaza a fichas inexistentes", () => {
    const r = perfumeRoute("ion", "ION");
    expect(r.href).toBe("/perfumes/ion");
    expect(r.ready).toBe(perfumePage.ready);
    expect(resolveHref(r)).toBeNull();
  });
});

describe("resolveHref", () => {
  it("devuelve href si la ruta está lista", () => {
    expect(resolveHref({ label: "x", href: "/x", ready: true })).toBe("/x");
  });

  it("devuelve el fallback si no está lista", () => {
    expect(resolveHref({ label: "x", href: "/x", ready: false, fallback: "/#x" })).toBe("/#x");
  });

  it("devuelve null (inactivo) si no está lista y no hay fallback", () => {
    expect(resolveHref({ label: "x", href: "/x", ready: false })).toBeNull();
  });

  it("ready tiene prioridad sobre el fallback", () => {
    expect(resolveHref({ label: "x", href: "/x", ready: true, fallback: "/#x" })).toBe("/x");
  });
});

describe("collectionRoute", () => {
  it("compone el href con el slug y hereda el estado de la página de colección", () => {
    const r = collectionRoute("voltara", "VOLTARA");
    expect(r.href).toBe("/colecciones/voltara");
    expect(r.ready).toBe(collectionPage.ready);
  });

  it("hoy es inactiva: no genera enlaces a rutas inexistentes", () => {
    expect(resolveHref(collectionRoute("cosmora", "COSMORA"))).toBeNull();
  });
});

describe("registro de rutas", () => {
  const all = Object.values(routes) as AppRoute[];

  it("nunca produce href vacío ni '#' suelto", () => {
    for (const r of all) {
      const href = resolveHref(r);
      expect(href === null || (href.length > 0 && href !== "#")).toBe(true);
    }
  });

  it("hoy solo Inicio y Colecciones (ancla) son enlaces; el resto está inactivo", () => {
    const active = Object.entries(routes)
      .filter(([, r]) => resolveHref(r) !== null)
      .map(([key]) => key);
    expect(active).toEqual(["home", "collections"]);
    expect(resolveHref(routes.collections)).toBe("/#colecciones");
  });
});
