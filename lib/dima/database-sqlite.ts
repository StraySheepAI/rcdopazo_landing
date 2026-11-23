import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { SqlDriver } from "./database.ts";

export function createSqliteDriver(filename: string): SqlDriver {
  const path = filename === ":memory:" ? filename : resolve(filename);
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const database = new DatabaseSync(path);
  if (path !== ":memory:") chmodSync(path, 0o600);
  database.exec("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
  function execute(sql: string, params: (string | number | null)[] = []) {
    const values: (string | number | null)[] = [];
    const positional = sql.replace(/\$(\d+)/g, (_, index) => { values.push(params[Number(index) - 1]); return "?"; });
    return database.prepare(positional).all(...values) as Record<string, unknown>[];
  }
  return {
    query: async (sql, params) => execute(sql, params),
    transaction: async (statements) => {
      database.exec("BEGIN IMMEDIATE");
      try {
        const rows = statements.map(({ sql, params }) => execute(sql, params));
        database.exec("COMMIT");
        return rows;
      } catch (error) { database.exec("ROLLBACK"); throw error; }
    },
    close: () => database.close(),
  };
}
