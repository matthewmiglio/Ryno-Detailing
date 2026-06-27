import type { Metadata } from "next";
import Link from "next/link";
import { contact, packages, services } from "../data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Detailing packages and the full menu of services: interior deep cleans, carpet shampoo, leather care, foam cannon wash, pet hair removal, and more.",
};

export default function Services() {
  return (
    <>
      <header className="pagehead">
        <h1 className="cond">The <span>menu</span>.</h1>
        <p>
          Flat prices, no fluff. Start with a package, or call and we will build
          a detail around exactly what your car needs.
        </p>
      </header>

      <section className="pad">
        <div className="scards">
          {packages.map((p) => (
            <div className="scard" key={p.name}>
              <h3 className="cond">{p.name}</h3>
              <p>{p.desc}</p>
              <div className="pr">{p.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="svc" style={{ paddingTop: 0 }}>
        <h2 className="cond">Every <span>service</span> we run.</h2>
        <div className="slist">
          {services.map((s) => (
            <div className="sitem" key={s}>{s}</div>
          ))}
        </div>
        <div className="btns" style={{ marginTop: 46 }}>
          <a href={contact.phoneHref} className="b1">Call {contact.phone}</a>
          <Link href="/contact" className="b2">Get a Quote</Link>
        </div>
      </section>
    </>
  );
}
