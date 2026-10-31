import type { DimaStore } from "./database.ts";
import { sameDimaOrigin } from "./access.ts";

type Env = Record<string, string | undefined>;
const LOOPBACK = ["localhost", "127.0.0.1", "[::1]"];
export function localReviewAllowed(host: string, env: Env) {
  if (env.DIMA_LOCAL_REVIEW !== "1" || env.VERCEL) return false;
  try { return LOOPBACK.includes(new URL(`http://${host}`).hostname); } catch { return false; }
}
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "no-store" } });
export function createReviewHandlers(env: Env, getStore: () => Promise<DimaStore>) {
  const allowed = (request: Request) => localReviewAllowed(request.headers.get("host") || new URL(request.url).host, env);
  return {
    async GET(request: Request) {
      if (!allowed(request)) return json({ error: "No disponible." }, 404);
      try {
        const params = new URL(request.url).searchParams;
        const store = await getStore();
        if (params.get("exportar") === "1") return Response.json({ version: 1, exportada: new Date().toISOString(), entradas: await store.exportReadings() }, { headers: { "Cache-Control": "no-store", "Content-Disposition": 'attachment; filename="dima-base.json"' } });
        const id = params.get("id");
        if (id) {
          if (!/^[a-f0-9]{64}$/.test(id)) return json({ error: "Entrada inválida." }, 400);
          const entry = await store.get(id);
          return entry ? json(entry) : json({ error: "No encontramos esa lectura." }, 404);
        }
        const page = Number(params.get("pagina") || "0");
        if (!Number.isSafeInteger(page) || page < 0) return json({ error: "Página inválida." }, 400);
        return json(await store.list(page * 50, 50));
      } catch { return json({ error: "No pudimos abrir la base de DIMA." }, 503); }
    },
    async PATCH(request: Request) {
      if (!allowed(request)) return json({ error: "No disponible." }, 404);
      if (!sameDimaOrigin(request)) return json({ error: "Abrí la revisión desde DIMA." }, 403);
      try {
        const text = await request.text();
        if (text.length > 2048) return json({ error: "La solicitud es demasiado larga." }, 400);
        let body;
        try { body = JSON.parse(text); } catch { return json({ error: "Solicitud inválida." }, 400); }
        if (!body || typeof body.id !== "string" || !/^[a-f0-9]{64}$/.test(body.id) || !["pendiente", "revisada", "descartada"].includes(body.estado)) return json({ error: "Solicitud inválida." }, 400);
        const store = await getStore();
        const existing = await store.get(body.id);
        if (!existing) return json({ error: "No encontramos esa lectura." }, 404);
        if (existing.estado === "seleccion") return json({ error: "Las lecturas de la selección se conservan desde su archivo editorial." }, 409);
        return json(await store.review(body.id, body.estado));
      } catch { return json({ error: "No pudimos guardar la revisión." }, 503); }
    },
  };
}
