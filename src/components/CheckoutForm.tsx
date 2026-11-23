"use client";

import { useRef, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { DEMO_VALUES, FIELDS, FIELD_LABELS, validateCheckout, type CheckoutValues, type Field } from "@/lib/checkout";

const INPUT_TYPE: Record<Field, string> = { name: "text", email: "email", address: "text", city: "text", postal: "text" };
const fieldId = (f: Field) => `checkout-${f}`;

/**
 * Formulario de demostración. Los valores viven solo en este estado local: no hay `action`, fetch ni
 * almacenamiento, y `onSubmit` nunca navega. `onConfirm` solo avisa de que la simulación es válida.
 */
export function CheckoutForm({ onConfirm }: { onConfirm: () => void }) {
  const [values, setValues] = useState<CheckoutValues>(DEMO_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const wantFocus = useRef(false);
  // Errores derivados: tras el primer intento se actualizan al escribir, sin estado duplicado.
  const errors = submitted ? validateCheckout(values) : {};
  const failing = FIELDS.filter((f) => errors[f]);

  const summaryRef = (el: HTMLDivElement | null) => {
    if (el && wantFocus.current) {
      wantFocus.current = false;
      el.focus();
    }
  };

  return (
    <form
      noValidate
      autoComplete="off"
      aria-label="Datos de demostración"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.keys(validateCheckout(values)).length > 0) {
          wantFocus.current = true;
          return;
        }
        onConfirm();
      }}
      className="mt-10"
    >
      {failing.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="group" aria-labelledby="checkout-errores" className="mb-8 rounded-2xl border border-error/60 p-5">
          <h2 id="checkout-errores" className={`text-base font-medium text-error`}>
            {failing.length === 1 ? "Revisa 1 campo antes de continuar" : `Revisa ${failing.length} campos antes de continuar`}
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {failing.map((f) => (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => document.getElementById(fieldId(f))?.focus()}
                  className="min-h-11 text-left text-ivory underline decoration-border underline-offset-4 hover:decoration-current"
                >
                  {errors[f]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {FIELDS.map((f) => {
          const error = errors[f];
          return (
            <div key={f}>
              <label htmlFor={fieldId(f)} className="text-xs font-medium uppercase tracking-[0.18em] text-silver">
                {FIELD_LABELS[f]}
              </label>
              <input
                id={fieldId(f)}
                // Nombres propios: evitan que el navegador ofrezca datos personales reales.
                name={`demo-${f}`}
                type={INPUT_TYPE[f]}
                value={values[f]}
                onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                data-1p-ignore
                data-lpignore="true"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${fieldId(f)}-error` : undefined}
                className={`mt-2 block min-h-12 w-full rounded-xl border bg-transparent px-4 text-base text-ivory ${error ? "border-error" : "border-border"}`}
              />
              {error && (
                <p id={`${fieldId(f)}-error`} className={`mt-2 text-sm text-error`}>
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <GlassButton type="submit" className="w-full sm:w-auto sm:min-w-64">
          Confirmar demostración
        </GlassButton>
        <p className="mt-3 text-sm text-silver">Los datos son de ejemplo: no se envían ni se guardan en ningún sitio.</p>
      </div>
    </form>
  );
}
