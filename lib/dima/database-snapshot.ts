import { createHash, randomUUID } from "node:crypto";
import { readResult, type DimaResult } from "./schema.ts";
import { DIMA_PROMPT_VERSION, type DimaStore, type SaveReading, type StoredReading, type ReadingSummary } from "./database.ts";

type Snapshot = { version: 1; entradas: StoredReading[]; consultas: { id: string; lectura: string; fecha: string }[] };
export type SnapshotDriver = {
  read: () => Promise<{ value: unknown; etag: string } | undefined>;
  write: (value: Snapshot, etag?: string) => Promise<void>;
};
export class SnapshotConflict extends Error {}
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const wordKey = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("es").replace(/\s+/g, " ");
function entryFor(value: DimaResult, options: SaveReading = {}): StoredReading {
  const resultado = readResult(value);
  if (!resultado.inside?.linguistica) throw new Error("La lectura necesita morfología antes de archivarse.");
  const contexto = (options.contexto || "").trim();
  if (contexto.length > 1000) throw new Error("Contexto demasiado largo.");
  const modelo = options.modelo || null;
  const versionPrompt = options.versionPrompt || DIMA_PROMPT_VERSION;
  const id = hash(JSON.stringify([wordKey(resultado.palabra), contexto, JSON.stringify(resultado), modelo, versionPrompt]));
  const now = new Date().toISOString();
  return { id, palabra: resultado.palabra, contexto, resultado, estado: options.seleccion ? "seleccion" : "pendiente", origen: resultado.origen, modelo, versionPrompt, creada: now, actualizada: now, consultas: 0 };
}
function decode(value: unknown): Snapshot {
  if (!value || typeof value !== "object") throw new Error("Archivo DIMA inválido.");
  const data = value as Snapshot;
  if (data.version !== 1 || !Array.isArray(data.entradas) || !Array.isArray(data.consultas)) throw new Error("Archivo DIMA inválido.");
  for (const entry of data.entradas) {
    if (!/^[a-f0-9]{64}$/.test(entry.id) || !["seleccion", "pendiente", "revisada", "descartada"].includes(entry.estado) || typeof entry.contexto !== "string" || typeof entry.versionPrompt !== "string") throw new Error("Ficha DIMA inválida.");
    entry.resultado = readResult(entry.resultado);
  }
  if (data.consultas.some((event) => !event || typeof event.id !== "string" || !data.entradas.some((entry) => entry.id === event.lectura) || typeof event.fecha !== "string")) throw new Error("Registro DIMA inválido.");
  return data;
}

// A private JSON archive for the initial hosted corpus. A single conditional
// write commits reading + consultation together. ETag conflicts retry from a
// fresh snapshot; no process-local lock or unconditional overwrite is used.
export function createSnapshotStore(driver: SnapshotDriver, seed: DimaResult[] = []): DimaStore {
  let ready: Promise<void> | undefined;
  const empty = (): Snapshot => ({ version: 1, entradas: seed.map((entry) => entryFor(entry, { seleccion: true, consulta: false })), consultas: [] });
  async function mutate<T>(update: (snapshot: Snapshot) => T): Promise<T> {
    for (let attempt = 0; attempt < 12; attempt++) {
      const previous = await driver.read();
      const state = previous ? decode(previous.value) : empty();
      const result = update(state);
      try { await driver.write(state, previous?.etag); return result; }
      catch (error) { if (!(error instanceof SnapshotConflict)) throw error; }
    }
    throw new Error("La base recibió consultas simultáneas. Intentá nuevamente.");
  }
  const initialize = () => ready ||= (async () => {
    const previous = await driver.read();
    if (previous) { decode(previous.value); return; }
    await mutate(() => undefined);
  })().catch((error) => { ready = undefined; throw error; });
  async function all() {
    await initialize();
    const state = await driver.read();
    if (!state) throw new Error("La base no está disponible.");
    return decode(state.value);
  }
  return {
    initialize,
    async save(value, options = {}) {
      await initialize();
      const candidate = entryFor(value, options);
      return mutate((state) => {
        let entry = state.entradas.find((row) => row.id === candidate.id);
        if (entry?.estado === "descartada") throw new Error("Esta versión ya se descartó; hace falta otra lectura.");
        if (!entry) { entry = structuredClone(candidate); state.entradas.push(entry); }
        entry.actualizada = new Date().toISOString();
        if (options.consulta !== false) {
          state.consultas.push({ id: randomUUID(), lectura: entry.id, fecha: entry.actualizada });
          entry.consultas += 1;
        }
        return structuredClone(entry);
      });
    },
    async get(id) { return (await all()).entradas.find((entry) => entry.id === id); },
    async find(word, context, model) {
      return (await all()).entradas.filter((entry) => wordKey(entry.palabra) === wordKey(word) && entry.contexto === context.trim() && entry.modelo === model && entry.versionPrompt === DIMA_PROMPT_VERSION && ["pendiente", "revisada"].includes(entry.estado)).sort((a, b) => b.actualizada.localeCompare(a.actualizada) || b.id.localeCompare(a.id))[0];
    },
    async list(offset = 0, limit = 50) {
      const entries = (await all()).entradas.sort((a, b) => b.actualizada.localeCompare(a.actualizada) || b.id.localeCompare(a.id));
      return { total: entries.length, entradas: entries.slice(Math.max(0, offset), Math.max(0, offset) + Math.min(Math.max(limit, 1), 100)).map((entry): ReadingSummary => {
        const { resultado: _result, contexto: _context, ...summary } = entry; return summary;
      }) };
    },
    async exportReadings() { return (await all()).entradas.sort((a, b) => a.creada.localeCompare(b.creada) || a.id.localeCompare(b.id)); },
    async review(id, status) {
      if (!["pendiente", "revisada", "descartada"].includes(status)) throw new Error("Estado inválido.");
      await initialize();
      return mutate((state) => {
        const entry = state.entradas.find((entry) => entry.id === id);
        if (entry && entry.estado !== "seleccion") { entry.estado = status; entry.actualizada = new Date().toISOString(); }
        return entry ? structuredClone(entry) : undefined;
      });
    },
    close() {},
  };
}
