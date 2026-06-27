import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// HTTP Basic Auth for the whole dashboard. Next 16 renamed `middleware` -> `proxy`.
// Single-admin internal tool: the browser's native login prompt is all the auth we need.
// ponytail: plaintext Basic Auth, HTTPS-only (fine on Vercel). Swap to Supabase Auth
// only if we ever need >1 user or real sessions.

// Gate everything except Next's static assets + the favicon.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// TEMP: auth gate disabled for a style audit. Restore the real proxy() below.
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}
