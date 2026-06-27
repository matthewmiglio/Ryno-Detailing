import type { Metadata } from "next";
import Link from "next/link";
import { contact, team } from "../data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ryno Detailing is a local, owner-run detailing shop built by Ryder Helms and Noah Pickelhaupt. Meet the team behind the reset.",
};

export default function About() {
  return (
    <>
      <header className="pagehead">
        <h1 className="cond">Built on <span>grit</span>.</h1>
      </header>

      <section className="pad">
        <div className="about">
          <div>
            <p>
              Ryno Detailing is a local, owner-run shop. No franchise scripts, no
              assembly line. Just two people who care about how your car feels
              when you climb back in.
            </p>
            <p>
              We started because every detail we paid for somewhere else cut a
              corner we would not have. So we do it our way: tight on the work,
              honest on the price, and finished only when it actually looks done.
            </p>
            <div className="btns">
              <a href={contact.phoneHref} className="b1">Call {contact.phone}</a>
              <Link href="/gallery" className="b2">See Results</Link>
            </div>
          </div>
          <div className="aboutframe">
            <img src="/images/black-leather-front-cab-overview-after.jpg" alt="Detailed interior" />
          </div>
        </div>

        <div className="team">
          {team.map((m) => (
            <div className="member" key={m.name}>
              <div className="avatar cond">{m.initials}</div>
              <div>
                <h3 className="cond">{m.name}</h3>
                <div className="role">{m.role}</div>
                <p>{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
