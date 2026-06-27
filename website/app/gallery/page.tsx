import type { Metadata } from "next";
import Link from "next/link";
import { contact, gallery } from "../data";

export const metadata: Metadata = {
  title: "Results",
  description:
    "Before and after detailing results. Real interiors, real grime, real resets. See the difference a Ryno detail makes.",
  alternates: { canonical: "/gallery" },
};

export default function Gallery() {
  return (
    <>
      <header className="pagehead">
        <h1 className="cond">The <span>proof</span>.</h1>
        <p>Real cars, real grime, real resets. Drag your eyes left to right.</p>
      </header>

      <section className="pad">
        <div className="gallery">
          {gallery.map((g) => (
            <div className="ba" key={g.label}>
              <div className="pair">
                <figure>
                  <img src={`/images/${g.before}`} alt={`${g.label} before`} />
                  <figcaption>Before</figcaption>
                </figure>
                <figure>
                  <img src={`/images/${g.after}`} alt={`${g.label} after`} />
                  <figcaption>After</figcaption>
                </figure>
              </div>
              <div className="lbl cond">{g.label}</div>
            </div>
          ))}
        </div>

        <div className="btns" style={{ marginTop: 50 }}>
          <a href={contact.phoneHref} className="b1">Book a Detail</a>
          <Link href="/services" className="b2">See Services</Link>
        </div>
      </section>
    </>
  );
}
