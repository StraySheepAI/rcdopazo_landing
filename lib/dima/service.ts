import { adaptRow, parseCsv } from "./adapter.ts";
import { BOOK_WORDS } from "./catalog.ts";
import { getReviewedAnalysis, REVIEWED_WORDS } from "./corpus.ts";
import { DIMA_SYSTEM, generationInput, parseGeneration } from "./prompt.ts";
import { cleanText, hasText, normalize } from "./schema.ts";
import { readDimaAccess } from "./access.ts";

const PUBLIC_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT3ENMxScg8YKXXTyIIYwkxF7Hh2VHP8f3Rlo8VSsigr420Q_alu8cU2Ft5j3vyyqEib3mlb9tvZ4Lt/pub?gid=1680193813&single=true&output=csv";
const AIRTABLE_URL = "https://api.airtable.com/v0/app8LodC87ProKbQp/tblg4NxTxNfoZGTxS";
type Dependencies = { fetch: typeof fetch; env: Record<string, string | undefined> };
class DimaError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const formulaString = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export function createDimaHandlers(deps: Dependencies) {
  async function publicRows() {
    const response = await deps.fetch(PUBLIC_SHEET, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Planilla no disponible.");
    return parseCsv(await response.text());
  }
  return {
    async GET(request?: Request) {
      if (request && new URL(request.url).searchParams.get("nivel") === "libro") {
        if (readDimaAccess(request, deps.env) !== "libro") return json({ error: "Ingresá la clave de ¡Qué embole! para abrir la colección." }, 401);
        const connected = Boolean(deps.env.ANTHROPIC_API_KEY);
        return json({ palabras: connected ? BOOK_WORDS : BOOK_WORDS.filter((word) => getReviewedAnalysis(word)), ...(connected ? {} : { aviso: "Esta copia muestra las entradas de la colección que ya tienen una lectura preparada." }) });
      }
      return json({ palabras: REVIEWED_WORDS });
    },
    async POST(request: Request) {
      try {
        const raw = await request.text();
        if (raw.length > 4096) throw new DimaError("La consulta es demasiado larga.", 400);
        let body: unknown;
        try { body = JSON.parse(raw); } catch { throw new DimaError("La consulta no tiene un formato válido.", 400); }
        if (!body || typeof body !== "object" || Array.isArray(body)) throw new DimaError("La consulta no tiene un formato válido.", 400);
        const { palabra: input, nivel, contexto: contextInput = "" } = body as Record<string, unknown>;
        const palabra = cleanText(input);
        if (!hasText(palabra) || palabra.length > 100 || /[\r\n\x00-\x1f]/.test(palabra)) throw new DimaError("Ingresá una palabra o expresión de hasta 100 caracteres.", 400);
        if (!["free", "metalquimico", "libro", "plus", "vip"].includes(String(nivel))) throw new DimaError("Elegí una modalidad válida de DIMA.", 400);
        if (typeof contextInput !== "string" || contextInput.length > 1000) throw new DimaError("El contexto debe tener hasta 1000 caracteres.", 400);
        if (nivel !== "free") {
          const required = nivel === "libro" ? "libro" : "plus";
          if (readDimaAccess(request, deps.env) !== required) throw new DimaError(required === "libro" ? "Ingresá la clave de ¡Qué embole! para abrir la colección." : "Ingresá tu clave de DIMA Plus para consultar una palabra libre.", 401);
        }
        if (nivel === "libro" && !BOOK_WORDS.some((word) => normalize(word) === normalize(palabra))) throw new DimaError("Esta forma pertenece a otra colección de DIMA.", 404);
        const reviewed = getReviewedAnalysis(palabra);
        if (reviewed) return json(reviewed);
        if (nivel === "free") {
          throw new DimaError("Esta palabra todavía no tiene una ficha completa en la selección pública. Elegí una de las palabras disponibles.", 404);
        }
        // Sheets and the extended archive are independent sources.
        const rows = await publicRows().catch(() => null);
        const match = rows?.find((row) => normalize(row.Forma || "") === normalize(palabra));
        let reference = match ? adaptRow(match, palabra, "planilla") : undefined;
        const airtableToken = deps.env.AIRTABLE_TOKEN;
        if (airtableToken) {
          const compact = palabra.toLowerCase().replace(/\s/g, "");
          const normalized = normalize(palabra).replace(/\s/g, "");
          const column = 'LOWER(SUBSTITUTE({Forma}," ",""))';
          const formula = `OR(${column}=${formulaString(compact)},${column}=${formulaString(normalized)})`;
          const response = await deps.fetch(`${AIRTABLE_URL}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`, {
            headers: { Authorization: `Bearer ${airtableToken}` }, cache: "no-store", signal: AbortSignal.timeout(10000),
          });
          if (!response.ok) throw new DimaError("No pudimos consultar el archivo ampliado. Intentá nuevamente.", 502);
          const data = await response.json();
          const fields = data.records?.[0]?.fields;
          if (fields && typeof fields === "object" && !Array.isArray(fields)) {
            if (normalize(cleanText(fields.Forma)).replace(/\s/g, "") !== normalized) throw new DimaError("La ficha encontrada no corresponde a la consulta.", 502);
            const archived = adaptRow(fields, palabra, "base");
            if (archived.estado === "completo") return json(archived);
            reference = archived;
          }
        }
        const key = deps.env.ANTHROPIC_API_KEY;
        if (!key) {
          throw new DimaError("Todavía no hay un análisis completo de esta palabra en esta versión. Podés consultar cualquiera de las palabras de la selección pública.", 503);
        }
        const response = await deps.fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: deps.env.DIMA_MODEL || "claude-haiku-4-5-20251001", max_tokens: 2800,
            system: DIMA_SYSTEM,
            messages: [{ role: "user", content: generationInput(palabra, cleanText(contextInput), reference) }],
          }), signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw new DimaError("La lectura asistida no está disponible. Intentá nuevamente.", 502);
        const data = await response.json();
        const text = Array.isArray(data.content) ? data.content.filter((block: { type?: string }) => block.type === "text").map((block: { text?: string }) => block.text || "").join("") : "";
        if (text.length > 80000) throw new DimaError("DIMA devolvió una lectura demasiado extensa.", 502);
        try { return json(parseGeneration(text, data.stop_reason, palabra, reference)); }
        catch { throw new DimaError("La lectura llegó incompleta o con un formato inesperado. Intentá nuevamente.", 502); }
      } catch (error) {
        if (error instanceof DimaError) return json({ error: error.message }, error.status);
        return json({ error: "No pudimos completar la lectura de DIMA. Intentá nuevamente." }, 502);
      }
    },
  };
}
