import type { Perfume } from "@/lib/types";

// Solo datos definidos en PRODUCT.md. Historias, descripciones, tags, notas por
// pirámide, formatos, precios e imágenes: pendiente de contenido aprobado.
export const perfumes: Perfume[] = [
  { id: "ion", slug: "ion", collectionId: "voltara", name: "ION", colorway: "verde esmeralda", specialFeature: "estructura radial", olfactoryFamily: "verde aromático", images: [] },
  { id: "pulse", slug: "pulse", collectionId: "voltara", name: "PULSE", colorway: "magenta", specialFeature: "nervaduras curvas", olfactoryFamily: "floral especiado", images: [] },
  { id: "solaris", slug: "solaris", collectionId: "voltara", name: "SOLARIS", colorway: "ámbar/dorado", specialFeature: "núcleo óptico suspendido", olfactoryFamily: "ambarado especiado", images: [] },

  { id: "aurelis", slug: "aurelis", collectionId: "flora-arcana", name: "AURELIS", colorway: "marfil/oro", specialFeature: "espiral floral", notes: ["neroli", "magnolia", "cítricos"], images: [] },
  { id: "coralis", slug: "coralis", collectionId: "flora-arcana", name: "CORALIS", colorway: "coral opalino", specialFeature: "cinco pétalos estructurales", olfactoryFamily: "floral afrutado", images: [] },
  { id: "virelia", slug: "virelia", collectionId: "flora-arcana", name: "VIRELIA", colorway: "verde jade", specialFeature: "cáliz vertical asimétrico", olfactoryFamily: "verde amaderado", images: [] },

  { id: "aurora", slug: "aurora", collectionId: "cosmora", name: "AURORA", colorway: "verde polar / azul petróleo", specialFeature: "reflejos aurorales", olfactoryFamily: "floral verde", images: [] },
  { id: "eclipse", slug: "eclipse", collectionId: "cosmora", name: "ECLIPSE", colorway: "cobre oscuro / negro", specialFeature: "disco aplanado", olfactoryFamily: "amaderado especiado", images: [] },
  { id: "orion", slug: "orion", collectionId: "cosmora", name: "ORION", colorway: "azul oscuro / plata", specialFeature: "prisma redondeado", olfactoryFamily: "aromático amaderado", images: [] },

  { id: "amethys", slug: "amethys", collectionId: "prismatica", name: "AMETHYS", colorway: "amatista", specialFeature: "sección hexagonal", olfactoryFamily: "floral empolvado", images: [] },
  { id: "aureon", slug: "aureon", collectionId: "prismatica", name: "AUREON", colorway: "champagne", specialFeature: "facetas amplias", olfactoryFamily: "ambarado luminoso", images: [] },
  { id: "chroma", slug: "chroma", collectionId: "prismatica", name: "CHROMA", colorway: "azul hielo", specialFeature: "prisma helicoidal", olfactoryFamily: "fresco mineral", images: [] },

  { id: "blush", slug: "blush", collectionId: "thermae", name: "BLUSH", colorway: "marfil rosado", specialFeature: "halos rosa cálido", olfactoryFamily: "floral almizclado", images: [] },
  { id: "glacier", slug: "glacier", collectionId: "thermae", name: "GLACIER", colorway: "gris perla", specialFeature: "vetas azuladas", olfactoryFamily: "fresco aromático", images: [] },
  { id: "terra", slug: "terra", collectionId: "thermae", name: "TERRA", colorway: "marrón mineral", specialFeature: "vetas arena y bronce", olfactoryFamily: "amaderado terroso", images: [] },
];
