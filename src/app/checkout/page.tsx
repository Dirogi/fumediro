import type { Metadata } from "next";
import { CheckoutView } from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout de demostración · Fumediro",
  description: "Checkout simulado de Fumediro. Proyecto conceptual de portfolio: no se realiza ningún cobro ni pedido.",
  robots: { index: false, follow: false }, // ruta de proceso, no editorial
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
