import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0];

  if (hostname === "admin.rociodopazo.com" && request.nextUrl.pathname === "/") {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin-campus";
    return NextResponse.rewrite(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
