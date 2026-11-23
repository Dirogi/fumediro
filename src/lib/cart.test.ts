import { describe, expect, it } from "vitest";
import { addItem, CART_KEY, clearCart, decrementItem, getQty, MAX_QTY, parseCart, removeItem, serializeCart, setQty, subtotal, totalUnits, type Cart } from "@/lib/cart";

const known = (id: string) => ["aurelis", "ion", "blush"].includes(id);
const price = (id: string) => ({ aurelis: 13500, ion: 14500, blush: 12500 })[id];

describe("operaciones del carrito", () => {
  it("añade, incrementa y no muta el original", () => {
    const empty: Cart = [];
    const a = addItem(empty, "aurelis");
    expect(empty).toEqual([]);
    expect(addItem(a, "aurelis")).toEqual([{ id: "aurelis", qty: 2 }]);
    expect(addItem(a, "ion")).toEqual([{ id: "aurelis", qty: 1 }, { id: "ion", qty: 1 }]);
  });

  it("limita a 9 y devuelve el mismo carrito si no cambia nada", () => {
    const full = setQty([], "ion", MAX_QTY);
    expect(addItem(full, "ion")).toBe(full);
    expect(setQty(full, "ion", 50)).toBe(full);
    expect(setQty([], "ion", 50)).toEqual([{ id: "ion", qty: 9 }]);
  });

  it("reducir de 1 a 0 elimina la referencia", () => {
    const c = setQty([], "ion", 2);
    const c1 = decrementItem(c, "ion");
    expect(getQty(c1, "ion")).toBe(1);
    expect(decrementItem(c1, "ion")).toEqual([]);
  });

  it("setQty ignora decimales y NaN; ≤0 elimina; ausente con 0 no cambia", () => {
    const c = setQty([], "ion", 3);
    expect(setQty(c, "ion", 2.5)).toBe(c);
    expect(setQty(c, "ion", NaN)).toBe(c);
    expect(setQty(c, "ion", 0)).toEqual([]);
    expect(setQty(c, "ion", -4)).toEqual([]);
    expect(setQty([], "ion", 0)).toEqual([]);
  });

  it("elimina y vacía", () => {
    const c: Cart = [{ id: "ion", qty: 2 }, { id: "blush", qty: 1 }];
    expect(removeItem(c, "ion")).toEqual([{ id: "blush", qty: 1 }]);
    expect(removeItem(c, "zzz")).toBe(c);
    expect(clearCart()).toEqual([]);
  });

  it("calcula unidades y subtotal en céntimos enteros (recorrido de demostración)", () => {
    let c: Cart = addItem([], "aurelis");
    c = addItem(c, "ion");
    expect(subtotal(c, price)).toBe(28000);
    c = addItem(c, "aurelis");
    expect(subtotal(c, price)).toBe(41500);
    expect(totalUnits(c)).toBe(3);
    c = removeItem(c, "ion");
    expect(subtotal(c, price)).toBe(27000);
    expect(subtotal([{ id: "ion", qty: 9 }], () => 14999)).toBe(134991);
  });
});

describe("parseCart (almacenamiento no confiable)", () => {
  const raw = (o: unknown) => JSON.stringify(o);

  it("restaura un carrito válido y la clave está versionada", () => {
    const c = addItem(addItem([], "aurelis"), "ion");
    expect(parseCart(serializeCart(c), known)).toEqual(c);
    expect(CART_KEY).toBe("fumediro:cart:v1");
  });

  it("devuelve vacío ante null, JSON roto, estructura o versión desconocidas", () => {
    for (const r of [null, "", "{no", "[]", "null", "42", raw({ v: 2, items: [] }), raw({ items: [] }), raw({ v: 1 }), raw({ v: 1, items: "x" })])
      expect(parseCart(r, known)).toEqual([]);
  });

  it("descarta ids desconocidos y cantidades inválidas, conservando lo válido", () => {
    const items = [
      { id: "zzz", qty: 1 },
      { id: "ion", qty: -1 },
      { id: "ion", qty: 0 },
      { id: "ion", qty: 1.5 },
      { id: "ion", qty: 10 },
      { id: "ion", qty: "2" },
      { id: 7, qty: 1 },
      null,
      "ion",
      { id: "blush", qty: 9 },
    ];
    expect(parseCart(raw({ v: 1, items }), known)).toEqual([{ id: "blush", qty: 9 }]);
  });

  it("con ids duplicados manda la primera entrada válida y no se confía en precios ajenos", () => {
    const items = [{ id: "ion", qty: 2, price: 1 }, { id: "ion", qty: 5 }];
    const c = parseCart(raw({ v: 1, items }), known);
    expect(c).toEqual([{ id: "ion", qty: 2 }]);
    expect(Object.keys(c[0]!)).toEqual(["id", "qty"]);
  });
});
