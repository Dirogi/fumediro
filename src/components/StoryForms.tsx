import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formPerfumeSlugs } from "@/data/story";
import { getCollectionOfPerfume, getPerfumeBySlug } from "@/lib/catalog";
import { perfumeRoute, resolveHref } from "@/lib/routes";

// Colocación por perfume. Las proporciones reales mandan: AUREON es horizontal (3:2), ION y CORALLIS verticales (3:4).
const place: Record<(typeof formPerfumeSlugs)[number], { box: string; sizes: string }> = {
  ion: {
    box: "w-[78%] lg:col-span-4 lg:col-start-1 lg:w-auto",
    sizes: "(min-width: 1024px) 30vw, 78vw",
  },
  aureon: { box: "lg:col-span-7 lg:col-start-6 lg:mt-40", sizes: "(min-width: 1024px) 56vw, 100vw" },
  corallis: {
    box: "ml-auto w-[78%] lg:col-span-4 lg:col-start-2 lg:ml-0 lg:-mt-16 lg:w-auto",
    sizes: "(min-width: 1024px) 30vw, 78vw",
  },
};

export function StoryForms() {
  return (
    <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12 lg:gap-y-12">
      {formPerfumeSlugs.map((slug) => {
        const perfume = getPerfumeBySlug(slug);
        const image = perfume?.images[0];
        if (!perfume || !image) return null;
        const href = resolveHref(perfumeRoute(perfume.slug, perfume.name));
        const collection = getCollectionOfPerfume(perfume);
        return (
          <figure key={slug} className={`reveal ${place[slug].box}`}>
            <ProductImage image={image} sizes={place[slug].sizes} className="rounded-2xl border border-border" />
            <figcaption className="mt-3 text-sm text-silver">
              {href ? (
                <Link href={href} className="inline-block py-2 font-medium tracking-[0.14em] text-ivory underline underline-offset-4">
                  {perfume.name}
                </Link>
              ) : (
                perfume.name
              )}
              {perfume.specialFeature && <span> · {perfume.specialFeature}</span>}
              {collection && <span> · {collection.name}</span>}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
