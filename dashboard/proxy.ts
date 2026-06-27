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

export function proxy(req: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const pwd = process.env.DASHBOARD_PASSWORD;
  if (!user || !pwd) {
    return new NextResponse("DASHBOARD_USER / DASHBOARD_PASSWORD not set", {
      status: 500,
    });
  }
  // btoa, not Buffer: proxy runs on the Edge runtime.
  const expected = "Basic " + btoa(`${user}:${pwd}`);
  if (req.headers.get("authorization") !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="dashboard"' },
    });
  }
  return NextResponse.next();
}
