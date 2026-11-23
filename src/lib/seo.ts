import type { Metadata } from "next";

/** URL pública definitiva (único dominio canónico; nunca URLs de preview de Vercel). */
export const SITE_URL = "https://fumediro.vercel.app";
export const SITE_NAME = "FUMEDIRO";
export const SITE_TITLE = "Fumediro";
export const SITE_DESCRIPTION = "Fumediro, marca ficticia de perfumería experimental. Proyecto conceptual de portfolio.";

// Copia optimizada (JPEG 1200×630) del hero abstracto, sin texto ni producto. Original intacto en /images/hero.
export const OG_IMAGE = {
  url: "/images/og/fumediro-social.jpg",
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: "Cintas de vidrio y humo iluminadas sobre una roca oscura: imagen abstracta de FUMEDIRO",
};

// Valores por defecto del layout (también para rutas sin metadatos propios, p. ej. checkout, que además es noindex).
export const baseMetadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "es_ES", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [OG_IMAGE.url] },
};

interface PageSeo {
  title: string;
  description: string;
  /** Ruta canónica sin parámetros (los filtros del catálogo no crean páginas distintas). */
  path: string;
}

// Un `openGraph`/`twitter` en una página sustituye al del layout en bloque, por eso se repite
// aquí completo: así ninguna página pierde imagen, sitio ni tipo.
export function pageMetadata({ title, description, path }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "es_ES",
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
