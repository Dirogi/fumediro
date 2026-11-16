import { getImageProps } from "next/image";

// Dirección de arte con <picture>: el navegador descarga solo la imagen que corresponde.
// Criterio: orientación (horizontal → imagen de escritorio), no ancho; ver también globals.css.
const common = {
  alt: "",
  fill: true,
  sizes: "100vw",
  quality: 75,
  className: "object-cover object-[70%_50%]",
};

export function HeroBackdrop() {
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: "/images/hero/hero-desktop.png" });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({
    ...common,
    src: "/images/hero/hero-mobile.png",
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="hero-light" />
      <picture>
        <source media="(min-aspect-ratio: 1/1)" srcSet={desktop} sizes="100vw" />
        <img {...img} srcSet={mobile} alt="" />
      </picture>
      <div className="hero-scrim" />
    </div>
  );
}
