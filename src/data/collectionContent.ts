/**
 * Contenido editorial de las colecciones (aprobado). Se relaciona con `collections.ts` por `id`; no duplica
 * datos de perfumes (colores, rasgos, familias y notas se leen de `perfumes.ts`).
 * Las tecnologías son conceptuales del universo FUMEDIRO (PRODUCT.md §4); FLORA ARCANA no tiene ninguna.
 */
export interface CollectionContent {
  /** Una frase reutilizable en distintos componentes. */
  summary: string;
  /** Párrafo editorial de 50–80 palabras. */
  concept: string;
  technology?: { name: string; description: string };
}

export const collectionContent: Record<string, CollectionContent> = {
  voltara: {
    summary: "Orbes de vidrio óptico y metal con una luz contenida en su interior.",
    concept:
      "VOLTARA nace de una idea: que la energía no se desborde, que se contenga. Tres frascos en forma de orbe, con base plana, vidrio óptico y metal, imaginan una luz propia en su interior, independiente de la fragancia. No hay estridencia, hay tensión: la sensación de algo a punto de encenderse. ION, PULSE y SOLARIS son tres maneras de llegar a esa misma intensidad contenida.",
    technology: {
      name: "LumaCore™",
      description:
        "Nombre con el que Fumediro designa la iluminación imaginada de VOLTARA: una luz contenida en el frasco, separada de la fragancia.",
    },
  },
  "flora-arcana": {
    summary: "Flores inventadas que toman forma de frasco.",
    concept:
      "Flores que no existen, imaginadas con la lógica de las que sí. En FLORA ARCANA el frasco no reproduce una flor: la inventa, con espirales, pétalos estructurales y cálices que se alzan en vertical y rompen la simetría. Son esculturas de aire botánico, sin referencias literales ni especies reconocibles. AURELIS, CORALLIS y VIRELIA se pueden mirar como se mira un jardín que solo existe aquí.",
  },
  cosmora: {
    summary: "Frascos de doble pared que encierran un pequeño cosmos de partículas.",
    concept:
      "Un universo en miniatura, cerrado y sellado. Cada frasco de COSMORA se concibe con una doble pared: en el interior, la fragancia; alrededor, una cámara decorativa con fluido y micropartículas que reflejan la luz como polvo estelar. Es un efecto de ficción y solo eso: nada de lo que brilla es un ingrediente. AURORA, ECLIPSE y ORION lo recorren en verde polar, cobre oscuro y azul con plata.",
    technology: {
      name: "Nebula Chamber™",
      description:
        "Nombre de la cámara sellada de COSMORA, la que envuelve el depósito de fragancia y guarda un fluido con micropartículas decorativas.",
    },
  },
  prismatica: {
    summary: "Cuerpos facetados que cambian con la luz que reciben.",
    concept:
      "PRISMATICA trabaja con la luz que llega de fuera. Sus frascos son cuerpos facetados, de geometría limpia, que no se iluminan por dentro: quiebran, desvían y devuelven lo que reciben. Por eso cambian según dónde se miren y con qué luz. AMETHYS, AUREON y CHROMA son tres cortes distintos de la misma idea: que la forma también puede ser un modo de mirar.",
    technology: {
      name: "PrismaLayer™",
      description:
        "Nombre de la superficie óptica de PRISMATICA, pensada para jugar con la luz exterior y no con una fuente propia.",
    },
  },
  thermae: {
    summary: "Volúmenes minerales que imaginan cambiar de matiz con el calor.",
    concept:
      "THERMAE se piensa para la mano. Son volúmenes ergonómicos, de acabado mineral o cerámico, que invitan a sostenerlos. Sobre su superficie se imagina una capa termorreactiva ficticia, capaz de cambiar de matiz con el calor: un gesto de ficción, no una promesa. BLUSH, GLACIER y TERRA recorren el espectro entre lo cálido, lo frío y lo terroso, como minerales vistos a distintas temperaturas.",
    technology: {
      name: "ThermaSkin™",
      description: "Nombre de la capa termorreactiva que THERMAE imagina sobre el acabado exterior de sus frascos.",
    },
  },
};
