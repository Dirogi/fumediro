/** Partículas decorativas de la cámara de COSMORA. Determinista (sin Math.random): el servidor y el cliente generan lo mismo. */
export interface Particle {
  /** Posición de reposo, % del ancho y del alto de la cámara. */
  x: number;
  y: number;
  /** Diámetro en px. */
  size: number;
  /** Opacidad en reposo. */
  rest: number;
  /** Desplazamiento máximo durante la agitación, px. */
  dx: number;
  dy: number;
  /** Retraso escalonado, s. */
  delay: number;
}

export const PARTICLE_COUNT = 20;

const frac = (n: number) => n - Math.floor(n);
const round = (n: number) => Math.round(n * 10) / 10;

// Secuencias de baja discrepancia (razón áurea y constante plástica): reparto uniforme sin patrón visible.
export const particles: readonly Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  x: round(4 + frac((i + 1) * 0.618034) * 92),
  y: round(8 + frac((i + 1) * 0.754878) * 84),
  size: 2 + ((i * 7) % 4),
  rest: round(0.35 + ((i * 5) % 6) * 0.1),
  dx: round((frac((i + 1) * 0.3247) - 0.5) * 90),
  dy: round((frac((i + 1) * 0.5698) - 0.5) * 60),
  delay: round((i % 5) * 0.03),
}));

/** Índice de una partícula con el retraso máximo: cuando termina ella, la agitación ha terminado. */
export const LAST_PARTICLE = particles.reduce((best, p, i, all) => (p.delay >= (all[best]?.delay ?? 0) ? i : best), 0);
