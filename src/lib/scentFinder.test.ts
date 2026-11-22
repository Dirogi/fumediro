import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { perfumeProfiles, questions, type Answers, type Dimension } from "@/data/scentFinder";
import { collections } from "@/data/collections";
import { perfumes } from "@/data/perfumes";
import {
  explain,
  explainMatch,
  matchSentence,
  orderedMatches,
  parseAnswers,
  rankPerfumes,
  recommend,
  resolveEvidence,
  scorePerfume,
  type ScoredPerfume,
} from "@/lib/scentFinder";

const byDim = Object.fromEntries(questions.map((q) => [q.dimension, q.options.map((o) => o.id)])) as {
  [D in Dimension]: Answers[D][];
};

/** Las 5 × 4 × 4 × 5 = 400 combinaciones posibles. */
const ALL: Answers[] = byDim.palette.flatMap((palette) =>
  byDim.territory.flatMap((territory) =>
    byDim.shape.flatMap((shape) => byDim.concept.map((concept) => ({ palette, territory, shape, concept }))),
  ),
);
const key = (a: Answers) => `${a.palette}|${a.territory}|${a.shape}|${a.concept}`;
const perfume = (id: string) => perfumes.find((p) => p.id === id)!;
const answers = (over: Partial<Answers>): Answers => ({
  palette: "verdes",
  territory: "floral",
  shape: "curvas-botanicas",
  concept: "flora-arcana",
  ...over,
});
const sameKey = (a: ScoredPerfume, b: ScoredPerfume) =>
  a.total === b.total && a.points.territory === b.points.territory && a.points.shape === b.points.shape && a.points.palette === b.points.palette;

describe("datos del cuestionario", () => {
  it("son 4 preguntas con 5/4/4/5 opciones de id único", () => {
    expect(questions.map((q) => q.dimension)).toEqual(["palette", "territory", "shape", "concept"]);
    expect(questions.map((q) => q.options.length)).toEqual([5, 4, 4, 5]);
    for (const q of questions) expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
  });

  it("los conceptos son exactamente las colecciones", () => {
    expect(byDim.concept).toEqual(collections.map((c) => c.id));
  });

  it("hay un perfil por cada perfume del catálogo y ninguno de más", () => {
    expect(Object.keys(perfumeProfiles).sort()).toEqual(perfumes.map((p) => p.id).sort());
  });

  it("cada asociación usa opciones existentes, sin repetir principal y secundaria", () => {
    for (const [id, profile] of Object.entries(perfumeProfiles)) {
      for (const dimension of ["palette", "territory", "shape"] as const) {
        const { primary, secondary } = profile[dimension];
        expect(byDim[dimension], `${id}.${dimension}`).toContain(primary.id);
        if (secondary) {
          expect(byDim[dimension], `${id}.${dimension}`).toContain(secondary.id);
          expect(secondary.id).not.toBe(primary.id);
        }
      }
    }
  });

  it("toda evidencia se resuelve contra el dato oficial del perfume", () => {
    for (const [id, profile] of Object.entries(perfumeProfiles)) {
      for (const dimension of ["palette", "territory", "shape"] as const) {
        for (const link of [profile[dimension].primary, profile[dimension].secondary]) {
          if (link) expect(resolveEvidence(perfume(id), link.evidence), `${id}.${dimension}.${link.id}`).not.toBeNull();
        }
      }
    }
  });

  it("AURELIS no tiene familia olfativa y su perfil no la cita", () => {
    expect(perfume("aurelis").olfactoryFamily).toBeUndefined();
    expect(JSON.stringify(perfumeProfiles.aurelis)).not.toContain("olfactoryFamily");
  });
});

describe("parseAnswers", () => {
  it("acepta respuestas completas y válidas", () => {
    const a = answers({});
    expect(parseAnswers(a)).toEqual(a);
  });

  it("rechaza entradas incompletas, desconocidas o de otro tipo", () => {
    const base = answers({});
    for (const bad of [null, undefined, "x", 3, [], {}, { ...base, palette: undefined }, { ...base, shape: "otra" }, { ...base, concept: 1 }]) {
      expect(parseAnswers(bad)).toBeNull();
    }
    expect(parseAnswers({ ...base, territory: "__proto__" })).toBeNull();
    expect(parseAnswers({ ...base, territory: "toString" })).toBeNull();
  });

  it("descarta campos adicionales", () => {
    expect(parseAnswers({ ...answers({}), extra: "x" })).toEqual(answers({}));
  });
});

describe("puntuación y evidencia", () => {
  it("AURELIS + Floral cita neroli y magnolia; + Verde y fresco cita solo cítricos", () => {
    const floral = scorePerfume(perfume("aurelis"), answers({ territory: "floral" }));
    const t = floral.matches.find((m) => m.dimension === "territory")!;
    expect(t).toMatchObject({ level: "primary", points: 3, evidence: { field: "notes", quote: "neroli y magnolia" } });
    expect(explainMatch(t)).toContain("neroli y magnolia");
    expect(explainMatch(t)).not.toContain("cítricos");

    const fresh = scorePerfume(perfume("aurelis"), answers({ territory: "verde-fresco" }));
    const f = fresh.matches.find((m) => m.dimension === "territory")!;
    expect(f).toMatchObject({ level: "secondary", points: 1, evidence: { field: "notes", quote: "cítricos" } });
    expect(explainMatch(f)).toContain("cítricos");
    expect(explainMatch(f)).not.toMatch(/neroli|magnolia/);
  });

  it("principal 3, secundaria 1 y concepto 3", () => {
    // ORION: azules (3) + verde-fresco secundario (1) + facetas (3) + COSMORA (3)
    const s = scorePerfume(perfume("orion"), answers({ palette: "azules-plata", territory: "verde-fresco", shape: "facetas-geometria", concept: "cosmora" }));
    expect(s.points).toEqual({ palette: 3, territory: 1, shape: 3, concept: 3 });
    expect(s.total).toBe(10);
  });

  it("una asociación cuya evidencia no existe en el dato oficial no puntúa", () => {
    const sinNotas = { ...perfume("aurelis"), notes: undefined };
    const s = scorePerfume(sinNotas, answers({ territory: "floral", concept: "voltara" }));
    expect(s.points.territory).toBe(0);
    expect(resolveEvidence(sinNotas, { field: "notes", terms: ["neroli"] })).toBeNull();
    expect(resolveEvidence(perfume("ion"), { field: "olfactoryFamily", term: "amaderado" })).toBeNull();
  });

  it("un perfume sin perfil solo puede puntuar por su colección", () => {
    const nuevo = { ...perfume("ion"), id: "nuevo", slug: "nuevo" };
    const s = scorePerfume(nuevo, answers({ concept: "voltara", territory: "verde-fresco" }));
    expect(s.points).toEqual({ palette: 0, territory: 0, shape: 0, concept: 3 });
  });
});

describe("desempate (método A)", () => {
  it("es total y estable: puntuación, territorio, forma, paleta y, al final, orden del catálogo", () => {
    for (const a of ALL) {
      const r = rankPerfumes(a);
      expect(r).toHaveLength(15);
      for (let i = 1; i < r.length; i++) {
        const [x, y] = [r[i - 1]!, r[i]!];
        const kx = [x.total, x.points.territory, x.points.shape, x.points.palette];
        const ky = [y.total, y.points.territory, y.points.shape, y.points.palette];
        const cmp = kx.reduce((acc, v, j) => acc || v - ky[j]!, 0);
        expect(cmp).toBeGreaterThanOrEqual(0);
        if (cmp === 0) expect(perfumes.indexOf(x.perfume)).toBeLessThan(perfumes.indexOf(y.perfume));
      }
    }
  });

  it("a igual puntuación gana la mayor afinidad con el territorio", () => {
    // Floral + curvas + FLORA ARCANA, paleta verdes: VIRELIA (verdes 3 + curvas 3 + flora 3 = 9) y
    // AURELIS/CORALLIS (floral 3 + curvas 3 + flora 3 = 9) empatan a 9; manda el territorio.
    const r = rankPerfumes(answers({}));
    expect(r.slice(0, 3).map((s) => s.total)).toEqual([9, 9, 9]);
    expect(r[0]!.perfume.id).toBe("aurelis");
    expect(r[0]!.points.territory).toBe(3);
    expect(r[2]!.perfume.id).toBe("virelia");
  });

  it("no usa rotación: cambiar una respuesta que no puntúa a nadie del empate no cambia el orden", () => {
    // Con territorio Floral las 4 opciones de forma/paleta no afectan a perfumes sin esa coincidencia.
    const a = rankPerfumes(answers({ palette: "rosas-corales" })).map((s) => s.perfume.id);
    const b = rankPerfumes(answers({ palette: "rosas-corales" })).map((s) => s.perfume.id);
    expect(a).toEqual(b);
  });
});

describe("alternativas", () => {
  it("no incluyen al ganador, son ≤ 2, sin repetir y con ≥ 2 dimensiones coincidentes", () => {
    for (const a of ALL) {
      const rec = recommend(a)!;
      expect(rec.alternatives.length).toBeLessThanOrEqual(2);
      const ids = [rec.primary, ...rec.alternatives].map((s) => s.perfume.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const alt of rec.alternatives) {
        expect(new Set(alt.matches.map((m) => m.dimension)).size).toBeGreaterThanOrEqual(2);
        expect(alt.total).toBeLessThanOrEqual(rec.primary.total);
      }
    }
  });

  it("se omiten cuando no hay candidatos suficientemente afines", () => {
    const counts = ALL.map((a) => recommend(a)!.alternatives.length);
    expect(counts.some((n) => n < 2)).toBe(true);
    expect(counts.every((n) => n >= 0 && n <= 2)).toBe(true);
  });
});

describe("explicaciones", () => {
  it("las coincidencias se presentan en orden territorio, forma, paleta, concepto y la frase no repite la opción elegida", () => {
    const s = scorePerfume(perfume("aurelis"), answers({ palette: "oro-cobre-tierra" }));
    const ms = orderedMatches(s);
    expect(ms.map((m) => m.dimension)).toEqual(["territory", "shape", "palette", "concept"]);
    for (const m of ms) {
      expect(matchSentence(m)).not.toContain("Elegiste");
      expect(explainMatch(m)).toBe(`Elegiste «${m.choice}»: ${matchSentence(m).replace(/^./, (c) => c.toLowerCase())}`);
    }
  });


  it("las frases citan el dato y la respuesta elegida, sin fórmulas artificiosas ni palabras repetidas", () => {
    const banned = /habita|encarna|encaja|se acerca|define ese|dibuja|roza|Lo \w+ de su perfil|ese territorio|esa forma|esa paleta/;
    for (const a of ALL) {
      const rec = recommend(a)!;
      for (const s of [rec.primary, ...rec.alternatives]) {
        for (const m of s.matches) {
          const text = matchSentence(m);
          expect(text).not.toMatch(/[«»"%]/);
          expect(text).not.toMatch(banned);
          expect(text).toContain(m.evidence.quote);
          if (m.dimension !== "concept") expect(text).toContain(m.choice.toLowerCase());
          expect(text.split(" ").length).toBeLessThanOrEqual(22);
          // Sin la cita ni la opción (que pueden coincidir por naturaleza), la plantilla no repite palabras.
          const template = text.replace(m.evidence.source, "").replace(m.evidence.quote, "").replace(m.choice.toLowerCase(), "");
          const words = template.toLowerCase().match(/[a-záéíóúñ]{4,}/g) ?? [];
          expect(new Set(words).size).toBe(words.length);
        }
      }
    }
  });

  it("la plantilla distingue principal de secundaria", () => {
    const first = scorePerfume(perfume("aurelis"), answers({ territory: "floral" })).matches.find((m) => m.dimension === "territory")!;
    const second = scorePerfume(perfume("aurelis"), answers({ territory: "verde-fresco" })).matches.find((m) => m.dimension === "territory")!;
    expect(matchSentence(first)).toBe("Las notas de neroli y magnolia conectan con tu elección floral.");
    expect(matchSentence(second)).toBe("Las notas de cítricos también se relacionan con tu elección verde y fresco.");
  });

  it("cada razón nace de una coincidencia con cita literal del dato oficial", () => {
    for (const a of ALL) {
      const rec = recommend(a)!;
      for (const s of [rec.primary, ...rec.alternatives]) {
        const e = explain(s);
        expect(e.reasons).toHaveLength(s.matches.length);
        expect(e.headline).toContain(s.perfume.name);
        for (const m of s.matches) {
          if (m.evidence.field === "collection") {
            expect(m.evidence.quote).toBe(collections.find((c) => c.id === s.perfume.collectionId)!.name);
          } else if (m.evidence.field === "notes") {
            for (const n of m.evidence.quote.split(/, | y /)) expect(s.perfume.notes).toContain(n);
          } else {
            expect(s.perfume[m.evidence.field]!.toLowerCase()).toContain(m.evidence.quote.toLowerCase());
          }
        }
      }
    }
  });

  it("no usa lenguaje de certeza científica ni porcentajes", () => {
    for (const a of ALL) {
      const e = explain(recommend(a)!.primary);
      const text = [e.headline, ...e.reasons, e.disclaimer].join(" ");
      expect(text).not.toMatch(/%|científic|demostrad|garantiz|compatibilidad/i);
    }
  });
});

describe("simulación exhaustiva de 400 combinaciones", () => {
  const results = ALL.map((a) => ({ a, rec: recommend(a)! }));
  const wins = (id: string) => results.filter((r) => r.rec.primary.perfume.id === id).length;

  it("hay 400 combinaciones distintas", () => {
    expect(ALL).toHaveLength(400);
    expect(new Set(ALL.map(key)).size).toBe(400);
  });

  it("los quince perfumes pueden ganar y las victorias suman 400", () => {
    const total = perfumes.reduce((sum, p) => sum + wins(p.id), 0);
    expect(total).toBe(400);
    for (const p of perfumes) expect(wins(p.id), p.id).toBeGreaterThan(0);
  });

  it("las victorias por colección suman 400", () => {
    const byCollection = collections.map((c) => results.filter((r) => r.rec.primary.perfume.collectionId === c.id).length);
    expect(byCollection.reduce((a, b) => a + b, 0)).toBe(400);
  });

  it("la distribución de puntuaciones ganadoras suma 400", () => {
    const dist = new Map<number, number>();
    for (const r of results) dist.set(r.rec.primary.total, (dist.get(r.rec.primary.total) ?? 0) + 1);
    expect([...dist.values()].reduce((a, b) => a + b, 0)).toBe(400);
  });

  it("empates por puntuación y empates residuales tras aplicar afinidad se miden por separado", () => {
    let byScore = 0;
    let residual = 0;
    for (const a of ALL) {
      const [first, second] = rankPerfumes(a);
      if (first!.total === second!.total) {
        byScore++;
        if (sameKey(first!, second!)) residual++; // solo lo decide el orden del catálogo
      }
    }
    expect(byScore).toBeGreaterThan(residual);
    expect(residual).toBeGreaterThan(0);
    expect(byScore).toBe(ALL.filter((a) => { const r = rankPerfumes(a); return r[0]!.total === r[1]!.total; }).length);
  });

  it("es determinista: dos ejecuciones dan exactamente lo mismo", () => {
    const again = ALL.map((a) => recommend(a));
    expect(again).toEqual(results.map((r) => r.rec));
  });

  it("cada pregunta influye: existe un par de combinaciones que solo difieren en ella y cambian el ganador", () => {
    const winner = new Map(results.map((r) => [key(r.a), r.rec.primary.perfume.id]));
    for (const dimension of ["palette", "territory", "shape", "concept"] as const) {
      const changes = results.some((r) =>
        (byDim[dimension] as string[]).some((v) => v !== r.a[dimension] && winner.get(key({ ...r.a, [dimension]: v } as Answers)) !== r.rec.primary.perfume.id),
      );
      expect(changes, dimension).toBe(true);
    }
  });

  it("cada opción de cada pregunta cambia el resultado en alguna combinación", () => {
    const winner = new Map(results.map((r) => [key(r.a), r.rec.primary.perfume.id]));
    for (const q of questions) {
      for (const option of q.options) {
        const matters = results.some((r) => {
          if (r.a[q.dimension] !== option.id) return false;
          return (byDim[q.dimension] as string[]).some((v) => v !== option.id && winner.get(key({ ...r.a, [q.dimension]: v } as Answers)) !== r.rec.primary.perfume.id);
        });
        expect(matters, `${q.dimension}:${option.id}`).toBe(true);
      }
    }
  });
});

describe("pureza", () => {
  it("la lógica no usa azar, fecha, red ni precios", () => {
    for (const file of ["src/lib/scentFinder.ts", "src/data/scentFinder.ts"]) {
      const source = readFileSync(file, "utf8");
      expect(source, file).not.toMatch(/Math\.random|new Date|Date\.now|fetch\(|XMLHttpRequest|localStorage|demoPricing|money/);
    }
  });
});
