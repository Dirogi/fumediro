import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { perfumes } from "@/data/perfumes";
import type { Perfume } from "@/lib/types";

const publicDir = fileURLToPath(new URL("../../public", import.meta.url));
const productsDir = `${publicDir}/images/products`;

const imageOf = (p: Perfume) => {
  const img = p.images[0];
  if (!img) throw new Error(`${p.id} sin imagen`);
  return img;
};

/** Lee ancho/alto de la cabecera WebP (VP8, VP8L o VP8X); sin dependencias. */
function webpSize(buf: Buffer): { width: number; height: number } {
  expect(buf.toString("ascii", 0, 4)).toBe("RIFF");
  expect(buf.toString("ascii", 8, 12)).toBe("WEBP");
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  throw new Error(`Formato WebP no reconocido: ${chunk}`);
}

// Excepción aprobada: el archivo físico de CORALLIS conserva su nombre original (coralis.webp); no se renombra ni duplica.
const fileName: Record<string, string> = { corallis: "coralis" };

describe("imágenes de producto", () => {
  it("cada perfume tiene exactamente una imagen en su ruta canónica", () => {
    for (const p of perfumes) {
      expect(p.images, p.id).toHaveLength(1);
      expect(imageOf(p).src).toBe(`/images/products/${p.collectionId}/${fileName[p.slug] ?? p.slug}.webp`);
    }
  });

  it("los archivos existen y sus dimensiones coinciden con los datos", () => {
    for (const p of perfumes) {
      const img = imageOf(p);
      const file = `${publicDir}${img.src}`;
      expect(existsSync(file), img.src).toBe(true);
      expect(webpSize(readFileSync(file)), img.src).toEqual({ width: img.width, height: img.height });
    }
  });

  it("alt y tipo están definidos y mencionan el perfume", () => {
    for (const p of perfumes) {
      const img = imageOf(p);
      expect(img.kind).toBe("editorial");
      expect(img.alt).toContain(p.name);
    }
  });

  it("no hay archivos WebP sobrantes ni referencias huérfanas", () => {
    const onDisk = readdirSync(productsDir, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith(".webp"))
      .map((f) => `/images/products/${f.replaceAll("\\", "/")}`)
      .sort();
    expect(onDisk).toEqual(perfumes.map((p) => imageOf(p).src).sort());
  });
});
