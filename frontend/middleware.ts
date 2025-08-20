import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard", "/boards"];
  const publicRoutes = ["/login", "/register", "/"];
  const token = request.cookies.get("auth-token");

  // Si está autenticado y va a una ruta pública, redirigir al board
  if (token && publicRoutes.some((route) => pathname === route)) {
    return NextResponse.redirect(new URL("/boards", request.url));
  }

  // Si NO está autenticado y va a una ruta protegida, redirigir al login
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

