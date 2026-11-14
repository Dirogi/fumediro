// Firmas de luz de la Home: solo presentación, CSS puro, sin imágenes.
// provisional: los hex de acento son de evaluación visual y están pendientes de aprobación;
// no se consolidan en src/data ni en DESIGN.md hasta que se revise el resultado.
//
// VOLTARA magenta #C2308A · verde #2FB58A · ámbar #E0A33A
// FLORA ARCANA jade #4FA58B · coral #E8806A · marfil #EFE6D2
// COSMORA azul #3B5BA8 · violeta #7A5BC4 · cobre #B8714A
// PRISMATICA amatista #8E63B5 · champagne #C7AD83 · azul hielo #A9D3E6
// THERMAE rosa #D98A9A · mineral #9A9488 · terracota #B5593C

const star = (x: number, y: number) =>
  `radial-gradient(circle at ${x}% ${y}%, rgb(242 238 230 / 0.85) 0 1px, transparent 1.5px)`;

const JADE = "79 165 139";
const CORAL = "232 128 106";
const MARFIL = "239 230 210";

const K = 1.1; // escala de la flor

// Elipse de px con núcleo y borde suave, desplazada (dx, dy) del centro de la flor.
const petal = (dx: number, dy: number, rx: number, ry: number, rgb: string, alpha: number) =>
  `radial-gradient(ellipse ${rx * K}px ${ry * K}px at calc(100% - var(--sig-x) + ${dx * K}px) calc(50% + ${dy * K}px), rgb(${rgb} / ${alpha}) 0 40%, transparent 100%)`;

export const collectionLight: Record<string, string> = {
  // energía contenida: núcleo ámbar y anillos concéntricos de magenta
  voltara: [
    "radial-gradient(circle at 82% 50%, rgb(224 163 58 / 0.42) 0, transparent 9%)",
    "repeating-radial-gradient(circle at 82% 50%, transparent 0 22px, rgb(194 48 138 / 0.34) 22px 23px, transparent 23px 46px)",
    "radial-gradient(circle at 82% 50%, rgb(47 181 138 / 0.16), transparent 45%)",
  ].join(","),

  // botánica imaginaria: flor abstracta de ocho pétalos (elipses de borde definido, sin ilustrar).
  // Geometría en px anclada al borde derecho (--sig-x) para que no se deforme entre breakpoints.
  "flora-arcana": [
    "radial-gradient(circle 12px at calc(100% - var(--sig-x)) 50%, rgb(239 230 210 / 0.34), transparent)",
    petal(0, -50, 22, 50, JADE, 0.36),
    petal(0, 50, 22, 50, CORAL, 0.32),
    petal(-58, 0, 54, 20, MARFIL, 0.24),
    petal(58, 0, 54, 20, JADE, 0.3),
    petal(-40, -36, 17, 34, CORAL, 0.22),
    petal(40, -36, 17, 34, MARFIL, 0.2),
    petal(-40, 36, 17, 34, JADE, 0.22),
    petal(40, 36, 17, 34, CORAL, 0.2),
    // halo atmosférico muy tenue detrás de la flor
    "radial-gradient(ellipse 200px 115px at calc(100% - var(--sig-x)) 50%, rgb(79 165 139 / 0.10), transparent 100%)",
    "radial-gradient(ellipse 150px 95px at calc(100% - var(--sig-x) + 56px) calc(50% + 8px), rgb(232 128 106 / 0.08), transparent 100%)",
  ].join(","),

  // universo encapsulado: nebulosa violeta-azul, núcleo de cobre y puntos de luz
  cosmora: [
    star(62, 24),
    star(71, 72),
    star(90, 18),
    star(95, 78),
    star(77, 40),
    star(58, 60),
    "radial-gradient(circle at 82% 50%, rgb(184 113 74 / 0.30) 0, transparent 14%)",
    "radial-gradient(ellipse 45% 70% at 82% 50%, rgb(122 91 196 / 0.32), rgb(59 91 168 / 0.20) 45%, transparent 75%)",
  ].join(","),

  // óptica y refracción: facetas de corte duro y un filo de luz
  prismatica: [
    "linear-gradient(112deg, transparent 0 49%, rgb(242 238 230 / 0.34) 49% 49.3%, transparent 49.3% 100%)",
    "linear-gradient(112deg, transparent 0 34%, rgb(142 99 181 / 0.20) 34% 44%, transparent 44% 52%, rgb(169 211 230 / 0.16) 52% 60%, transparent 60% 66%, rgb(199 173 131 / 0.22) 66% 72%, transparent 72% 100%)",
  ].join(","),

  // tacto y temperatura: del mineral frío al terracota cálido
  thermae:
    "linear-gradient(90deg, transparent 0, rgb(154 148 136 / 0.10) 30%, rgb(217 138 154 / 0.18) 62%, rgb(181 89 60 / 0.30) 100%)",
};
