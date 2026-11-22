import {
  CONCEPT_POINTS,
  DISCLAIMER,
  POINTS,
  perfumeProfiles,
  questions,
  type Answers,
  type Dimension,
  type Evidence,
} from "@/data/scentFinder";
import { getCollections, getPerfumes } from "@/lib/catalog";
import type { Perfume } from "@/lib/types";

// The Scent Finder · lógica pura y determinista: sin precios, sin azar, sin fecha ni red.

export type Level = "primary" | "secondary" | "collection";

/** Cita concreta del dato oficial que respalda una coincidencia. */
export interface ResolvedEvidence {
  field: Evidence["field"] | "collection";
  /** Lo que se cita: fragmento, notas concretas o el valor entero. */
  quote: string;
  /** Valor completo del campo cuando `quote` es solo un fragmento. */
  source: string;
}

export interface Match {
  dimension: Dimension;
  level: Level;
  points: number;
  /** Etiqueta de la opción elegida que provoca la coincidencia. */
  choice: string;
  evidence: ResolvedEvidence;
}

export interface ScoredPerfume {
  perfume: Perfume;
  total: number;
  matches: Match[];
  /** Puntos por dimensión (0 si no coincide); base del desempate. */
  points: Record<Dimension, number>;
}

export interface Recommendation {
  primary: ScoredPerfume;
  /** Hasta dos; solo perfumes con coincidencias en al menos dos dimensiones. */
  alternatives: ScoredPerfume[];
}

export const MIN_ALTERNATIVE_DIMENSIONS = 2;
export const MAX_ALTERNATIVES = 2;

/** Valida una entrada desconocida: solo devuelve respuestas completas y existentes. */
export function parseAnswers(input: unknown): Answers | null {
  if (typeof input !== "object" || input === null) return null;
  const record = input as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const q of questions) {
    const value = record[q.dimension];
    if (typeof value !== "string" || !q.options.some((o) => o.id === value)) return null;
    out[q.dimension] = value;
  }
  return out as unknown as Answers;
}

export const optionLabel = (dimension: Dimension, id: string): string =>
  questions.find((q) => q.dimension === dimension)?.options.find((o) => o.id === id)?.label ?? id;

const joinEs = (items: string[]) =>
  items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

/** Recupera la cita del dato oficial; null si el dato falta o no contiene lo citado. */
export function resolveEvidence(perfume: Perfume, evidence: Evidence): ResolvedEvidence | null {
  if (evidence.field === "notes") {
    const notes = perfume.notes ?? [];
    if (evidence.terms.length === 0 || !evidence.terms.every((t) => notes.includes(t))) return null;
    return { field: "notes", quote: joinEs(evidence.terms), source: joinEs(notes) };
  }
  const value = perfume[evidence.field];
  if (!value) return null;
  const term = evidence.term;
  if (term && !value.toLowerCase().includes(term.toLowerCase())) return null;
  return { field: evidence.field, quote: term ?? value, source: value };
}

/** Puntúa un perfume. Una asociación sin evidencia verificable en el dato oficial no puntúa. */
export function scorePerfume(perfume: Perfume, answers: Answers): ScoredPerfume {
  const matches: Match[] = [];
  const profile = perfumeProfiles[perfume.id];
  if (profile) {
    for (const dimension of ["territory", "shape", "palette"] as const) {
      const association = profile[dimension];
      const choice = answers[dimension];
      const link = association.primary.id === choice ? association.primary : association.secondary?.id === choice ? association.secondary : undefined;
      if (!link) continue;
      const evidence = resolveEvidence(perfume, link.evidence);
      if (!evidence) continue;
      const level = link === association.primary ? "primary" : "secondary";
      matches.push({ dimension, level, points: POINTS[level], choice: optionLabel(dimension, choice), evidence });
    }
  }
  if (perfume.collectionId === answers.concept) {
    const name = getCollections().find((c) => c.id === perfume.collectionId)?.name ?? perfume.collectionId;
    matches.push({
      dimension: "concept",
      level: "collection",
      points: CONCEPT_POINTS,
      choice: optionLabel("concept", answers.concept),
      evidence: { field: "collection", quote: name, source: name },
    });
  }
  const points = { palette: 0, territory: 0, shape: 0, concept: 0 } satisfies Record<Dimension, number>;
  for (const m of matches) points[m.dimension] = m.points;
  return { perfume, total: matches.reduce((sum, m) => sum + m.points, 0), matches, points };
}

/**
 * Orden total y estable. Desempate: puntuación total, afinidad con territorio, con forma, con paleta
 * y, por último, orden del catálogo (el `sort` de Array es estable y la lista ya viene en ese orden).
 */
export function rankPerfumes(answers: Answers, list: Perfume[] = getPerfumes()): ScoredPerfume[] {
  return list
    .map((p) => scorePerfume(p, answers))
    .sort((a, b) => b.total - a.total || b.points.territory - a.points.territory || b.points.shape - a.points.shape || b.points.palette - a.points.palette);
}

export function recommend(answers: Answers, list: Perfume[] = getPerfumes()): Recommendation | null {
  const [primary, ...rest] = rankPerfumes(answers, list);
  if (!primary || primary.total === 0) return null;
  const alternatives = rest.filter((s) => s.matches.length >= MIN_ALTERNATIVE_DIMENSIONS).slice(0, MAX_ALTERNATIVES);
  return { primary, alternatives };
}

/**
 * Frase de una coincidencia, sin la opción elegida como prefijo. Una plantilla corta por tipo de evidencia y nivel:
 * cita el dato oficial tal cual (sin comillas) y lo vincula con la respuesta efectivamente elegida. La afinidad es una
 * lectura editorial, no un hecho medido.
 */
export function matchSentence(m: Match): string {
  const { quote, source, field } = m.evidence;
  const choice = m.choice.toLowerCase();
  const also = m.level === "secondary" ? "también se relaciona con" : "conecta con";
  switch (field) {
    case "notes":
      return `Las notas de ${quote} ${m.level === "secondary" ? "también se relacionan con" : "conectan con"} tu elección ${choice}.`;
    case "olfactoryFamily":
      return `Su perfil ${source} ${also} tu elección ${choice}.`;
    case "specialFeature":
      return `Su diseño de ${source} ${m.level === "secondary" ? "también se relaciona con" : "responde a"} tu preferencia por ${choice}.`;
    case "colorway":
      return `Su acabado ${source} ${also} tu paleta de ${choice}.`;
    case "collection":
      return `Forma parte de la colección ${quote}, la idea que has elegido.`;
  }
}

/** Frase completa con la opción elegida. */
export const explainMatch = (m: Match): string =>
  `Elegiste «${m.choice}»: ${matchSentence(m).replace(/^./, (c) => c.toLowerCase())}`;

const ORDER: Dimension[] = ["territory", "shape", "palette", "concept"];

export interface Explanation {
  headline: string;
  reasons: string[];
  disclaimer: string;
}

/** Coincidencias en orden de presentación: territorio, forma, paleta, concepto. */
export const orderedMatches = (scored: ScoredPerfume): Match[] =>
  ORDER.flatMap((d) => scored.matches.filter((m) => m.dimension === d));

export function explain(scored: ScoredPerfume): Explanation {
  const reasons = orderedMatches(scored).map(explainMatch);
  return {
    headline: `Te sugerimos ${scored.perfume.name} por afinidad con tus respuestas.`,
    reasons,
    disclaimer: DISCLAIMER,
  };
}
