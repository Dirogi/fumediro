import { describe, expect, it } from "vitest";
import { demoPricing } from "@/data/demoPricing";
import { perfumes } from "@/data/perfumes";
import { subtotal } from "@/lib/cart";
import { getCartLines, isCartableId } from "@/lib/cartView";
import { getDemoPrice } from "@/lib/money";

describe("cartView", () => {
  it("los 15 perfumes son añadibles y resuelven línea, colección y precio desde el catálogo", () => {
    for (const p of perfumes) {
      expect(isCartableId(p.id)).toBe(true);
      const [l] = getCartLines([{ id: p.id, qty: 3 }]);
      expect(l?.perfume.name).toBe(p.name);
      expect(l?.collection?.id).toBe(p.collectionId);
      expect(l?.unitCents).toBe(demoPricing[p.id]);
      expect(l?.lineCents).toBe(3 * demoPricing[p.id]!);
    }
  });

  it("rechaza ids desconocidos (incluida la grafía antigua) y omite sus líneas", () => {
    expect(isCartableId("coralis")).toBe(false);
    expect(getCartLines([{ id: "coralis", qty: 1 }])).toEqual([]);
  });

  it("la suma de líneas coincide con el subtotal", () => {
    const cart = [{ id: "aurelis", qty: 2 }, { id: "ion", qty: 1 }];
    expect(getCartLines(cart).reduce((s, l) => s + l.lineCents, 0)).toBe(subtotal(cart, getDemoPrice));
    expect(subtotal(cart, getDemoPrice)).toBe(41500);
  });
});
