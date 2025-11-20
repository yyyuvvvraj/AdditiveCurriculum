// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PREFIXES = [
  "/",            // homepage is public
  "/login",
  "/api/auth",    // next-auth routes
  "/_next",       // next internals
  "/favicon.ico",
  "/static",      // static assets if used
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow obvious public roots and assets
  // Exact allow for root and login, prefix allow for others:
  if (pathname === "/" || pathname === "/login" || pathname.startsWith("/_next") || pathname.startsWith("/api/auth") || pathname === "/favicon.ico" || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  // For everything else, check next-auth token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Save attempted path in callbackUrl so after login we can redirect back
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // token exists - allow
  return NextResponse.next();
}
