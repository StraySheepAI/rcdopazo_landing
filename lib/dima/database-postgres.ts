import { neon } from "@neondatabase/serverless";
import type { SqlDriver } from "./database.ts";

export function createPostgresDriver(connection: string): SqlDriver {
  const sql = neon(connection);
  return {
    query: async (statement, params = []) => sql.query(statement, params),
    transaction: async (statements) => sql.transaction(statements.map(({ sql: statement, params = [] }) => sql.query(statement, params))),
    close: () => undefined,
  };
}
