import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SkipLink } from "@/components/SkipLink";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fumediro",
  description: "Fumediro, marca ficticia de perfumería experimental. Proyecto conceptual de portfolio.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#14171B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-dvh antialiased">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
