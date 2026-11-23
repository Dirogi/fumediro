import Image from "next/image";
import type { ImageRef } from "@/lib/types";

interface Props {
  image: ImageRef;
  sizes: string;
  /** Sin texto alternativo cuando el nombre ya está en texto adyacente (tarjetas). */
  decorative?: boolean;
  preload?: boolean;
  /** Clases del contenedor (borde, radio). */
  className?: string;
  /** Clases de la <img> (p. ej. transform al interactuar). */
  imgClassName?: string;
}

/**
 * Imagen en su proporción original: width/height del ImageRef reservan el espacio (sin CLS)
 * y la imagen nunca se recorta ni se deforma.
 */
export function ProductImage({ image, sizes, decorative, preload, className = "", imgClassName = "" }: Props) {
  return (
    <div className={`overflow-clip ${className}`}>
      <Image
        src={image.src}
        alt={decorative ? "" : image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        preload={preload}
        className={`block h-auto w-full ${imgClassName}`}
      />
    </div>
  );
}
