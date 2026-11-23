/** Contenido de /historia que depende del catálogo: una frase por colección y los perfumes del capítulo II. */
export const universeLines: Record<string, string> = {
  voltara: "La energía de una luz contenida.",
  "flora-arcana": "Flores que solo existen en la imaginación.",
  cosmora: "Un universo encapsulado en cada frasco.",
  prismatica: "Geometría que transforma la luz.",
  thermae: "El color como expresión del cambio.",
};

/** Orden del capítulo II: esfera (radial), faceta y pétalos, como en el texto. */
export const formPerfumeSlugs = ["ion", "aureon", "corallis"] as const;
