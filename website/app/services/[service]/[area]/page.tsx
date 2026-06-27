import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { subServices, siteUrl } from "../../../data";
import { areaData, areaKeys } from "../../../area-data";
import { JsonLd, breadcrumbLd, faqLd } from "../../../seo";

// Layer 3: one localized landing page per service x area (7 x 5 = 35).
// ponytail: cross-products subServices x areaData, filters the area's
// projects/reviews/faqs by serviceTypes. Reuses existing CSS classes.
const findSvc = (slug: string) => subServices.find((s) => s.slug === slug);

export function generateStaticParams() {
  return subServices.flatMap((s) =>
    areaKeys.map((a) => ({ service: s.slug, area: a })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; area: string }>;
}): Promise<Metadata> {
  const { service, area } = await params;
  const svc = findSvc(service);
  const a = areaData[area];
  if (!svc || !a) return {};
  const name = `${svc.lead} ${svc.accent}`.trim();
  return {
    title: `${name} in ${a.name}, MI`,
    description: `${name} for ${a.name}, ${a.county}. ${svc.intro}`,
    alternates: { canonical: `/services/${svc.slug}/${a.slug}` },
  };
}

export default async function ServiceArea({
  params,
}: {
  params: Promise<{ service: string; area: string }>;
}) {
  const { service, area } = await params;
  const svc = findSvc(service);
  const a = areaData[area];
  if (!svc || !a) notFound();

  const projects = a.projects.filter((p) => p.serviceTypes.includes(svc.slug));
  const reviews = a.reviews.filter((r) => r.serviceTypes.includes(svc.slug));
  const faqs = a.faqs.filter((f) => f.serviceTypes.includes(svc.slug));
  const popular = a.popularProjects.find((p) => p.serviceSlug === svc.slug);
  const h2 = { fontSize: 30, textTransform: "uppercase" as const };

  const name = `${svc.lead} ${svc.accent}`.trim();
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${name} in ${a.name}, MI`,
    serviceType: name,
    description: `${name} for ${a.name}, ${a.county}. ${svc.intro}`,
    url: `${siteUrl}/services/${svc.slug}/${a.slug}`,
    areaServed: { "@type": "City", name: a.name },
    provider: { "@type": "LocalBusiness", "@id": `${siteUrl}/#business`, name: "Ryno Detailing" },
    // AggregateRating + reviews only where reviews are actually displayed on the page.
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.reviewerName },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.text,
      })),
    }),
  };
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name, path: `/services/${svc.slug}` },
    { name: `${name} in ${a.name}`, path: `/services/${svc.slug}/${a.slug}` },
  ]);

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={breadcrumb} />
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      <header className="pagehead">
        <h1 className="cond">
          {svc.lead} {svc.accent} in <span>{a.name}</span>.
        </h1>
        <p>{svc.intro}</p>
      </header>

      <section className="pad">
        <p style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1.7, maxWidth: 720, marginBottom: 24 }}>
          {a.intro}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: 18, lineHeight: 1.7, maxWidth: 720, marginBottom: 46 }}>
          {svc.body}
        </p>

        <h2 className="cond" style={{ ...h2, marginBottom: 20 }}>
          What&rsquo;s <span style={{ color: "var(--orange)" }}>included</span>
        </h2>
        <div className="slist">
          {svc.includes.map((i) => (
            <div className="sitem" key={i}>{i}</div>
          ))}
        </div>

        {projects.length > 0 && (
          <>
            <h2 className="cond" style={{ ...h2, margin: "60px 0 20px" }}>
              Recent work in <span style={{ color: "var(--orange)" }}>{a.name}</span>
            </h2>
            <div className="scards">
              {projects.map((p) => (
                <div className="scard" key={p.title} style={{ padding: 0, overflow: "hidden" }}>
                  <img
                    src={p.images[0]}
                    alt={`${p.title} in ${p.neighborhood}, ${a.name}`}
                    style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: 28 }}>
                    <h3 className="cond" style={{ fontSize: 22, textTransform: "uppercase" }}>{p.title}</h3>
                    <div style={{ color: "var(--orange)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", margin: "6px 0 12px" }}>
                      {p.neighborhood}
                    </div>
                    <p style={{ color: "var(--text-dim)", lineHeight: 1.6, fontSize: 15 }}>{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="cond" style={{ ...h2, margin: "60px 0 20px" }}>
          Serving <span style={{ color: "var(--orange)" }}>{a.name}</span>, {a.county}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.7, maxWidth: 720, marginBottom: 16 }}>
          {a.climate} {a.localConstraints.serviceNotes}
        </p>
        <div className="slist">
          {a.neighborhoods.map((n) => (
            <div className="sitem" key={n}>{n}</div>
          ))}
        </div>
        {popular && (
          <p style={{ color: "var(--text-dim)", fontSize: 15, marginTop: 20, maxWidth: 720 }}>
            Popular here: {popular.projectTypes.join(", ")}.
          </p>
        )}

        {reviews.length > 0 && (
          <>
            <h2 className="cond" style={{ ...h2, margin: "60px 0 20px" }}>
              What <span style={{ color: "var(--orange)" }}>{a.name}</span> drivers say
            </h2>
            <div className="scards">
              {reviews.map((r) => (
                <div className="scard" key={r.reviewerName + r.text.slice(0, 12)}>
                  <div style={{ color: "var(--orange)", letterSpacing: 2 }} aria-label={`${r.rating} out of 5 stars`}>
                    {"★".repeat(r.rating)}
                  </div>
                  <p style={{ color: "var(--text-dim)", lineHeight: 1.6, fontSize: 15, margin: "12px 0 16px" }}>
                    &ldquo;{r.text}&rdquo;
                  </p>
                  <div className="cond" style={{ textTransform: "uppercase", fontSize: 16 }}>
                    {r.reviewerName}
                  </div>
                  <div style={{ color: "var(--text-faint)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>
                    {r.neighborhood ? `${r.neighborhood} · ` : ""}{r.source}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {faqs.length > 0 && (
          <>
            <h2 className="cond" style={{ ...h2, margin: "60px 0 20px" }}>
              {svc.lead} {svc.accent} <span style={{ color: "var(--orange)" }}>FAQs</span>
            </h2>
            <div style={{ maxWidth: 820, display: "grid", gap: 16 }}>
              {faqs.map((f) => (
                <div className="scard" key={f.question}>
                  <h3 className="cond" style={{ fontSize: 19, textTransform: "uppercase", marginBottom: 8 }}>{f.question}</h3>
                  <p style={{ color: "var(--text-dim)", lineHeight: 1.6, fontSize: 15 }}>{f.answer}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="ctaimg">
        <img src="/images/black-leather-front-cab-overview-after.jpg" alt="" />
        <div className="ov">
          <h2 className="cond">{svc.lead} {svc.accent} in {a.name}?</h2>
          <Link href="/contact">Get a Quote</Link>
        </div>
      </section>
    </>
  );
}
