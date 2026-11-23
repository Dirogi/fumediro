import { describe, expect, it } from "vitest";
import { checkoutPhase, DEMO_VALUES, FIELDS, makeDemoId, validateCheckout, type CheckoutValues } from "@/lib/checkout";

const with_ = (o: Partial<CheckoutValues>): CheckoutValues => ({ ...DEMO_VALUES, ...o });

describe("validateCheckout", () => {
  it("los datos de ejemplo son válidos y editables", () => {
    expect(validateCheckout(DEMO_VALUES)).toEqual({});
    expect(FIELDS).toEqual(["name", "email", "address", "city", "postal"]);
  });

  it("campos vacíos o solo espacios son obligatorios", () => {
    const e = validateCheckout({ name: "", email: "   ", address: " ", city: "\t", postal: "" });
    expect(Object.keys(e).sort()).toEqual([...FIELDS].sort());
    expect(e.name).toContain("obligatorio");
  });

  it("recorta espacios laterales antes de validar", () => {
    expect(validateCheckout(with_({ name: "  Ana  ", postal: " 28001 " }))).toEqual({});
  });

  it("correo: formatos válidos e inválidos", () => {
    for (const ok of ["a@b.co", "demo@example.com", "  x.y+z@mail.example.org "]) expect(validateCheckout(with_({ email: ok })).email).toBeUndefined();
    for (const bad of ["demo", "demo@", "@example.com", "a b@c.de", "a@b", "a@@b.co"]) expect(validateCheckout(with_({ email: bad })).email).toBeDefined();
    expect(validateCheckout(with_({ email: `${"a".repeat(250)}@b.co` })).email).toBeDefined();
  });

  it("código postal: 3–10 caracteres alfanuméricos, espacios o guiones", () => {
    for (const ok of ["00000", "28001", "SW1A 1AA", "12-345", "AB1"]) expect(validateCheckout(with_({ postal: ok })).postal).toBeUndefined();
    for (const bad of ["12", "-1234", "1234-", "12345678901", "12#45", "12.345"]) expect(validateCheckout(with_({ postal: bad })).postal).toBeDefined();
  });

  it("longitudes máximas razonables", () => {
    expect(validateCheckout(with_({ name: "a".repeat(81) })).name).toBeDefined();
    expect(validateCheckout(with_({ address: "a".repeat(121) })).address).toBeDefined();
    expect(validateCheckout(with_({ city: "a".repeat(61) })).city).toBeDefined();
    expect(validateCheckout(with_({ name: "a" })).name).toBeDefined();
  });
});

describe("makeDemoId", () => {
  it("formato DEMO-XXXXXX sin caracteres ambiguos y determinista con un generador dado", () => {
    expect(makeDemoId(() => 0)).toBe("DEMO-AAAAAA");
    expect(makeDemoId(() => 0.999999)).toBe("DEMO-999999");
    for (let i = 0; i < 50; i++) expect(makeDemoId()).toMatch(/^DEMO-[A-HJ-NP-Z2-9]{6}$/);
  });
});

describe("checkoutPhase", () => {
  const base = { ready: true, count: 0, hadItems: false, confirmed: false };
  it("no decide nada antes de hidratar", () => {
    expect(checkoutPhase({ ...base, ready: false })).toBe("loading");
    expect(checkoutPhase({ ...base, ready: false, count: 2 })).toBe("loading");
  });
  it("con artículos muestra el formulario", () => {
    expect(checkoutPhase({ ...base, count: 2, hadItems: true })).toBe("form");
  });
  it("llegar vacío no es lo mismo que vaciarse con la página abierta", () => {
    expect(checkoutPhase(base)).toBe("empty");
    expect(checkoutPhase({ ...base, hadItems: true })).toBe("emptied");
  });
  it("la confirmación voluntaria manda aunque el carrito esté vacío", () => {
    expect(checkoutPhase({ ...base, hadItems: true, confirmed: true })).toBe("confirmed");
  });
});
