import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nf">
      <h1 className="cond">4<span>0</span>4</h1>
      <p>That page took a wrong turn. Let&apos;s get you back on the road.</p>
      <div className="btns">
        <Link href="/" className="b1">Back Home</Link>
        <Link href="/services" className="b2">See Services</Link>
      </div>
    </section>
  );
}
