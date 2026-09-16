import { get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { readCampusRole } from "@/lib/campus-auth";
import { DEFAULT_CAMPUS_EXPERIENCE, isCampusExperience, type CampusExperience } from "@/lib/campus-content";

const DRAFT_PATH = "campus/principios-universales/draft.json";
const PUBLISHED_PATH = "campus/principios-universales/published.json";

function safeSlug(value: string | null | undefined) {
  return value && /^[a-z0-9-]+$/.test(value) ? value : "principios-universales";
}

function contentPath(slug: string, state: "draft" | "published") {
  if (slug === "principios-universales") return state === "draft" ? DRAFT_PATH : PUBLISHED_PATH;
  return `campus/${slug}/${state}.json`;
}

async function readBlob(pathname: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const value = await new Response(result.stream).json();
  return isCampusExperience(value) ? value : null;
}

async function writeBlob(pathname: string, content: CampusExperience) {
  await put(pathname, JSON.stringify(content), { access: "private", allowOverwrite: true, addRandomSuffix: false, contentType: "application/json", cacheControlMaxAge: 60 });
}

export async function GET(request: NextRequest) {
  const draft = request.nextUrl.searchParams.get("state") === "draft";
  const slug = safeSlug(request.nextUrl.searchParams.get("slug"));
  if (draft && !readCampusRole(request)) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  try {
    const content = await readBlob(contentPath(slug, draft ? "draft" : "published"));
    if (!content && slug !== "principios-universales") return NextResponse.json({ error: "La experiencia todavía no fue publicada." }, { status: 404 });
    return NextResponse.json({ content: content || DEFAULT_CAMPUS_EXPERIENCE, source: content ? "storage" : "default", storageReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
  } catch {
    if (slug !== "principios-universales") return NextResponse.json({ error: "La experiencia todavía no fue publicada." }, { status: 404 });
    return NextResponse.json({ content: DEFAULT_CAMPUS_EXPERIENCE, source: "default", storageReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
  }
}

export async function PUT(request: NextRequest) {
  const role = readCampusRole(request);
  if (!role) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "El almacenamiento del Campus todavía no está conectado." }, { status: 503 });
  const { content, action } = await request.json() as { content: CampusExperience; action: "draft" | "publish" };
  if (!isCampusExperience(content)) return NextResponse.json({ error: "El contenido no tiene una estructura válida." }, { status: 400 });
  const slug = safeSlug(content.slug);
  const state = action === "publish" ? "published" : "draft";
  const current = await readBlob(contentPath(slug, state));
  const baseline = current || DEFAULT_CAMPUS_EXPERIENCE;
  if (role === "editor") {
    const before = baseline.locales.es.stages.map((stage) => stage.id).join("|");
    const after = content.locales.es.stages.map((stage) => stage.id).join("|");
    if (before !== after) return NextResponse.json({ error: "Agregar, eliminar, duplicar o reordenar etapas requiere acceso de Arquitecta." }, { status: 403 });
  }
  const next: CampusExperience = { ...content, version: (current?.version || content.version || 0) + 1, updatedAt: new Date().toISOString(), updatedBy: role };
  await writeBlob(contentPath(slug, state), next);
  if (action === "publish") await writeBlob(contentPath(slug, "draft"), next);
  return NextResponse.json({ content: next, action });
}
