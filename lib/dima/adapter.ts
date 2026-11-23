import { DIMA_STEPS, cleanText, hasText, pendingSection, readResult, type DimaResult, type StepId } from "./schema.ts";

// Explicit new fields only. Gradus/Natura Vibrationis are not Prime/configuration fields.
const columns: Record<StepId, string[]> = {
  morfologia: ["Morfologia_Etimologia", "Morfología y etimología"],
  pulsus: ["Pulsus_DIMA", "Pulsus DIMA"],
  configuracion: ["Configuracion_Operacion", "Configuración y operación"],
  distinciones: ["Distinciones_DIMA", "Distinciones DIMA"],
  nodus: ["Nodus_DIMA", "Nodus DIMA"],
  transmutacion: ["Transmutacion_DIMA", "Transmutación DIMA"],
  definicion: ["Definicion_DIMA", "Definición DIMA"],
  sintesis: ["Frase_Sintesis", "Frase síntesis"],
};
const legacyColumns = [
  ["Indicia Obscura", "Indicia_Obscura"], ["Radix Aucta", "Radix_Aucta"],
  ["Structura Verbi", "Structura_Verbi"], ["Ludum MPAe", "Ludum_MPAe"],
  ["Causa MPAe", "Causa_MPAe"], ["Ordo MPAe", "Ordo_MPAe"],
  ["Initium DIMA", "Initium_DIMA"], ["Lectio Vibrationis", "Lectio_Vibrationis"],
  ["Gradus Vibrationi", "Gradus_Vibrationi"], ["Natura Vibrationis", "Natura_Vibrationis"],
  ["ViaeVersus"], ["Dictum Mutare", "Dictum_Mutare"], ["Provocatio MPAe", "Provocatio_MPAe"],
  ["Fractale Resonans", "Sussurro_MPAe"], ["Activatio Verbi", "Activatio_Verbi"],
  ["Frase transmutada (usando alguna alternativa)", "Cierre"],
];

export function adaptRow(row: Record<string, unknown>, palabra: string, origen: "planilla" | "base"): DimaResult {
  const pick = (names: string[]) => names.map((name) => cleanText(row[name])).find(hasText) || "";
  const analisis = Object.fromEntries(DIMA_STEPS.map(({ id }) => {
    const texto = pick(columns[id]);
    // Linguistic claims from an unreviewed row are never promoted to documented evidence.
    return [id, texto ? { texto, estado: id === "morfologia" ? "pendiente" : "interpretacion", fuentes: [] } : pendingSection()];
  }));
  return readResult({
    version: 2, palabra: cleanText(row.Forma) || palabra, origen, analisis, fuentes: [],
    archivo: legacyColumns.flatMap((names) => {
      const texto = pick(names);
      return texto ? [{ etiqueta: names[0], texto }] : [];
    }),
  });
}

export function parseCsv(csv: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    if (char === '"') {
      if (quoted && csv[index + 1] === '"') { field += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field); field = "";
      if (row.some(hasText)) rows.push(row);
      row = [];
    } else field += char;
  }
  if (quoted) throw new Error("La planilla contiene una celda sin cerrar.");
  if (field || row.length) { row.push(field); rows.push(row); }
  const headers = rows.shift()?.map(cleanText) || [];
  if (!headers.includes("Forma")) throw new Error("La planilla no contiene la columna Forma.");
  return rows.map((values) => {
    const result: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (!header) return;
      const value = cleanText(values[index]);
      // Preserve duplicate legacy columns rather than silently overwriting the first.
      if (hasText(value)) result[header] = result[header] ? `${result[header]}\n\n${value}` : value;
    });
    return result;
  });
}
