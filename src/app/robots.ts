import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Sin `Disallow` para el checkout: debe poder rastrearse para que se lea su `noindex` (ver su metadata).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
