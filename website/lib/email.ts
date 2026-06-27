// Resend email helper. Used by /api/send-email and (later) server-side by /api/forms.
// Talks to the Resend REST API directly via fetch — no SDK dependency needed.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailInput = {
  subject: string;
  html: string;
  to?: string[]; // optional override; defaults to CONTACT_FORM_TO
};

export async function sendEmail({ subject, html, to }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FORM_FROM;
  if (!apiKey) throw new Error("RESEND_API_KEY not set");
  if (!from) throw new Error("CONTACT_FORM_FROM not set");

  const recipients = (to ?? (process.env.CONTACT_FORM_TO ?? "").split(","))
    .map((e) => e.trim())
    .filter((e) => e && !e.includes("example.com")); // drop placeholder addrs
  if (recipients.length === 0) throw new Error("No valid recipients configured");

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: recipients, subject, html }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as { id: string };
}
