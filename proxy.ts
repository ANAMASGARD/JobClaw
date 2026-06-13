// Route proxy (Next.js 16 replacement for middleware) — runs on every matched request.
// Redirects unauthenticated users to /login, preserving the return URL.

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "jc_session";

export function proxy(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect dashboard and the MetaMask-upgrade steps of onboarding.
  // /onboarding itself (resume upload) is reachable after Web3Auth social login.
  matcher: [
    "/dashboard/:path*",
    "/onboarding/connect-wallet",
    "/onboarding/permissions",
  ],
};
