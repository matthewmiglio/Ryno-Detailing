import { supabaseAdmin } from "@/lib/supabase";
import { getLocationFromHeaders } from "@/lib/analytics/geolocation";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, string> = {};
  try {
    body = await req.json();
  } catch {
    // No body is fine — a phone click carries no required fields.
  }

  const { city, state, country } = getLocationFromHeaders(req);

  const { error } = await supabaseAdmin.from("RYNO_PHONE_CLICKS").insert({
    site_name: SITE_NAME,
    visitor_id: body.visitor_id ?? null,
    session_id: body.session_id ?? null,
    ua: req.headers.get("user-agent"),
    referrer: req.headers.get("referer"),
    city,
    state,
    country,
  });

  if (error) {
    console.error("RYNO_PHONE_CLICKS insert failed:", error.message);
    return Response.json({ error: "Failed to record click" }, { status: 500 });
  }
  return Response.json({ success: true });
}
