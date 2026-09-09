import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/session-cookie";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    (pathname.startsWith("/api/posts") && req.method !== "GET") ||
    pathname.startsWith("/api/upload");

  if (isAdminRoute || isAdminApi) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/posts/:path*", "/api/upload/:path*"]
};
