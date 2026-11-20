import { describe, expect, it } from "vitest";
import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
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

  it("D4-D: las cinco colecciones están activas y enlazan a su página", () => {
    expect(collectionPage.ready).toBe(true);
    expect(collections).toHaveLength(5);
    for (const c of collections) expect(resolveHref(collectionRoute(c.slug, c.name))).toBe(`/colecciones/${c.slug}`);
  });

  it("las fichas de perfume siguen inactivas hasta D5: ningún perfume enlaza a una ruta que da 404", () => {
    expect(perfumePage.ready).toBe(false);
    for (const p of perfumes) expect(resolveHref(perfumeRoute(p.slug, p.name))).toBeNull();
    // Ids y slugs de CORALLIS coinciden y la grafía antigua no genera ruta.
    expect(perfumeRoute("corallis", "CORALLIS").href).toBe("/perfumes/corallis");
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

  it("hoy solo Inicio, Colecciones y Perfumes son enlaces; el resto está inactivo", () => {
    const active = Object.entries(routes)
      .filter(([, r]) => resolveHref(r) !== null)
      .map(([key]) => key);
    expect(active).toEqual(["home", "collections", "perfumes"]);
    expect(resolveHref(routes.collections)).toBe("/colecciones");
  });
});
