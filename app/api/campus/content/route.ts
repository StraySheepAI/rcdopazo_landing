import { get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { readCampusRole } from "@/lib/campus-auth";
import { DEFAULT_CAMPUS_EXPERIENCE, isCampusExperience, type CampusExperience } from "@/lib/campus-content";

const DRAFT_PATH = "campus/principios-universales/draft.json";
const PUBLISHED_PATH = "campus/principios-universales/published.json";

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
  if (draft && !readCampusRole(request)) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  try {
    const content = await readBlob(draft ? DRAFT_PATH : PUBLISHED_PATH);
    return NextResponse.json({ content: content || DEFAULT_CAMPUS_EXPERIENCE, source: content ? "storage" : "default", storageReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
  } catch {
    return NextResponse.json({ content: DEFAULT_CAMPUS_EXPERIENCE, source: "default", storageReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
  }
}

export async function PUT(request: NextRequest) {
  const role = readCampusRole(request);
  if (!role) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "El almacenamiento del Campus todavía no está conectado." }, { status: 503 });
  const { content, action } = await request.json() as { content: CampusExperience; action: "draft" | "publish" };
  if (!isCampusExperience(content)) return NextResponse.json({ error: "El contenido no tiene una estructura válida." }, { status: 400 });
  const current = await readBlob(action === "publish" ? PUBLISHED_PATH : DRAFT_PATH);
  const baseline = current || DEFAULT_CAMPUS_EXPERIENCE;
  if (role === "editor") {
    const before = baseline.locales.es.stages.map((stage) => stage.id).join("|");
    const after = content.locales.es.stages.map((stage) => stage.id).join("|");
    if (before !== after) return NextResponse.json({ error: "Agregar, eliminar, duplicar o reordenar etapas requiere acceso de Arquitecta." }, { status: 403 });
  }
  const next: CampusExperience = { ...content, version: (current?.version || content.version || 0) + 1, updatedAt: new Date().toISOString(), updatedBy: role };
  await writeBlob(action === "publish" ? PUBLISHED_PATH : DRAFT_PATH, next);
  if (action === "publish") await writeBlob(DRAFT_PATH, next);
  return NextResponse.json({ content: next, action });
}
