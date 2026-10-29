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
  // Common guessed Spanish paths → canonical Spanish equivalents
  if (pathname === "/es/cash-offer" || pathname === "/es/cash-offer/") {
    const url = request.nextUrl.clone();
    url.pathname = "/es/oferta-en-efectivo";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/es/take-over-payments" || pathname === "/es/take-over-payments/") {
    const url = request.nextUrl.clone();
    url.pathname = "/es/tomar-los-pagos";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/es/about" || pathname === "/es/about/") {
    const url = request.nextUrl.clone();
    url.pathname = "/es/nosotros";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/es/contact" || pathname === "/es/contact/") {
    const url = request.nextUrl.clone();
    url.pathname = "/es/contacto";
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
  matcher: [
    "/admin",
    "/admin/:path*",
    "/homes",
    "/homes/:path*",
    "/es/stop-foreclosure",
    "/es/cash-offer",
    "/es/take-over-payments",
    "/es/about",
    "/es/contact",
  ],
};
