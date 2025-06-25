import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("auth-token");

  // Public paths that don't require authentication
  const publicPaths = ["/", "/login", "/register"];

  // Public paths that start with these prefixes don't require authentication
  const publicPathPrefixes = [
    "/network",
    "/jobs",
    "/events",
    "/mentoring",
    "/forums",
  ];

  // Check if the current path is public
  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPathPrefixes.some((prefix) => pathname.startsWith(prefix));

  // Redirect authenticated users trying to access auth pages to dashboard
  if (isAuthenticated && pathname !== "/" && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Redirect unauthenticated users trying to access protected pages to login
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Configure paths that should trigger the middleware
export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
