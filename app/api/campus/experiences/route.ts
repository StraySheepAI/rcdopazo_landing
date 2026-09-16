import { get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { readCampusRole } from "@/lib/campus-auth";
import { blankCampusExperience, type CampusAccessMode, type CampusExperienceKind } from "@/lib/campus-content";

export const runtime = "nodejs";

type ExperienceSummary = { slug: string; name: string; kind: CampusExperienceKind; access: CampusAccessMode; status: "draft" | "published"; path: string; managed: boolean };
const INDEX_PATH = "campus/experiences/index.json";
const BUILT_INS: ExperienceSummary[] = [
  { slug: "principios-universales", name: "Principios Universales", kind: "workshop", access: "key", status: "published", path: "/mpa/transmuta/pulsus-fractum/agora/principios-universales", managed: true },
  { slug: "fundamentos-1", name: "Fundamentos I", kind: "course", access: "key", status: "published", path: "/mpa/transmuta/pulsus-fractum/fundamentos/clase-1", managed: false },
  { slug: "logica-1", name: "Lógica Simbólica I", kind: "course", access: "key", status: "published", path: "/mpa/transmuta/pulsus-fractum/logica/clase-1", managed: false },
];

async function readCreated(): Promise<ExperienceSummary[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const result = await get(INDEX_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return [];
    const value = await new Response(result.stream).json();
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

async function writeCreated(items: ExperienceSummary[]) {
  await put(INDEX_PATH, JSON.stringify(items), { access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
}

export async function GET(request: NextRequest) {
  const created = await readCreated();
  if (request.nextUrl.searchParams.get("public") === "1") return NextResponse.json({ experiences: [...BUILT_INS, ...created].filter(item => item.status === "published") });
  if (!readCampusRole(request)) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  return NextResponse.json({ experiences: [...BUILT_INS, ...created], storageReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

export async function POST(request: NextRequest) {
  const role = readCampusRole(request);
  if (role !== "architect") return NextResponse.json({ error: "Crear experiencias requiere acceso de Arquitecta." }, { status: 403 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "El almacenamiento del Campus todavía no está conectado." }, { status: 503 });
  const body = await request.json() as { name?: string; slug?: string; kind?: CampusExperienceKind; access?: CampusAccessMode };
  const name = body.name?.trim();
  const slug = body.slug?.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const kind = body.kind || "course";
  const access = body.access || "key";
  if (!name || !slug) return NextResponse.json({ error: "Completá el nombre y la dirección de la experiencia." }, { status: 400 });
  const created = await readCreated();
  if ([...BUILT_INS, ...created].some(item => item.slug === slug)) return NextResponse.json({ error: "Ya existe una experiencia con esa dirección." }, { status: 409 });
  const experience = blankCampusExperience(slug, name, kind, access);
  await put(`campus/${slug}/draft.json`, JSON.stringify(experience), { access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
  const summary: ExperienceSummary = { slug, name, kind, access, status: "draft", path: `/mpa/transmuta/pulsus-fractum/experiencias/${slug}`, managed: true };
  await writeCreated([...created, summary]);
  return NextResponse.json({ experience, summary }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!readCampusRole(request)) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  const { slug, status } = await request.json() as { slug?: string; status?: "draft" | "published" };
  if (!slug || !status) return NextResponse.json({ error: "Actualización inválida." }, { status: 400 });
  const created = await readCreated();
  const next = created.map(item => item.slug === slug ? { ...item, status } : item);
  if (!created.some(item => item.slug === slug)) return NextResponse.json({ ok: true });
  await writeCreated(next);
  return NextResponse.json({ ok: true });
}
