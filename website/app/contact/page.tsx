import type { Metadata } from "next";
import { contact } from "../data";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, email, or send a message to book your detail. Ryno Detailing replies fast.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <header className="pagehead">
        <h1 className="cond">Let&apos;s <span>talk</span>.</h1>
        <p>Fastest way to book is a call. Prefer to write? Use the form or email us.</p>
      </header>

      <section className="pad">
        <div className="contact">
          <div className="cinfo">
            <div className="row">
              <div className="k">Phone</div>
              <div className="v"><a href={contact.phoneHref}>{contact.phone}</a></div>
            </div>
            <div className="row">
              <div className="k">Email</div>
              <div className="v"><a href={contact.emailHref}>{contact.email}</a></div>
            </div>
            <a href={contact.phoneHref} className="callbtn">Call Now</a>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
