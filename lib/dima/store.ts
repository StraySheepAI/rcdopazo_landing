import { createDimaStore } from "./database.ts";

let store: ReturnType<typeof createDimaStore> | undefined;
export function getDimaStore() {
  return store ||= createDimaStore(process.env).catch((error) => { store = undefined; throw error; });
}
