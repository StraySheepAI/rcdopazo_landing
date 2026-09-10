import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const COOKIE = "pulsus_admin_session";

function secret() { return process.env.CAMPUS_SESSION_SECRET || ""; }
function sign(role: string) { return createHmac("sha256", secret()).update(role).digest("hex"); }
function validToken(token?: string) {
  if (!token || !secret()) return null;
  const [role, signature] = token.split(".");
  if (!role || !signature) return null;
  const expected = sign(role);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return role === "architect" || role === "editor" ? role : null;
}

export async function GET(request: NextRequest) {
  const role = validToken(request.cookies.get(COOKIE)?.value);
  return NextResponse.json({ authenticated: Boolean(role), role });
}

export async function POST(request: NextRequest) {
  if (!secret() || !process.env.CAMPUS_EDITOR_PASSWORD || !process.env.CAMPUS_ARCHITECT_PASSWORD) {
    return NextResponse.json({ error: "El administrador todavía no tiene sus secretos configurados." }, { status: 503 });
  }
  const { password } = await request.json();
  const role = password === process.env.CAMPUS_ARCHITECT_PASSWORD ? "architect" : password === process.env.CAMPUS_EDITOR_PASSWORD ? "editor" : null;
  if (!role) return NextResponse.json({ error: "La palabra de acceso no fue reconocida." }, { status: 401 });
  const response = NextResponse.json({ authenticated: true, role });
  response.cookies.set(COOKIE, `${role}.${sign(role)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60 * 12, path: "/" });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(COOKIE, "", { httpOnly: true, expires: new Date(0), path: "/" });
  return response;
}
