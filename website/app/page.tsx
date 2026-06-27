import Link from "next/link";
import { contact, packages } from "./data";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <h1 className="cond">Detail that<br /><span>hits</span> different.</h1>
          <p>
            High-octane detailing for people who actually drive their cars. Fast,
            thorough, and ruthless on grime. Inside and out.
          </p>
          <div className="btns">
            <a href={contact.phoneHref} className="b1">Book a Detail</a>
            <Link href="/gallery" className="b2">See Results</Link>
          </div>
        </div>
        <div className="heroframe">
          <img src="/images/dashboard-steering-wheel-center-console-clean-after.jpg" alt="Detailed cockpit" />
        </div>
      </section>

      <section className="angle">
        <div className="inner">
          <div className="stat"><b className="cond">2.5K+</b><span>Cars Detailed</span></div>
          <div className="stat"><b className="cond">4.9&#9733;</b><span>Avg Rating</span></div>
          <div className="stat"><b className="cond">18</b><span>Services Offered</span></div>
          <div className="stat"><b className="cond">48h</b><span>Booking Window</span></div>
        </div>
      </section>

      <section className="svc">
        <h2 className="cond">Pick your <span>weapon</span>.</h2>
        <div className="scards">
          {packages.map((p) => (
            <div className="scard" key={p.name}>
              <h3 className="cond">{p.name}</h3>
              <p>{p.desc}</p>
              <div className="pr">{p.price}</div>
            </div>
          ))}
        </div>
        <div className="btns" style={{ marginTop: 40 }}>
          <Link href="/services" className="b2">See All Services</Link>
        </div>
      </section>

      <section className="ctaimg">
        <img src="/images/black-leather-driver-seat-console-clean.jpg" alt="" />
        <div className="ov">
          <h2 className="cond">Ready to roll?</h2>
          <a href={contact.phoneHref}>Call {contact.phone}</a>
        </div>
      </section>
    </>
  );
}
