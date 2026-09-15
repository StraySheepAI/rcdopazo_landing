import { get, put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { readCampusRole } from "@/lib/campus-auth";

export const runtime = "nodejs";
const MAX_FILE_SIZE = 4 * 1024 * 1024;

function isAllowed(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("audio/") || file.type === "application/pdf";
}

function safeFilename(filename: string) {
  return filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "archivo";
}

export async function POST(request: NextRequest) {
  if (!readCampusRole(request)) return NextResponse.json({ error: "Acceso requerido." }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "El almacenamiento del Campus todavía no está conectado." }, { status: 503 });
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Elegí un archivo para subir." }, { status: 400 });
  if (!isAllowed(file)) return NextResponse.json({ error: "Podés subir imágenes, audios o PDF." }, { status: 415 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "El archivo supera el límite de 4 MB." }, { status: 413 });
  const blob = await put(`campus/media/${Date.now()}-${safeFilename(file.name)}`, file, {
    access: "private", addRandomSuffix: true, contentType: file.type, cacheControlMaxAge: 60 * 60 * 24 * 30,
  });
  const url = `/api/campus/media?path=${encodeURIComponent(blob.pathname)}`;
  return NextResponse.json({ url, pathname: blob.pathname, contentType: blob.contentType, size: file.size });
}

export async function GET(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return new NextResponse("Archivo no disponible.", { status: 503 });
  const pathname = request.nextUrl.searchParams.get("path");
  if (!pathname?.startsWith("campus/media/")) return new NextResponse("Archivo no válido.", { status: 400 });
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return new NextResponse("Archivo no encontrado.", { status: 404 });
  return new NextResponse(result.stream, { headers: {
    "content-type": result.blob.contentType,
    "content-length": String(result.blob.size),
    "cache-control": "public, max-age=3600, s-maxage=86400",
    "content-disposition": "inline",
  } });
}
