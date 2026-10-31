import { readInside, type InsideDima } from "./inside-schema.ts";
import { cleanText, hasText } from "./text.ts";
export { cleanText, hasText, normalize } from "./text.ts";

export const DIMA_STEPS = [
  { id: "morfologia", title: "Morfología y etimología", depth: 1 },
  { id: "pulsus", title: "Pulsus", depth: 1 },
  { id: "configuracion", title: "Configuración y operación", depth: 1 },
  { id: "distinciones", title: "Distinciones", depth: 2 },
  { id: "nodus", title: "Nodus · relación y agencia", depth: 2 },
  { id: "transmutacion", title: "Transmutación", depth: 3 },
  { id: "definicion", title: "Definición DIMA", depth: 3 },
  { id: "sintesis", title: "Frase síntesis", depth: 3 },
] as const;

export type StepId = (typeof DIMA_STEPS)[number]["id"];
export type Section = { texto: string; estado: "documentado" | "interpretacion" | "pendiente"; fuentes: string[] };
export type Source = { id: string; titulo: string; url: string; consulta: string };
export type DimaResult = {
  version: 2;
  palabra: string;
  origen: "planilla" | "base" | "ia" | "archivo";
  estado: "completo" | "parcial";
  analisis: Record<StepId, Section>;
  fuentes: Source[];
  archivo: { etiqueta: string; texto: string }[];
  inside?: InsideDima;
};

export function pendingSection(): Section {
  return { texto: "Pendiente de análisis y revisión. El archivo disponible no permite completar este paso.", estado: "pendiente", fuentes: [] };
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validSection(value: unknown): value is Section {
  return record(value) && hasText(value.texto) && cleanText(value.texto).length <= 8000
    && ["documentado", "interpretacion", "pendiente"].includes(String(value.estado))
    && Array.isArray(value.fuentes) && value.fuentes.length <= 10
    && value.fuentes.every((id: unknown) => typeof id === "string" && id.length <= 100);
}

export function readSections(value: unknown): Record<StepId, Section> {
  if (!record(value) || !DIMA_STEPS.every(({ id }) => validSection(value[id]))) {
    throw new Error("La respuesta no contiene los ocho pasos de DIMA completos.");
  }
  return Object.fromEntries(DIMA_STEPS.map(({ id }) => {
    const section = value[id] as Section;
    return [id, { texto: cleanText(section.texto), estado: section.estado, fuentes: [...section.fuentes] }];
  })) as Record<StepId, Section>;
}

export function readResult(value: unknown): DimaResult {
  if (!record(value) || value.version !== 2 || !hasText(value.palabra) || cleanText(value.palabra).length > 100
    || !["planilla", "base", "ia", "archivo"].includes(String(value.origen))
    || !Array.isArray(value.fuentes) || value.fuentes.length > 20
    || !Array.isArray(value.archivo) || value.archivo.length > 30) {
    throw new Error("DIMA devolvió una ficha con un formato inesperado.");
  }
  const fuentes: Source[] = value.fuentes.map((source: unknown) => {
    if (!record(source) || !hasText(source.id) || !hasText(source.titulo) || typeof source.url !== "string"
      || !/^https?:\/\//i.test(source.url) || !hasText(source.consulta)) throw new Error("Fuente DIMA inválida.");
    const url = new URL(source.url);
    if (url.username || url.password) throw new Error("Fuente DIMA inválida.");
    return { id: cleanText(source.id), titulo: cleanText(source.titulo), url: url.href, consulta: cleanText(source.consulta) };
  });
  const ids = new Set(fuentes.map((source) => source.id));
  if (ids.size !== fuentes.length) throw new Error("Fuentes DIMA duplicadas.");
  const analisis = readSections(value.analisis);
  for (const { id } of DIMA_STEPS) {
    const section = analisis[id];
    if (section.fuentes.some((source) => !ids.has(source)) || (section.estado === "documentado" && !section.fuentes.length)) {
      throw new Error("La ficha contiene una afirmación sin una fuente identificable.");
    }
  }
  const archivo = value.archivo.map((item: unknown) => {
    if (!record(item) || !hasText(item.etiqueta) || !hasText(item.texto) || cleanText(item.texto).length > 30000) {
      throw new Error("Archivo DIMA inválido.");
    }
    return { etiqueta: cleanText(item.etiqueta), texto: cleanText(item.texto) };
  });
  return {
    version: 2, palabra: cleanText(value.palabra), origen: value.origen as DimaResult["origen"],
    estado: DIMA_STEPS.every(({ id }) => analisis[id].estado !== "pendiente") ? "completo" : "parcial",
    analisis, fuentes, archivo, ...(value.inside === undefined ? {} : { inside: readInside(value.inside) }),
  };
}
