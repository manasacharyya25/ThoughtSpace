import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = [
  "/feed",
  "/inbox",
  "/profile",
  "/chat",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthRoute(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/auth");
}

function isPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/colourful-landing" ||
    pathname === "/test" ||
    pathname.startsWith("/api/")
  );
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, hasProfile: profileExists } =
    await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname === "/landing") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!user && (isProtectedPath(pathname) || pathname === "/onboarding")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = profileExists ? "/feed" : "/onboarding";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  if (user && !profileExists && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  if (user && profileExists && pathname === "/onboarding") {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  if (!user && !isPublicPath(pathname) && !isAuthRoute(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
