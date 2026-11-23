import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as checkoutMetadata } from "@/app/checkout/page";
import { OG_IMAGE, pageMetadata, SITE_URL } from "@/lib/seo";

describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);

  it("lista las 26 páginas públicas, absolutas y sin duplicados", () => {
    expect(urls).toHaveLength(26);
    expect(new Set(urls).size).toBe(26);
    expect(urls.every((u) => u.startsWith(`${SITE_URL}/`))).toBe(true);
  });

  it("excluye el checkout y las URL con parámetros", () => {
    expect(urls.some((u) => u.includes("checkout") || u.includes("?"))).toBe(false);
  });

  it("incluye contacto, historia, corallis y la home", () => {
    for (const p of ["/", "/contacto", "/historia", "/perfumes/corallis", "/colecciones/prismatica"]) {
      expect(urls).toContain(`${SITE_URL}${p}`);
    }
  });
});

describe("robots", () => {
  it("permite el rastreo de todo y apunta al sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});

describe("pageMetadata", () => {
  it("usa la ruta sin parámetros como canónica y conserva la imagen en Open Graph", () => {
    const m = pageMetadata({ title: "t", description: "d", path: "/perfumes" });
    expect(m.alternates?.canonical).toBe("/perfumes");
    expect(m.openGraph).toMatchObject({ url: "/perfumes", siteName: "FUMEDIRO", type: "website" });
    expect(m.openGraph?.images).toEqual([OG_IMAGE]);
    expect(m.twitter?.images).toEqual([OG_IMAGE.url]);
  });

  it("la imagen social es el JPEG de 1200×630", () => {
    expect(OG_IMAGE).toMatchObject({ url: "/images/og/fumediro-social.jpg", type: "image/jpeg", width: 1200, height: 630 });
  });
});

describe("checkout", () => {
  it("conserva noindex/nofollow", () => {
    expect(checkoutMetadata.robots).toMatchObject({ index: false, follow: false });
  });
});
