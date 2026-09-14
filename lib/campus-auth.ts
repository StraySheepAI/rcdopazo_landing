import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

export type CampusRole = "editor" | "architect";
export const CAMPUS_COOKIE = "pulsus_admin_session";

function sessionSecret() {
  return process.env.CAMPUS_SESSION_SECRET || "";
}

export function signCampusRole(role: CampusRole) {
  return createHmac("sha256", sessionSecret()).update(role).digest("hex");
}

export function readCampusRole(request: NextRequest): CampusRole | null {
  const token = request.cookies.get(CAMPUS_COOKIE)?.value;
  if (!token || !sessionSecret()) return null;
  const [role, signature] = token.split(".");
  if ((role !== "editor" && role !== "architect") || !signature) return null;
  const expected = signCampusRole(role);
  if (signature.length !== expected.length) return null;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? role : null;
}
