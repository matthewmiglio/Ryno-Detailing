import { supabaseAdmin } from "@/lib/supabase";
import { getLocationFromHeaders } from "@/lib/analytics/geolocation";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "edge";

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const path = (body.path ?? "").trim();
  if (!path) {
    return Response.json({ error: "path is required" }, { status: 400 });
  }

  const { city, state, country } = getLocationFromHeaders(req);

  const { error } = await supabaseAdmin.from("RYNO_ANALYTICS").insert({
    path,
    referrer: body.referrer ?? req.headers.get("referer"),
    visitor_id: body.visitor_id ?? null,
    session_id: body.session_id ?? null,
    ua: req.headers.get("user-agent"),
    city,
    state,
    country,
    site_name: SITE_NAME,
  });

  if (error) {
    console.error("RYNO_ANALYTICS insert failed:", error.message);
    return Response.json({ error: "Failed to record pageview" }, { status: 500 });
  }
  return Response.json({ success: true });
}

// Pageviews are POST-only; anything else is a mistake.
export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
