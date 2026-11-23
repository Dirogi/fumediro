export type ExperienceType =
  | "led-light"
  | "botanical-explorer"
  | "particle-chamber"
  | "optical-slider"
  | "thermal-reactive";

export type FragranceFamily =
  | "verde aromático"
  | "floral especiado"
  | "ambarado especiado"
  | "floral afrutado"
  | "verde amaderado"
  | "floral verde"
  | "amaderado especiado"
  | "aromático amaderado"
  | "floral empolvado"
  | "ambarado luminoso"
  | "fresco mineral"
  | "floral almizclado"
  | "fresco aromático"
  | "amaderado terroso";

/** Referencia a un asset local verificado en public/. Vacío hasta incorporar imágenes. */
export interface ImageRef {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "editorial" | "packshot";
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  /** Nombres de acento según DESIGN.md; los valores hex se definirán al aprobarse. */
  accentNames: string[];
  experienceType: ExperienceType;
  perfumeIds: string[];
}

export interface Perfume {
  id: string;
  slug: string;
  collectionId: string;
  name: string;
  /** Color/acabado del frasco, tal como figura en PRODUCT.md. */
  colorway?: string;
  /** Rasgo de diseño del frasco, tal como figura en PRODUCT.md. */
  specialFeature?: string;
  olfactoryFamily?: FragranceFamily;
  /** Notas sin clasificar en pirámide. */
  notes?: string[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  shortDescription?: string;
  story?: string;
  characterTags?: string[];
  /** Color CSS aprobado; ausente hasta que se defina. */
  accentColor?: string;
  images: ImageRef[];
  availableFormats?: { id: string; label: string }[];
  /** Atributos del cuestionario (Fase 5); se definirán con el quiz. */
  quizAttributes?: Record<string, string | number>;
  isFeatured?: boolean;
}
