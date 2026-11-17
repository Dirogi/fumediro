import { describe, expect, it } from "vitest";
import { perfumes } from "@/data/perfumes";
import { filterPerfumes, getFilterOptions, parseCatalogQuery } from "@/lib/catalogQuery";

describe("getFilterOptions", () => {
  it("deriva de los datos: 5 colecciones y solo familias existentes y únicas", () => {
    const { collections, families } = getFilterOptions();
    expect(collections).toHaveLength(5);
    const used = new Set(perfumes.map((p) => p.olfactoryFamily).filter(Boolean));
    expect(new Set(families)).toEqual(used);
    expect(families).toHaveLength(used.size);
  });
});

describe("parseCatalogQuery", () => {
  it("acepta valores válidos", () => {
    expect(parseCatalogQuery({ collection: "voltara", family: "verde aromático" })).toEqual({
      collection: "voltara",
      family: "verde aromático",
    });
  });

  it("ignora valores desconocidos, vacíos o inyectados", () => {
    expect(parseCatalogQuery({ collection: "nope", family: "<script>" })).toEqual({});
    expect(parseCatalogQuery({ collection: "", family: undefined })).toEqual({});
    expect(parseCatalogQuery({ collection: "__proto__" })).toEqual({});
  });

  it("con parámetros repetidos usa el primero", () => {
    expect(parseCatalogQuery({ collection: ["thermae", "voltara"] })).toEqual({ collection: "thermae" });
  });
});

describe("filterPerfumes", () => {
  it("sin consulta devuelve los 15", () => {
    expect(filterPerfumes(perfumes, {})).toHaveLength(15);
  });

  it("por colección devuelve sus 3", () => {
    expect(filterPerfumes(perfumes, { collection: "cosmora" }).map((p) => p.slug)).toEqual(["aurora", "eclipse", "orion"]);
  });

  it("por familia y combinada; sin coincidencias devuelve vacío", () => {
    expect(filterPerfumes(perfumes, { family: "verde aromático" }).map((p) => p.slug)).toEqual(["ion"]);
    expect(filterPerfumes(perfumes, { collection: "thermae", family: "verde aromático" })).toEqual([]);
  });

  it("no modifica la lista de entrada", () => {
    const copy = [...perfumes];
    filterPerfumes(perfumes, { collection: "voltara" });
    expect(perfumes).toEqual(copy);
  });
});
