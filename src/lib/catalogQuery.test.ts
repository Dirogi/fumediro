import { describe, expect, it } from "vitest";
import { perfumes } from "@/data/perfumes";
import { applyCatalogQuery, filterPerfumes, getFilterOptions, parseCatalogQuery, serializeCatalogQuery } from "@/lib/catalogQuery";

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

describe("sort, serialización y URL", () => {
  it("parsea sort=name y descarta otros valores", () => {
    expect(parseCatalogQuery({ sort: "name" })).toEqual({ sort: "name" });
    expect(parseCatalogQuery({ sort: "price" })).toEqual({});
    expect(parseCatalogQuery({ sort: ["name", "x"] })).toEqual({ sort: "name" });
    expect(parseCatalogQuery({ sort: ["x", "name"] })).toEqual({});
  });

  it("restaura el estado desde URLSearchParams, ignora desconocidos y usa el primer repetido", () => {
    expect(parseCatalogQuery(new URLSearchParams("collection=cosmora&sort=name&utm=1"))).toEqual({ collection: "cosmora", sort: "name" });
    expect(parseCatalogQuery(new URLSearchParams("collection=nope&collection=cosmora"))).toEqual({});
    expect(parseCatalogQuery(new URLSearchParams("collection=thermae&collection=cosmora"))).toEqual({ collection: "thermae" });
    expect(parseCatalogQuery(new URLSearchParams("sort="))).toEqual({});
  });

  it("serializa en orden canónico y es inversa de parse", () => {
    expect(serializeCatalogQuery({})).toBe("");
    expect(serializeCatalogQuery({ sort: "name", collection: "cosmora" })).toBe("collection=cosmora&sort=name");
    expect(serializeCatalogQuery({ family: "verde aromático" })).toBe("");
    const q = { collection: "voltara", sort: "name" } as const;
    expect(parseCatalogQuery(new URLSearchParams(serializeCatalogQuery(q)))).toEqual(q);
  });

  it("applyCatalogQuery: editorial, A–Z y combinados, sin mutar la entrada", () => {
    const copy = [...perfumes];
    expect(applyCatalogQuery(perfumes, {}).map((p) => p.id)).toEqual(copy.map((p) => p.id));
    const az = applyCatalogQuery(perfumes, { sort: "name" }).map((p) => p.name);
    expect(az).toHaveLength(15);
    expect(az).toEqual([...az].sort((a, b) => a.localeCompare(b, "es")));
    expect(applyCatalogQuery(perfumes, { collection: "cosmora", sort: "name" }).map((p) => p.slug)).toEqual(["aurora", "eclipse", "orion"]);
    expect(perfumes).toEqual(copy);
  });
});
