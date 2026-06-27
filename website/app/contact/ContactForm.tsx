"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setStatus("sending");
    try {
      // /api/forms saves to Supabase AND sends the notification email server-side,
      // running validation + spam filtering first.
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: String(fd.get("name") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          email: String(fd.get("email") ?? ""),
          message: String(fd.get("message") ?? ""),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Contact form submit failed:", err);
      setStatus("error");
    }
  }

  return (
    <form className="cform" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="message">What does your car need?</label>
        <textarea id="message" name="message" required />
      </div>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "success" && (
        <p className="formmsg ok" role="status">Thanks. We got your message and will be in touch shortly.</p>
      )}
      {status === "error" && (
        <p className="formmsg err" role="alert">Something went wrong. Please call us instead.</p>
      )}
    </form>
  );
}
