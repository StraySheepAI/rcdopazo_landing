import { adaptRow, parseCsv } from "./adapter.ts";
import { BOOK_WORDS } from "./catalog.ts";
import { getReviewedAnalysis, REVIEWED_WORDS } from "./corpus.ts";
import { DIMA_SYSTEM, generationInput, parseGeneration } from "./prompt.ts";
import { cleanText, hasText, normalize } from "./schema.ts";
import { readDimaAccess } from "./access.ts";
import { dimaProvider } from "./provider.ts";
import { createDimaStore, DIMA_PROMPT_VERSION, type DimaStore } from "./database.ts";
import type { DimaResult } from "./schema.ts";

const PUBLIC_SHEET = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT3ENMxScg8YKXXTyIIYwkxF7Hh2VHP8f3Rlo8VSsigr420Q_alu8cU2Ft5j3vyyqEib3mlb9tvZ4Lt/pub?gid=1680193813&single=true&output=csv";
const AIRTABLE_URL = "https://api.airtable.com/v0/app8LodC87ProKbQp/tblg4NxTxNfoZGTxS";
type Dependencies = { fetch: typeof fetch; env: Record<string, string | undefined>; store?: DimaStore | Promise<DimaStore> };
class DimaError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
const formulaString = (value: string) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

export function createDimaHandlers(deps: Dependencies) {
  let store: Promise<DimaStore> | undefined;
  async function requireStore() {
    try {
      const value = await (store ||= Promise.resolve(deps.store || createDimaStore(deps.env)));
      await value.initialize();
      return value;
    } catch { store = undefined; throw new DimaError("La base de DIMA no está disponible. La consulta de Plus necesita poder guardar su lectura. Intentá nuevamente.", 503); }
  }
  async function publicRows() {
    const response = await deps.fetch(PUBLIC_SHEET, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Planilla no disponible.");
    return parseCsv(await response.text());
  }
  return {
    async GET(request?: Request) {
      if (request && new URL(request.url).searchParams.get("nivel") === "plus") {
        if (readDimaAccess(request, deps.env) !== "plus") return json({ error: "Ingresá tu clave de DIMA Plus para abrir su base." }, 401);
        try {
          const storage = await requireStore();
          const stored = (await storage.exportReadings()).filter((entry) => entry.estado !== "descartada").map((entry) => entry.palabra);
          const words = [...REVIEWED_WORDS, ...(dimaProvider(deps.env) ? BOOK_WORDS : []), ...stored];
          const unique = new Map(words.map((word) => [word.normalize("NFC").toLocaleLowerCase("es"), word]));
          return json({ palabras: [...unique.values()].sort((a, b) => a.localeCompare(b, "es")) });
        } catch { return json({ error: "No pudimos abrir la base de DIMA Plus. Intentá nuevamente." }, 503); }
      }
      if (request && new URL(request.url).searchParams.get("nivel") === "libro") {
        if (readDimaAccess(request, deps.env) !== "libro") return json({ error: "Ingresá la clave de ¡Qué embole! para abrir la colección." }, 401);
        const connected = Boolean(dimaProvider(deps.env));
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
        if (typeof nivel !== "string" || !["free", "metalquimico", "libro", "plus", "vip"].includes(nivel)) throw new DimaError("Elegí una modalidad válida de DIMA.", 400);
        if (typeof contextInput !== "string" || contextInput.length > 1000) throw new DimaError("El contexto debe tener hasta 1000 caracteres.", 400);
        if (nivel !== "free") {
          const required = nivel === "libro" ? "libro" : "plus";
          if (readDimaAccess(request, deps.env) !== required) throw new DimaError(required === "libro" ? "Ingresá la clave de ¡Qué embole! para abrir la colección." : "Ingresá tu clave de DIMA Plus para consultar una palabra libre.", 401);
        }
        if (nivel === "libro" && !BOOK_WORDS.some((word) => normalize(word) === normalize(palabra))) throw new DimaError("Esta forma pertenece a otra colección de DIMA.", 404);
        const storage = nivel !== "free" ? await requireStore() : undefined;
        const provider = dimaProvider(deps.env);
        const model = provider?.model || deps.env.DIMA_GATEWAY_MODEL || deps.env.DIMA_MODEL || "claude-haiku-4-5-20251001";
        const context = cleanText(contextInput);
        async function deliver(result: DimaResult, usedModel?: string) {
          if (!storage) return json(result);
          try {
            const saved = await storage.save(result, { contexto: context, modelo: usedModel, versionPrompt: DIMA_PROMPT_VERSION });
            return json({ ...result, registro: { id: saved.id, estado: saved.estado, guardado: true } });
          } catch { throw new DimaError("No pudimos guardar la lectura en la base. No la marcamos como guardada. Intentá nuevamente.", 503); }
        }
        const reviewed = getReviewedAnalysis(palabra);
        if (reviewed) return await deliver(reviewed);
        if (nivel === "free") {
          throw new DimaError("Esta palabra todavía no tiene una ficha completa en la selección pública. Elegí una de las palabras disponibles.", 404);
        }
        if (storage) {
          let previous;
          try { previous = await storage.find(palabra, context, model); }
          catch { throw new DimaError("No pudimos consultar la base de DIMA. Intentá nuevamente.", 503); }
          if (previous) return await deliver(previous.resultado, previous.modelo || model);
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
            reference = archived;
          }
        }
        if (!provider) {
          throw new DimaError("Todavía no hay un análisis completo de esta palabra en esta versión. Podés consultar cualquiera de las palabras de la selección pública.", 503);
        }
        const response = await deps.fetch(provider.url, {
          method: "POST", headers: { "Content-Type": "application/json", ...provider.headers },
          body: JSON.stringify({
            model, max_tokens: 6000,
            system: DIMA_SYSTEM,
            messages: [{ role: "user", content: generationInput(palabra, cleanText(contextInput), reference) }],
          }), signal: AbortSignal.timeout(65000),
        });
        if (!response.ok) throw new DimaError(response.status === 402 ? "El motor de DIMA necesita saldo para generar nuevas lecturas. Las fichas ya guardadas siguen disponibles." : "La lectura asistida no está disponible. Intentá nuevamente.", response.status === 402 ? 503 : 502);
        const data = await response.json();
        const text = Array.isArray(data.content) ? data.content.filter((block: { type?: string }) => block.type === "text").map((block: { text?: string }) => block.text || "").join("") : "";
        if (text.length > 80000) throw new DimaError("DIMA devolvió una lectura demasiado extensa.", 502);
        let result;
        try { result = parseGeneration(text, data.stop_reason, palabra, reference); }
        catch { throw new DimaError("La lectura llegó incompleta o con un formato inesperado. Intentá nuevamente.", 502); }
        return await deliver(result, model);
      } catch (error) {
        if (error instanceof DimaError) return json({ error: error.message }, error.status);
        return json({ error: "No pudimos completar la lectura de DIMA. Intentá nuevamente." }, 502);
      }
    },
  };
}
