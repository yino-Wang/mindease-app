import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/mixer",
  "/mornings",
  "/sleep",
  "/zen-timer",
];

const EXTENDED_PROTECTED_PREFIXES = [
  ...PROTECTED_PREFIXES,
  "/profile",
  "/courses",
  "/daily",
  "/journal",
];

function isProtectedPath(pathname: string) {
  return EXTENDED_PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function middleware(request: NextRequest) {
  const { user, response } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname === "/timer" || pathname.startsWith("/timer/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/timer/, "/zen-timer");
    return NextResponse.redirect(url);
  }

  if (isProtectedPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && user) {
    const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
    return NextResponse.redirect(new URL(next, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/mixer",
    "/mixer/:path*",
    "/mornings",
    "/mornings/:path*",
    "/sleep",
    "/sleep/:path*",
    "/timer",
    "/timer/:path*",
    "/zen-timer",
    "/zen-timer/:path*",
    "/journal",
    "/journal/:path*",
    "/courses",
    "/courses/:path*",
    "/daily",
    "/daily/:path*",
    "/profile",
    "/profile/:path*",
    "/login",
  ],
};
