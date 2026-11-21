import { demoPricing } from "@/data/demoPricing";

const whole = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
const exact = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/** Céntimos → «145 €» (o «145,50 €» si hay céntimos). */
export const formatEUR = (cents: number): string => (cents % 100 === 0 ? whole : exact).format(cents / 100);

/** Precio de demostración en céntimos; undefined si el perfume no tiene precio. */
export const getDemoPrice = (perfumeId: string): number | undefined => demoPricing[perfumeId];
