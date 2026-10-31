import { cleanText, hasText } from "./text.ts";

export type InsideDima = {
  variantes: string;
  apertura: string;
  raiz: string;
  morfologia: { nota: string; movimientos: { nombre: string; pregunta: string }[] };
  lectura: string[];
  fraseTransmutada: string;
  dictum: string[];
  insight: string;
  activacion: string;
  cierre: string;
};

export const DIMA_SIGNATURE = "El lenguaje revela el hechizo, pero también puede ser la llave que lo disuelve.";

export function readInside(value: unknown): InsideDima {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Falta la consulta INSIDE DIMA.");
  const v = value as Record<string, unknown>;
  const text = (item: unknown, optional = false) => {
    if ((typeof item !== "string") || (!optional && !hasText(item)) || item.length > 8000) throw new Error("La consulta INSIDE DIMA está incompleta.");
    return cleanText(item);
  };
  const list = (item: unknown, min: number, max: number) => {
    if (!Array.isArray(item) || item.length < min || item.length > max) throw new Error("La consulta INSIDE DIMA está incompleta.");
    return item.map((part) => text(part));
  };
  const morphology = v.morfologia as { nota?: unknown; movimientos?: unknown } | undefined;
  if (!morphology || !Array.isArray(morphology.movimientos) || morphology.movimientos.length < 2 || morphology.movimientos.length > 5) throw new Error("Faltan los movimientos de la morfología mágica.");
  return {
    variantes: text(v.variantes, true), apertura: text(v.apertura), raiz: text(v.raiz),
    morfologia: { nota: text(morphology.nota), movimientos: morphology.movimientos.map((movement: unknown) => {
      if (!movement || typeof movement !== "object") throw new Error("Movimiento DIMA inválido.");
      const row = movement as Record<string, unknown>;
      return { nombre: text(row.nombre), pregunta: text(row.pregunta) };
    }) },
    lectura: list(v.lectura, 2, 5), fraseTransmutada: text(v.fraseTransmutada), dictum: list(v.dictum, 1, 4),
    insight: text(v.insight), activacion: text(v.activacion), cierre: text(v.cierre),
  };
}

