import type { Metadata } from "next";
import { contact } from "../data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the Ryno Detailing website and services.",
};

export default function Terms() {
  return (
    <>
      <header className="pagehead">
        <h1 className="cond">Terms of <span>service</span>.</h1>
        <p>Last updated June 2026.</p>
      </header>

      <section className="pad">
        <div className="legal">
          <p>
            These terms govern your use of the Ryno Detailing website and the
            services we provide. By using this site or booking a detail, you agree
            to them.
          </p>

          <h2 className="cond">Quotes and pricing</h2>
          <p>
            Prices shown on this site are starting estimates. Final pricing
            depends on the size and condition of your vehicle and the services you
            choose. We will confirm pricing with you before any work begins.
          </p>

          <h2 className="cond">Booking and cancellations</h2>
          <p>
            Appointments are scheduled by phone or by request through our contact
            form. If you need to reschedule or cancel, please let us know as early
            as you can so we can offer the slot to someone else.
          </p>

          <h2 className="cond">Our work</h2>
          <p>
            We take care of your vehicle as if it were our own. We are not
            responsible for pre-existing damage, excessive wear, or items left in
            the vehicle. Please remove valuables before your appointment.
          </p>

          <h2 className="cond">Contact us</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href={contact.emailHref}>{contact.email}</a> or call{" "}
            <a href={contact.phoneHref}>{contact.phone}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
