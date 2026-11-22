// The Scent Finder · capa interpretativa de descubrimiento (D6).
//
// Estas asociaciones son una lectura editorial de Fumediro para orientar la recomendación.
// NO son propiedades físicas ni olfativas del producto y no se muestran como tales. Los datos
// oficiales (nombre, colorway, specialFeature, olfactoryFamily, notes) viven en perfumes.ts; aquí
// solo se referencian por id y se indica en qué campo se apoya cada asociación (`Evidence`).
// Un perfume nuevo entra en el cuestionario añadiendo su entrada a `perfumeProfiles`.

export type PaletteId = "verdes" | "azules-plata" | "rosas-corales" | "magenta-violeta" | "oro-cobre-tierra";
export type TerritoryId = "floral" | "verde-fresco" | "amaderado" | "ambar-especias";
export type ShapeId = "curvas-botanicas" | "facetas-geometria" | "luz-reflejos" | "volumenes-vetas";
/** Mismo id que la colección. */
export type ConceptId = "voltara" | "flora-arcana" | "cosmora" | "prismatica" | "thermae";

export type Dimension = "palette" | "territory" | "shape" | "concept";
export type Answers = { palette: PaletteId; territory: TerritoryId; shape: ShapeId; concept: ConceptId };

export const dimensionLabels: Record<Dimension, string> = {
  palette: "Paleta",
  territory: "Territorio olfativo",
  shape: "Forma",
  concept: "Idea",
};

export interface ScentOption<Id extends string = string> {
  id: Id;
  label: string;
  /** Pista breve para quien responde; describe la categoría, no una fragancia concreta. */
  hint: string;
}

export interface ScentQuestion<D extends Dimension = Dimension> {
  dimension: D;
  title: string;
  options: ScentOption<Answers[D]>[];
}

export const questions: [
  ScentQuestion<"palette">,
  ScentQuestion<"territory">,
  ScentQuestion<"shape">,
  ScentQuestion<"concept">,
] = [
  {
    dimension: "palette",
    title: "¿Qué paleta te atrae más?",
    options: [
      { id: "verdes", label: "Verdes", hint: "Esmeralda, jade y verde polar." },
      { id: "azules-plata", label: "Azules y plata", hint: "Azul oscuro, azul hielo y gris perla." },
      { id: "rosas-corales", label: "Rosas y corales", hint: "Coral opalino y marfil rosado." },
      { id: "magenta-violeta", label: "Magenta y violeta", hint: "Magenta intenso y amatista." },
      { id: "oro-cobre-tierra", label: "Oro, cobre y tierra", hint: "Ámbar, champagne, cobre y bronce." },
    ],
  },
  {
    dimension: "territory",
    title: "¿En qué territorio olfativo te apetece entrar?",
    options: [
      { id: "floral", label: "Floral", hint: "Flores, pétalos y jardines." },
      { id: "verde-fresco", label: "Verde y fresco", hint: "Hojas, hierbas y aire fresco." },
      { id: "amaderado", label: "Amaderado", hint: "Maderas, tierra y sombra." },
      { id: "ambar-especias", label: "Ámbar y especias", hint: "Calidez, resinas y especias." },
    ],
  },
  {
    dimension: "shape",
    title: "¿Qué forma te llama más la atención?",
    options: [
      { id: "curvas-botanicas", label: "Curvas y formas botánicas", hint: "Espirales, pétalos y siluetas orgánicas." },
      { id: "facetas-geometria", label: "Facetas y geometría", hint: "Prismas, caras planas y ángulos." },
      { id: "luz-reflejos", label: "Luz y reflejos", hint: "Núcleos luminosos, halos y destellos." },
      { id: "volumenes-vetas", label: "Volúmenes y vetas", hint: "Masas compactas y vetas de piedra." },
    ],
  },
  {
    dimension: "concept",
    title: "¿Qué idea te resulta más evocadora?",
    options: [
      { id: "voltara", label: "Luz interior", hint: "VOLTARA" },
      { id: "flora-arcana", label: "Flor imaginada", hint: "FLORA ARCANA" },
      { id: "cosmora", label: "Cosmos sellado", hint: "COSMORA" },
      { id: "prismatica", label: "Reflejos y refracción", hint: "PRISMATICA" },
      { id: "thermae", label: "Respuesta cromática al calor", hint: "THERMAE" },
    ],
  },
];

/** Campo oficial del perfume en el que se apoya una asociación. */
export type Evidence =
  | { field: "olfactoryFamily"; /** Fragmento literal de la familia; si falta, se cita entera. */ term?: string }
  | { field: "notes"; /** Notas concretas (todas deben figurar en `notes`). */ terms: string[] }
  | { field: "colorway"; term?: string }
  | { field: "specialFeature"; term?: string };

export interface Link<Id extends string> {
  id: Id;
  evidence: Evidence;
}
export interface Association<Id extends string> {
  primary: Link<Id>;
  secondary?: Link<Id>;
}
export interface PerfumeProfile {
  palette: Association<PaletteId>;
  territory: Association<TerritoryId>;
  shape: Association<ShapeId>;
}

const fam = (term?: string): Evidence => ({ field: "olfactoryFamily", term });
const color = (term?: string): Evidence => ({ field: "colorway", term });
const feat = (term?: string): Evidence => ({ field: "specialFeature", term });

// Matrices aprobadas tras la simulación de D6-A. Puntuación: principal 3, secundaria 1.
export const perfumeProfiles: Record<string, PerfumeProfile> = {
  ion: {
    palette: { primary: { id: "verdes", evidence: color() } },
    territory: { primary: { id: "verde-fresco", evidence: fam() } },
    shape: {
      primary: { id: "luz-reflejos", evidence: feat() },
      secondary: { id: "facetas-geometria", evidence: feat("radial") },
    },
  },
  pulse: {
    palette: {
      primary: { id: "magenta-violeta", evidence: color() },
      secondary: { id: "rosas-corales", evidence: color() },
    },
    territory: {
      primary: { id: "floral", evidence: fam("floral") },
      secondary: { id: "ambar-especias", evidence: fam("especiado") },
    },
    shape: { primary: { id: "curvas-botanicas", evidence: feat() } },
  },
  solaris: {
    palette: { primary: { id: "oro-cobre-tierra", evidence: color() } },
    territory: { primary: { id: "ambar-especias", evidence: fam() } },
    shape: { primary: { id: "luz-reflejos", evidence: feat() } },
  },
  // AURELIS no tiene familia olfativa definida: solo se citan sus notas aprobadas.
  aurelis: {
    palette: { primary: { id: "oro-cobre-tierra", evidence: color("oro") } },
    territory: {
      primary: { id: "floral", evidence: { field: "notes", terms: ["neroli", "magnolia"] } },
      secondary: { id: "verde-fresco", evidence: { field: "notes", terms: ["cítricos"] } },
    },
    shape: { primary: { id: "curvas-botanicas", evidence: feat() } },
  },
  corallis: {
    palette: { primary: { id: "rosas-corales", evidence: color() } },
    territory: { primary: { id: "floral", evidence: fam() } },
    shape: { primary: { id: "curvas-botanicas", evidence: feat() } },
  },
  virelia: {
    palette: { primary: { id: "verdes", evidence: color() } },
    territory: {
      primary: { id: "verde-fresco", evidence: fam("verde") },
      secondary: { id: "amaderado", evidence: fam("amaderado") },
    },
    shape: { primary: { id: "curvas-botanicas", evidence: feat() } },
  },
  aurora: {
    palette: {
      primary: { id: "verdes", evidence: color("verde polar") },
      secondary: { id: "azules-plata", evidence: color("azul petróleo") },
    },
    territory: {
      primary: { id: "floral", evidence: fam("floral") },
      secondary: { id: "verde-fresco", evidence: fam("verde") },
    },
    shape: { primary: { id: "luz-reflejos", evidence: feat() } },
  },
  eclipse: {
    palette: { primary: { id: "oro-cobre-tierra", evidence: color("cobre") } },
    territory: {
      primary: { id: "amaderado", evidence: fam("amaderado") },
      secondary: { id: "ambar-especias", evidence: fam("especiado") },
    },
    shape: { primary: { id: "volumenes-vetas", evidence: feat() } },
  },
  orion: {
    palette: { primary: { id: "azules-plata", evidence: color() } },
    territory: {
      primary: { id: "amaderado", evidence: fam("amaderado") },
      secondary: { id: "verde-fresco", evidence: fam("aromático") },
    },
    shape: {
      primary: { id: "facetas-geometria", evidence: feat("prisma") },
      secondary: { id: "volumenes-vetas", evidence: feat("redondeado") },
    },
  },
  amethys: {
    palette: { primary: { id: "magenta-violeta", evidence: color() } },
    territory: { primary: { id: "floral", evidence: fam() } },
    shape: { primary: { id: "facetas-geometria", evidence: feat() } },
  },
  aureon: {
    palette: { primary: { id: "oro-cobre-tierra", evidence: color() } },
    territory: { primary: { id: "ambar-especias", evidence: fam("ambarado") } },
    shape: { primary: { id: "facetas-geometria", evidence: feat() } },
  },
  chroma: {
    palette: { primary: { id: "azules-plata", evidence: color() } },
    territory: { primary: { id: "verde-fresco", evidence: fam("fresco") } },
    shape: {
      primary: { id: "facetas-geometria", evidence: feat("prisma") },
      secondary: { id: "curvas-botanicas", evidence: feat("helicoidal") },
    },
  },
  blush: {
    palette: { primary: { id: "rosas-corales", evidence: color("rosado") } },
    territory: { primary: { id: "floral", evidence: fam("floral") } },
    shape: { primary: { id: "luz-reflejos", evidence: feat() } },
  },
  glacier: {
    palette: { primary: { id: "azules-plata", evidence: color() } },
    territory: { primary: { id: "verde-fresco", evidence: fam("fresco") } },
    shape: { primary: { id: "volumenes-vetas", evidence: feat() } },
  },
  terra: {
    palette: { primary: { id: "oro-cobre-tierra", evidence: color() } },
    territory: { primary: { id: "amaderado", evidence: fam("amaderado") } },
    shape: { primary: { id: "volumenes-vetas", evidence: feat() } },
  },
};

export const POINTS = { primary: 3, secondary: 1 } as const;
export const CONCEPT_POINTS = 3;

export const DISCLAIMER =
  "Las afinidades son una lectura editorial de Fumediro para orientar el descubrimiento; no describen propiedades medidas de la fragancia.";
