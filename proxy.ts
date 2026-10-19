import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "vamos_admin";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/homes" || pathname.startsWith("/homes/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/homes/, "/listings");
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/es/stop-foreclosure") {
    const url = request.nextUrl.clone();
    url.pathname = "/es/ejecucion-hipotecaria";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.get(COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/homes", "/homes/:path*", "/es/stop-foreclosure"],
};
