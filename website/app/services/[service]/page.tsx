import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { subServices, siteUrl } from "../../data";
import { areaData, areaKeys } from "../../area-data";
import { JsonLd, breadcrumbLd } from "../../seo";

// ponytail: one dynamic route renders all 7 sub-service pages from data.ts.
const find = (slug: string) => subServices.find((s) => s.slug === slug);

export function generateStaticParams() {
  return subServices.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const svc = find(service);
  if (!svc) return {};
  return {
    title: `${svc.lead} ${svc.accent}`.trim(),
    description: svc.intro,
    alternates: { canonical: `/services/${svc.slug}` },
  };
}

export default async function SubService({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const svc = find(service);
  if (!svc) notFound();

  const name = `${svc.lead} ${svc.accent}`.trim();
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description: svc.intro,
    url: `${siteUrl}/services/${svc.slug}`,
    provider: { "@type": "LocalBusiness", "@id": `${siteUrl}/#business`, name: "Ryno Detailing" },
    areaServed: areaKeys.map((k) => ({ "@type": "City", name: areaData[k].name })),
  };
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name, path: `/services/${svc.slug}` },
  ]);

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={breadcrumb} />
      <header className="pagehead">
        <h1 className="cond">
          {svc.lead} <span>{svc.accent}</span>.
        </h1>
        <p>{svc.intro}</p>
      </header>

      <section className="pad">
        <p style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1.7, maxWidth: 720, marginBottom: 46 }}>
          {svc.body}
        </p>

        <h2 className="cond" style={{ fontSize: 30, textTransform: "uppercase", marginBottom: 20 }}>
          What&rsquo;s <span style={{ color: "var(--orange)" }}>included</span>
        </h2>
        <div className="slist">
          {svc.includes.map((i) => (
            <div className="sitem" key={i}>{i}</div>
          ))}
        </div>

        {svc.pairs.length > 0 && (
          <>
            <h2 className="cond" style={{ fontSize: 30, textTransform: "uppercase", margin: "60px 0 20px" }}>
              The <span style={{ color: "var(--orange)" }}>proof</span>
            </h2>
            <div className="gallery">
              {svc.pairs.map((g) => (
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
          </>
        )}

        {/* Layer 2 -> layer 3 link mesh: every area page for this service. */}
        <h2 className="cond" style={{ fontSize: 30, textTransform: "uppercase", margin: "60px 0 20px" }}>
          {svc.lead} {svc.accent} <span style={{ color: "var(--orange)" }}>near you</span>
        </h2>
        <div className="slist">
          {areaKeys.map((k) => (
            <Link className="sitem" key={k} href={`/services/${svc.slug}/${k}`} style={{ textDecoration: "none", display: "block" }}>
              {svc.lead} {svc.accent} in {areaData[k].name}
            </Link>
          ))}
        </div>
      </section>

      <section className="ctaimg">
        <img src="/images/black-leather-front-cab-overview-after.jpg" alt="" />
        <div className="ov">
          <h2 className="cond">Book your detail.</h2>
          <Link href="/contact">Get a Quote</Link>
        </div>
      </section>
    </>
  );
}
