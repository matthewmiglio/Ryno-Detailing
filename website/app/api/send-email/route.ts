import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { subject?: string; html?: string; to?: string[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { subject, html, to } = body;
  if (!subject || !html) {
    return Response.json({ error: "subject and html are required" }, { status: 400 });
  }

  try {
    const data = await sendEmail({ subject, html, to });
    return Response.json({ success: true, id: data.id });
  } catch (err) {
    console.error("send-email failed:", err);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
