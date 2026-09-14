import { NextRequest, NextResponse } from "next/server";
import { CAMPUS_COOKIE, readCampusRole, signCampusRole } from "@/lib/campus-auth";

export async function GET(request: NextRequest) {
  const role = readCampusRole(request);
  return NextResponse.json({ authenticated: Boolean(role), role });
}

export async function POST(request: NextRequest) {
  if (!process.env.CAMPUS_SESSION_SECRET || !process.env.CAMPUS_EDITOR_PASSWORD || !process.env.CAMPUS_ARCHITECT_PASSWORD) {
    return NextResponse.json({ error: "El administrador todavía no tiene sus secretos configurados." }, { status: 503 });
  }
  const { password } = await request.json();
  const role = password === process.env.CAMPUS_ARCHITECT_PASSWORD ? "architect" : password === process.env.CAMPUS_EDITOR_PASSWORD ? "editor" : null;
  if (!role) return NextResponse.json({ error: "La palabra de acceso no fue reconocida." }, { status: 401 });
  const response = NextResponse.json({ authenticated: true, role });
  response.cookies.set(CAMPUS_COOKIE, `${role}.${signCampusRole(role)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60 * 12, path: "/" });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(CAMPUS_COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
