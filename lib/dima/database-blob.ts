import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { createSnapshotStore, SnapshotConflict, type SnapshotDriver } from "./database-snapshot.ts";
import { getReviewedAnalysis, REVIEWED_WORDS } from "./corpus.ts";

export function createBlobStore(env: Record<string, string | undefined>) {
  const path = "dima/v1/base.json";
  const auth = env.BLOB_STORE_ID && env.VERCEL_OIDC_TOKEN
    ? { storeId: env.BLOB_STORE_ID, oidcToken: env.VERCEL_OIDC_TOKEN }
    : { token: env.BLOB_READ_WRITE_TOKEN };
  const driver: SnapshotDriver = {
    async read() {
      const result = await get(path, { ...auth, access: "private", useCache: false });
      if (!result) return undefined;
      if (result.statusCode !== 200) throw new Error("No pudimos leer la base.");
      return { value: await new Response(result.stream).json(), etag: result.blob.etag };
    },
    async write(value, etag) {
      try {
        await put(path, JSON.stringify(value), { ...auth, access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: Boolean(etag), ...(etag ? { ifMatch: etag } : {}) });
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError || (!etag && error instanceof Error && /already exists/i.test(error.message))) throw new SnapshotConflict();
        throw error;
      }
    },
  };
  return createSnapshotStore(driver, REVIEWED_WORDS.map((word) => getReviewedAnalysis(word)!));
}
