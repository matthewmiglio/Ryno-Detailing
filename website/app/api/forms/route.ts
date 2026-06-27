import { supabaseAdmin } from "@/lib/supabase";
import { getLocationFromHeaders } from "@/lib/analytics/geolocation";
import { checkForSpam } from "@/lib/spamFilter";
import { SITE_NAME } from "@/lib/constants";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Accept either full_name or the form's `name` field.
  const full_name = (body.full_name ?? body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!full_name || !email || !phone || !message) {
    return Response.json(
      { error: "full_name, email, phone, and message are required" },
      { status: 400 }
    );
  }
  if (checkForSpam(email, message)) {
    return Response.json({ error: "Message flagged as spam" }, { status: 400 });
  }

  const { city, state, country } = getLocationFromHeaders(req);

  const { data, error } = await supabaseAdmin
    .from("RYNO_FORMS")
    .insert({
      full_name,
      email,
      phone,
      message,
      site_name: SITE_NAME,
      ua: req.headers.get("user-agent"),
      referrer: req.headers.get("referer"),
      city,
      state,
      country,
    })
    .select()
    .single();

  if (error) {
    console.error("RYNO_FORMS insert failed:", error.message);
    return Response.json({ error: "Failed to save submission" }, { status: 500 });
  }

  // Notify the business by email, server-side (one client call). The row is
  // already saved, so an email failure must not fail the request.
  try {
    await sendEmail({
      subject: `New contact from ${full_name}`,
      html: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(full_name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (err) {
    console.error("Contact notification email failed (submission saved):", err);
  }

  return Response.json({ success: true, data });
}
