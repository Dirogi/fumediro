// Checkout SIMULADO (D5-D): validación y datos de ejemplo. Nada de esto se envía ni se guarda.
export const FIELDS = ["name", "email", "address", "city", "postal"] as const;
export type Field = (typeof FIELDS)[number];
export type CheckoutValues = Record<Field, string>;
export type CheckoutErrors = Partial<Record<Field, string>>;

export const FIELD_LABELS: Record<Field, string> = {
  name: "Nombre",
  email: "Correo electrónico",
  address: "Dirección",
  city: "Ciudad",
  postal: "Código postal",
};

/** Valores de ejemplo, evidentemente ficticios y editables. */
export const DEMO_VALUES: CheckoutValues = {
  name: "Cliente de demostración",
  email: "demo@example.com",
  address: "Calle Ficticia 1",
  city: "Ciudad Ejemplo",
  postal: "00000",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL = /^[A-Za-z0-9][A-Za-z0-9 -]{1,8}[A-Za-z0-9]$/; // 3–10 caracteres, sin exigir un país concreto

const text = (value: string, label: string, min: number, max: number): string | undefined => {
  const v = value.trim();
  if (!v) return `${label}: este campo es obligatorio.`;
  if (v.length < min) return `${label}: escribe al menos ${min} caracteres.`;
  if (v.length > max) return `${label}: no puede superar los ${max} caracteres.`;
};

/** Valida con los espacios laterales recortados; devuelve solo los campos con error. */
export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const set = (f: Field, msg: string | undefined) => msg && (errors[f] = msg);
  set("name", text(values.name, "Nombre", 2, 80));
  const email = values.email.trim();
  set("email", !email ? "Correo electrónico: este campo es obligatorio." : email.length > 254 || !EMAIL.test(email) ? "Correo electrónico: introduce una dirección válida, por ejemplo nombre@example.com." : undefined);
  set("address", text(values.address, "Dirección", 5, 120));
  set("city", text(values.city, "Ciudad", 2, 60));
  const postal = values.postal.trim();
  set("postal", !postal ? "Código postal: este campo es obligatorio." : POSTAL.test(postal) ? undefined : "Código postal: usa de 3 a 10 caracteres (letras, números, espacios o guiones).");
  return errors;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Identificador local de demostración; no deriva de ningún dato del formulario ni es un pedido real. */
export function makeDemoId(rand: () => number = Math.random): string {
  let id = "";
  for (let i = 0; i < 6; i++) id += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return `DEMO-${id}`;
}

export type CheckoutPhase = "loading" | "confirmed" | "empty" | "emptied" | "form";

/**
 * Fase de la página. «emptied» = el carrito se vació con el checkout abierto (otra pestaña o el panel);
 * se distingue de «empty» (llegó vacío) y de «confirmed» (finalización voluntaria, que vacía el carrito a propósito).
 */
export function checkoutPhase(s: { ready: boolean; count: number; hadItems: boolean; confirmed: boolean }): CheckoutPhase {
  if (s.confirmed) return "confirmed";
  if (!s.ready) return "loading";
  if (s.count > 0) return "form";
  return s.hadItems ? "emptied" : "empty";
}
