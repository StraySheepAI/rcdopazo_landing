import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export type DimaAccess = "libro" | "plus";
export const DIMA_COOKIE = "dima_access";
type Env = Record<string, string | undefined>;
const AGE = 7 * 24 * 60 * 60;
const failures = new Map<string, { count: number; until: number }>();
export const normalizeCode = (value: string) => value.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9]/g, "");
export const hashCode = (value: string) => createHash("sha256").update(normalizeCode(value)).digest("hex");
const configuredHash = (scope: DimaAccess, env: Env) => env[scope === "libro" ? "DIMA_BOOK_CODE_HASH" : "DIMA_PLUS_CODE_HASH"] || "";
const configuredSecret = (env: Env) => (env.DIMA_SESSION_SECRET || "").length >= 32 ? env.DIMA_SESSION_SECRET! : "";
const sign = (text: string, env: Env) => createHmac("sha256", configuredSecret(env)).update(text).digest("hex");
const epoch = (scope: DimaAccess, env: Env) => sign(configuredHash(scope, env), env).slice(0, 20);
const sameHex = (a: string, b: string) => /^[a-f0-9]{64}$/.test(a) && /^[a-f0-9]{64}$/.test(b) && timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));

export function readDimaAccess(request: Request, env: Env, now = Date.now()): DimaAccess | null {
  if (!configuredSecret(env)) return null;
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${DIMA_COOKIE}=`))?.slice(DIMA_COOKIE.length + 1);
  if (!cookie || cookie.length > 1024) return null;
  const [body, signature, extra] = cookie.split(".");
  if (extra || !body || !signature || !sameHex(sign(body, env), signature)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    if (data.v !== 1 || !["libro", "plus"].includes(data.scope) || !Number.isSafeInteger(data.exp) || data.exp <= now || data.exp > now + AGE * 1000 || data.epoch !== epoch(data.scope, env)) return null;
    if (!/^[a-f0-9]{64}$/.test(configuredHash(data.scope, env))) return null;
    return data.scope;
  } catch { return null; }
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return request.headers.get("sec-fetch-site") !== "cross-site" && (!origin || origin === new URL(request.url).origin);
}
function cookieAttributes(request: Request) {
  const url = new URL(request.url);
  const local = ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
  return `Path=/; HttpOnly; SameSite=Strict${url.protocol === "https:" || !local ? "; Secure" : ""}`;
}

export function createDimaAccessHandlers(env: Env, now = () => Date.now()) {
  return {
    async GET(request: Request) {
      const acceso = readDimaAccess(request, env, now());
      return json({ acceso, ...(acceso === "plus" ? { consultaLibreDisponible: Boolean(env.ANTHROPIC_API_KEY) } : {}) });
    },
    async POST(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Este acceso debe abrirse desde DIMA." }, 403);
      if (!configuredSecret(env)) return json({ error: "Los accesos con clave todavía no están configurados en esta instalación." }, 503);
      const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "local";
      const attempt = failures.get(ip);
      if (attempt && attempt.until > now() && attempt.count >= 8) return json({ error: "Hubo varios intentos seguidos. Esperá unos minutos antes de volver a probar." }, 429, { "Retry-After": "600" });
      try {
        const raw = await request.text();
        if (raw.length > 2048) return json({ error: "La clave es demasiado larga." }, 400);
        const data = JSON.parse(raw);
        if (!data || typeof data.codigo !== "string" || data.codigo.length > 120 || !normalizeCode(data.codigo)) return json({ error: "Ingresá tu clave completa." }, 400);
        const hash = hashCode(data.codigo);
        const scope = (["libro", "plus"] as const).find((candidate) => sameHex(hash, configuredHash(candidate, env)));
        if (!scope) {
          if (failures.size > 5000) failures.clear();
          const active = attempt && attempt.until > now() ? attempt : { count: 0, until: now() + 600000 };
          failures.set(ip, { count: active.count + 1, until: active.until });
          return json({ error: "No pudimos validar esta clave. Revisá que esté completa." }, 401);
        }
        failures.delete(ip);
        const body = Buffer.from(JSON.stringify({ v: 1, scope, exp: now() + AGE * 1000, nonce: randomBytes(16).toString("hex"), epoch: epoch(scope, env) })).toString("base64url");
        return json({ acceso: scope }, 200, { "Set-Cookie": `${DIMA_COOKIE}=${body}.${sign(body, env)}; Max-Age=${AGE}; ${cookieAttributes(request)}` });
      } catch { return json({ error: "No pudimos leer la clave. Intentá nuevamente." }, 400); }
    },
    async DELETE(request: Request) {
      if (!sameOrigin(request)) return json({ error: "Este acceso debe cerrarse desde DIMA." }, 403);
      return json({ acceso: null }, 200, { "Set-Cookie": `${DIMA_COOKIE}=; Max-Age=0; ${cookieAttributes(request)}` });
    },
  };
}
