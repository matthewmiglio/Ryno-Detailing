import type { Metadata } from "next";
import { contact } from "../data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ryno Detailing collects, uses, and protects your information.",
};

export default function Privacy() {
  return (
    <>
      <header className="pagehead">
        <h1 className="cond">Privacy <span>policy</span>.</h1>
        <p>Last updated June 2026.</p>
      </header>

      <section className="pad">
        <div className="legal">
          <p>
            Ryno Detailing (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your
            privacy. This policy explains what we collect when you use our website
            or contact us, and how we use it.
          </p>

          <h2 className="cond">What we collect</h2>
          <p>
            When you submit our contact form or reach out by phone or email, we
            collect the details you give us: your name, phone number, email
            address, and your message. We also collect basic, anonymous analytics
            about how visitors use the site (such as pages viewed) to help us
            improve it.
          </p>

          <h2 className="cond">How we use it</h2>
          <p>
            We use your contact details only to respond to your inquiry and to
            schedule and provide detailing services. We do not sell your personal
            information, and we do not share it except as needed to operate our
            business or comply with the law.
          </p>

          <h2 className="cond">Data retention</h2>
          <p>
            We keep contact submissions for as long as needed to serve you and
            keep our records. You can ask us to delete your information at any
            time.
          </p>

          <h2 className="cond">Contact us</h2>
          <p>
            Questions about this policy? Email us at{" "}
            <a href={contact.emailHref}>{contact.email}</a> or call{" "}
            <a href={contact.phoneHref}>{contact.phone}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
