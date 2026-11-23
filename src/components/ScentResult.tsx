import Link from "next/link";
import type { Ref } from "react";
import { GlassButton } from "@/components/GlassButton";
import { ProductImage } from "@/components/ProductImage";
import { dimensionLabels } from "@/data/scentFinder";
import { getCollectionOfPerfume } from "@/lib/catalog";
import { collectionRoute, perfumeRoute, resolveHref } from "@/lib/routes";
import { explain, matchSentence, orderedMatches, type Recommendation, type ScoredPerfume } from "@/lib/scentFinder";

const eyebrow = "text-xs font-medium uppercase tracking-[0.18em] text-silver";
const display = "font-display font-light leading-[0.95] tracking-[0.04em] text-ivory";
/** Máximo de razones por alternativa: breves; la principal las muestra todas. */
const ALT_REASONS = 2;

function Reasons({ scored, limit, compact }: { scored: ScoredPerfume; limit?: number; compact?: boolean }) {
  const matches = orderedMatches(scored).slice(0, limit);
  return (
    <dl className="divide-y divide-border border-y border-border">
      {matches.map((m) => (
        <div key={m.dimension} className={`grid gap-1 py-3.5 ${compact ? "" : "sm:grid-cols-[10.5rem_1fr] sm:gap-5"}`}>
          <dt>
            <span className="block text-xs font-medium uppercase tracking-[0.14em] text-silver">{dimensionLabels[m.dimension]}</span>
            <span className="block text-ivory">{m.choice}</span>
          </dt>
          <dd className="text-ivory">{matchSentence(m)}</dd>
        </div>
      ))}
    </dl>
  );
}

function Alternative({ scored, single }: { scored: ScoredPerfume; single: boolean }) {
  const { perfume } = scored;
  const image = perfume.images[0];
  const collection = getCollectionOfPerfume(perfume);
  const href = resolveHref(perfumeRoute(perfume.slug, perfume.name));
  const head = (
    <>
      {image && (
        <ProductImage
          image={image}
          decorative
          sizes={single ? "(min-width: 768px) 17rem, 92vw" : "(min-width: 640px) 40vw, 92vw"}
          className="rounded-2xl border border-border transition-[border-color] duration-200 group-hover:border-champagne/60 group-focus-visible:border-champagne/60"
        />
      )}
      <h3 className={`${display} mt-4 text-3xl font-medium tracking-[0.06em]`}>{perfume.name}</h3>
      {collection && <p className={`${eyebrow} mt-2`}>{collection.name}</p>}
    </>
  );
  return (
    <article
      aria-label={perfume.name}
      className={`max-w-[20rem] sm:max-w-none ${single ? "grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:items-center md:gap-10" : ""}`}
    >
      {href ? (
        <Link href={href} className="group block rounded-2xl focus-visible:outline-offset-8!">
          {head}
        </Link>
      ) : (
        <div>{head}</div>
      )}
      <div className={single ? "" : "mt-5"}>
        <Reasons scored={scored} limit={ALT_REASONS} compact />
      </div>
    </article>
  );
}

interface Props {
  result: Recommendation;
  /** Objetivo del foco al llegar al resultado. */
  titleRef: Ref<HTMLHeadingElement>;
  onChange: () => void;
  onReset: () => void;
}

export function ScentResult({ result, titleRef, onChange, onReset }: Props) {
  const { primary, alternatives } = result;
  const { perfume } = primary;
  const image = perfume.images[0];
  const collection = getCollectionOfPerfume(perfume);
  const perfumeHref = resolveHref(perfumeRoute(perfume.slug, perfume.name));
  const collectionHref = collection ? resolveHref(collectionRoute(collection.slug, collection.name)) : null;
  const explanation = explain(primary);
  const portrait = image ? image.height > image.width : true;

  return (
    <div className="mt-8 md:mt-12">
      <header className="scent-step max-w-3xl">
        <p className={eyebrow}>The Scent Finder · Tu resultado</p>
        <h1
          ref={titleRef}
          tabIndex={-1}
          className={`${display} mt-3 text-[clamp(2.75rem,7vw,5.5rem)]`}
        >
          Tu universo tiene una forma.
        </h1>
        <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-silver md:text-xl">
          Entre los quince perfumes de Fumediro, este es el que mejor dialoga con la paleta, el territorio, la forma y la
          idea que has elegido. Es una lectura editorial para orientarte, no una respuesta cerrada.
        </p>
      </header>

      <article
        aria-labelledby="scent-principal"
        className="scent-step mt-10 grid items-start gap-10 md:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-[clamp(3rem,6vw,6rem)]"
      >
        {image && (
          <ProductImage
            image={image}
            preload
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 36rem, 92vw"
            className={`w-full rounded-2xl border border-border lg:max-w-none ${portrait ? "max-w-[24rem] sm:max-w-[28rem]" : ""}`}
          />
        )}

        <div>
          <p className={eyebrow}>Tu fragancia{collection ? ` · ${collection.name}` : ""}</p>
          <h2 id="scent-principal" className={`${display} mt-2 text-[clamp(3.5rem,9vw,6.5rem)]`}>
            {perfume.name}
          </h2>
          {collection && (
            <p className="mt-4 font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-light text-silver">{collection.tagline}</p>
          )}

          <section aria-labelledby="scent-por-que" className="mt-8">
            <h3 id="scent-por-que" className="text-lg text-ivory">
              {explanation.headline}
            </h3>
            <div className="mt-4">
              <Reasons scored={primary} />
            </div>
            <p className="mt-4 text-sm text-silver">{explanation.disclaimer}</p>
          </section>

          <div className="mt-8 flex flex-wrap gap-4">
            {perfumeHref && <GlassButton href={perfumeHref}>Descubrir {perfume.name}</GlassButton>}
            {collection && collectionHref && (
              <GlassButton href={collectionHref} variant="secondary">
                Explorar {collection.name}
              </GlassButton>
            )}
          </div>
        </div>
      </article>

      {alternatives.length > 0 && (
        <section aria-labelledby="scent-otras" className="scent-step mt-16 border-t border-border pt-10 md:mt-24 md:pt-14">
          <h2 id="scent-otras" className={`${display} text-[clamp(2rem,4.5vw,3.25rem)]`}>
            Quizá también te atraigan.
          </h2>
          <div
            className={`mt-8 grid max-w-3xl gap-10 md:mt-10 ${alternatives.length > 1 ? "sm:grid-cols-2 sm:gap-8" : ""}`}
          >
            {alternatives.map((alt) => (
              <Alternative key={alt.perfume.id} scored={alt} single={alternatives.length === 1} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-8 md:mt-20">
        <GlassButton variant="secondary" onClick={onChange}>
          Cambiar respuestas
        </GlassButton>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 px-2 text-sm text-silver underline underline-offset-4 hover:text-ivory"
        >
          Volver a empezar
        </button>
      </div>
    </div>
  );
}
