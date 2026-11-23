import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CART_KEY } from "@/lib/cart";

// Entorno node: se simula window/localStorage. Cada test importa un módulo nuevo (estado de módulo limpio).
type Handler = (e: { key: string | null; newValue: string | null }) => void;

function setup(initial: string | null, opts: { broken?: boolean } = {}) {
  const data = new Map<string, string>(initial === null ? [] : [[CART_KEY, initial]]);
  const handlers = new Set<Handler>();
  const writes: string[] = [];
  const localStorage = {
    getItem: (k: string) => {
      if (opts.broken) throw new Error("denegado");
      return data.get(k) ?? null;
    },
    setItem: (k: string, v: string) => {
      if (opts.broken) throw new Error("denegado");
      writes.push(v);
      data.set(k, v);
    },
    removeItem: (k: string) => {
      if (opts.broken) throw new Error("denegado");
      data.delete(k);
    },
  };
  vi.stubGlobal("window", {
    localStorage,
    addEventListener: (_: string, h: Handler) => handlers.add(h),
    removeEventListener: (_: string, h: Handler) => handlers.delete(h),
  });
  return { data, handlers, writes };
}

const load = async () => {
  vi.resetModules();
  return import("@/lib/cartStore");
};
const { addItem } = await import("@/lib/cart");

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => vi.unstubAllGlobals());

describe("cartStore", () => {
  it("el snapshot de servidor es siempre vacío y restaurar no escribe", async () => {
    const env = setup(JSON.stringify({ v: 1, items: [{ id: "ion", qty: 2 }, { id: "zzz", qty: 1 }] }));
    const s = await load();
    expect(s.getServerSnapshot()).toEqual([]);
    expect(s.getSnapshot()).toEqual([{ id: "ion", qty: 2 }]);
    expect(env.writes).toEqual([]);
  });

  it("persiste solo ids y cantidades y quita la clave al vaciar", async () => {
    const env = setup(null);
    const s = await load();
    expect(s.updateCart((c) => addItem(c, "aurelis"))).toBe(true);
    expect(JSON.parse(env.data.get(CART_KEY)!)).toEqual({ v: 1, items: [{ id: "aurelis", qty: 1 }] });
    s.updateCart(() => []);
    expect(env.data.has(CART_KEY)).toBe(false);
  });

  it("almacenamiento corrupto: arranca vacío y se recupera al mutar", async () => {
    setup("{roto");
    const s = await load();
    expect(s.getSnapshot()).toEqual([]);
    expect(s.updateCart((c) => addItem(c, "ion"))).toBe(true);
  });

  it("sin localStorage funciona en memoria", async () => {
    setup(null, { broken: true });
    const s = await load();
    expect(s.getSnapshot()).toEqual([]);
    s.updateCart((c) => addItem(c, "ion"));
    expect(s.getSnapshot()).toEqual([{ id: "ion", qty: 1 }]);
  });

  it("un evento storage actualiza el estado, avisa y no reescribe (sin bucle)", async () => {
    const env = setup(null);
    const s = await load();
    const listener = vi.fn();
    const off = s.subscribe(listener);
    expect(env.handlers.size).toBe(1);
    const [h] = [...env.handlers];
    h!({ key: CART_KEY, newValue: JSON.stringify({ v: 1, items: [{ id: "blush", qty: 4 }] }) });
    expect(s.getSnapshot()).toEqual([{ id: "blush", qty: 4 }]);
    expect(listener).toHaveBeenCalledTimes(1);
    h!({ key: CART_KEY, newValue: JSON.stringify({ v: 1, items: [{ id: "blush", qty: 4 }] }) }); // mismo valor
    h!({ key: "otra", newValue: "x" });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(env.writes).toEqual([]);
    h!({ key: null, newValue: null }); // localStorage.clear() en otra pestaña
    expect(s.getSnapshot()).toEqual([]);
    off();
    expect(env.handlers.size).toBe(0);
  });
});
