import { createHash, randomUUID } from "node:crypto";
import { readResult, type DimaResult } from "./schema.ts";

export const DIMA_PROMPT_VERSION = "inside-morphology-2026-10-31";
export type ReviewState = "seleccion" | "pendiente" | "revisada" | "descartada";
export type StoredReading = {
  id: string; palabra: string; contexto: string; estado: ReviewState; origen: string;
  modelo: string | null; versionPrompt: string; creada: string; actualizada: string;
  consultas: number; resultado: DimaResult;
};
export type ReadingSummary = Omit<StoredReading, "resultado" | "contexto">;
type Statement = { sql: string; params?: (string | number | null)[] };
export type SqlDriver = {
  query: (sql: string, params?: (string | number | null)[]) => Promise<Record<string, unknown>[]>;
  transaction: (statements: Statement[]) => Promise<Record<string, unknown>[][]>;
  close: () => void;
};
export type SaveReading = { contexto?: string; modelo?: string; versionPrompt?: string; seleccion?: boolean; consulta?: boolean };
export type DimaStore = ReturnType<typeof createStore>;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
// Keep accents: sí and si must not share an arbitrary-word cache entry.
const wordKey = (value: string) => value.normalize("NFC").trim().toLocaleLowerCase("es").replace(/\s+/g, " ");

const schema = [
  `CREATE TABLE IF NOT EXISTS dima_readings (
    id TEXT PRIMARY KEY, word TEXT NOT NULL, word_key TEXT NOT NULL,
    context_text TEXT NOT NULL, context_hash TEXT NOT NULL, response_json TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('seleccion','pendiente','revisada','descartada')),
    origin TEXT NOT NULL, model TEXT, prompt_version TEXT NOT NULL,
    created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS dima_consultations (
    id TEXT PRIMARY KEY, reading_id TEXT NOT NULL REFERENCES dima_readings(id), created_at TEXT NOT NULL
  )`,
  "CREATE INDEX IF NOT EXISTS dima_readings_lookup ON dima_readings(word_key, context_hash, prompt_version, model)",
  "CREATE INDEX IF NOT EXISTS dima_consultations_reading ON dima_consultations(reading_id)",
];
const select = "SELECT r.*, (SELECT COUNT(*) FROM dima_consultations c WHERE c.reading_id=r.id) AS consultations FROM dima_readings r";

function decode(row: Record<string, unknown>): StoredReading {
  return {
    id: String(row.id), palabra: String(row.word), contexto: String(row.context_text), estado: row.status as ReviewState,
    origen: String(row.origin), modelo: row.model ? String(row.model) : null, versionPrompt: String(row.prompt_version),
    creada: String(row.created_at), actualizada: String(row.updated_at), consultas: Number(row.consultations),
    resultado: readResult(JSON.parse(String(row.response_json))),
  };
}

export function createStore(driver: SqlDriver) {
  let ready: Promise<void> | undefined;
  const initialize = () => ready ||= (async () => { for (const statement of schema) await driver.query(statement); })().catch((error) => { ready = undefined; throw error; });
  return {
    initialize,
    async save(value: DimaResult, options: SaveReading = {}) {
      await initialize();
      const result = readResult(value);
      if (!result.inside?.linguistica) throw new Error("La lectura necesita morfología antes de archivarse.");
      const context = (options.contexto || "").trim();
      if (context.length > 1000) throw new Error("Contexto demasiado largo.");
      const version = options.versionPrompt || DIMA_PROMPT_VERSION;
      const response = JSON.stringify(result);
      const id = hash(JSON.stringify([wordKey(result.palabra), context, response, options.modelo || null, version]));
      const now = new Date().toISOString();
      const statements: Statement[] = [{
        sql: `INSERT INTO dima_readings (id,word,word_key,context_text,context_hash,response_json,status,origin,model,prompt_version,created_at,updated_at)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
          ON CONFLICT(id) DO UPDATE SET updated_at=excluded.updated_at WHERE dima_readings.status <> 'descartada'`,
        params: [id, result.palabra, wordKey(result.palabra), context, hash(context), response, options.seleccion ? "seleccion" : "pendiente", result.origen, options.modelo || null, version, now, now],
      }];
      if (options.consulta !== false) statements.push({ sql: "INSERT INTO dima_consultations (id,reading_id,created_at) SELECT $1,$2,$3 FROM dima_readings WHERE id=$2 AND status <> 'descartada'", params: [randomUUID(), id, now] });
      await driver.transaction(statements);
      const saved = (await this.get(id))!;
      if (saved.estado === "descartada") throw new Error("Esta versión ya se descartó; hace falta otra lectura.");
      return saved;
    },
    async get(id: string) {
      await initialize();
      const rows = await driver.query(`${select} WHERE r.id=$1`, [id]);
      return rows[0] ? decode(rows[0]) : undefined;
    },
    async find(word: string, context: string, model: string) {
      await initialize();
      const rows = await driver.query(`${select} WHERE r.word_key=$1 AND r.context_hash=$2 AND r.prompt_version=$3 AND r.model=$4 AND r.status IN ('pendiente','revisada') ORDER BY r.updated_at DESC,r.id DESC LIMIT 1`, [wordKey(word), hash(context.trim()), DIMA_PROMPT_VERSION, model]);
      return rows[0] ? decode(rows[0]) : undefined;
    },
    async list(offset = 0, limit = 50) {
      await initialize();
      const rows = await driver.query(`${select} ORDER BY r.updated_at DESC,r.id DESC LIMIT $1 OFFSET $2`, [Math.min(Math.max(limit, 1), 100), Math.max(offset, 0)]);
      const count = await driver.query("SELECT COUNT(*) AS total FROM dima_readings");
      return { total: Number(count[0].total), entradas: rows.map((row): ReadingSummary => {
        const { resultado: _result, contexto: _context, ...summary } = decode(row);
        return summary;
      }) };
    },
    async exportReadings() {
      await initialize();
      return (await driver.query(`${select} ORDER BY r.created_at,r.id`)).map(decode);
    },
    async review(id: string, state: "pendiente" | "revisada" | "descartada") {
      await initialize();
      if (!["pendiente", "revisada", "descartada"].includes(state)) throw new Error("Estado inválido.");
      // Reviewing a draft never publishes it or alters the existing free selection.
      await driver.query("UPDATE dima_readings SET status=$1,updated_at=$2 WHERE id=$3 AND status <> 'seleccion'", [state, new Date().toISOString(), id]);
      return this.get(id);
    },
    close: driver.close,
  };
}

export async function createDimaStore(env: Record<string, string | undefined>): Promise<DimaStore> {
  if (env.DIMA_DATABASE_URL) {
    const { createPostgresDriver } = await import("./database-postgres.ts");
    return createStore(createPostgresDriver(env.DIMA_DATABASE_URL));
  }
  if (env.DIMA_STORAGE === "blob" && (env.BLOB_READ_WRITE_TOKEN || (env.BLOB_STORE_ID && env.VERCEL_OIDC_TOKEN))) {
    const { createBlobStore } = await import("./database-blob.ts");
    return createBlobStore(env);
  }
  if (env.DIMA_SQLITE_PATH && !env.VERCEL) {
    const { createSqliteDriver } = await import("./database-sqlite.ts");
    return createStore(createSqliteDriver(env.DIMA_SQLITE_PATH));
  }
  throw new Error("La base de DIMA todavía no está conectada.");
}
