import { describe, expect, it } from "vitest";
import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import { collectionPage, collectionRoute, perfumePage, footerNav, perfumeRoute, primaryNav, resolveHref, routes, type AppRoute } from "@/lib/routes";

describe("perfumeRoute", () => {
  it("compone el href y enlaza a la ficha activa", () => {
    const r = perfumeRoute("ion", "ION");
    expect(r.href).toBe("/perfumes/ion");
    expect(r.ready).toBe(perfumePage.ready);
    expect(resolveHref(r)).toBe("/perfumes/ion");
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

  it("D5-E: las 15 fichas están activas con href único; CORALLIS usa su slug y «coralis» no existe", () => {
    expect(perfumePage.ready).toBe(true);
    expect(perfumes).toHaveLength(15);
    const hrefs = perfumes.map((p) => resolveHref(perfumeRoute(p.slug, p.name)));
    expect(hrefs).toEqual(perfumes.map((p) => `/perfumes/${p.slug}`));
    expect(new Set(hrefs).size).toBe(15);
    expect(hrefs).toContain("/perfumes/corallis");
    expect(hrefs).not.toContain("/perfumes/coralis");
  });
});

describe("checkout (D5-E)", () => {
  it("está activo y se alcanza desde el carrito, no desde la navegación", () => {
    expect(resolveHref(routes.checkout)).toBe("/checkout");
    expect(primaryNav).not.toContain(routes.checkout);
    expect(footerNav).not.toContain(routes.checkout);
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

  it("todas las rutas del sitio están activas", () => {
    const active = Object.entries(routes)
      .filter(([, r]) => resolveHref(r) !== null)
      .map(([key]) => key);
    expect(active).toEqual(["home", "collections", "perfumes", "quiz", "story", "contact", "checkout"]);
    expect(resolveHref(routes.story)).toBe("/historia");
    expect(resolveHref(routes.collections)).toBe("/colecciones");
  });
});
