import { describe, expect, it, vi } from "vitest";
import { LAST_PARTICLE, PARTICLE_COUNT, particles } from "@/lib/cosmoraParticles";

describe("partículas de COSMORA", () => {
  it("son entre 16 y 24 y se generan siempre igual", async () => {
    expect(particles.length).toBe(PARTICLE_COUNT);
    expect(PARTICLE_COUNT).toBeGreaterThanOrEqual(16);
    expect(PARTICLE_COUNT).toBeLessThanOrEqual(24);
    // Módulo evaluado de nuevo desde cero: idéntico resultado (sin aleatoriedad).
    vi.resetModules();
    const again = await import("@/lib/cosmoraParticles");
    expect(again.particles).not.toBe(particles);
    expect(JSON.stringify(again.particles)).toBe(JSON.stringify(particles));
  });

  it("quedan dentro de la cámara, con tamaños y opacidades discretos", () => {
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(100);
      expect(p.size).toBeGreaterThanOrEqual(2);
      expect(p.size).toBeLessThanOrEqual(5);
      expect(p.rest).toBeGreaterThan(0);
      expect(p.rest).toBeLessThanOrEqual(1);
      expect(Math.abs(p.dx)).toBeLessThanOrEqual(45);
      expect(Math.abs(p.dy)).toBeLessThanOrEqual(30);
    }
  });

  it("la última partícula en terminar tiene el retraso máximo", () => {
    const max = Math.max(...particles.map((p) => p.delay));
    expect(particles[LAST_PARTICLE]?.delay).toBe(max);
  });
});
