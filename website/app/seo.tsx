// Server-rendered JSON-LD helpers. ponytail: invisible <script> tags only — no UI.
import { siteUrl, contact } from "./data";
import { areaData, areaKeys } from "./area-data";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const cities = areaKeys.map((k) => areaData[k].name);
const counties = [...new Set(areaKeys.map((k) => areaData[k].county))];

// Site-wide LocalBusiness. No street address in the brief, so region-only.
export const businessLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutoWash"],
  "@id": `${siteUrl}/#business`,
  name: "Ryno Detailing",
  url: siteUrl,
  telephone: contact.phoneHref.replace("tel:", ""),
  email: contact.email,
  image: `${siteUrl}/images/black-leather-front-cab-overview-after.jpg`,
  description:
    "Owner-run auto detailing serving Northern Michigan: interior deep cleans, leather care, exterior washes, wax and shine, wheels and tires, and stain and odor removal.",
  priceRange: "$$",
  address: { "@type": "PostalAddress", addressRegion: "MI", addressCountry: "US" },
  areaServed: [
    ...cities.map((name) => ({ "@type": "City", name })),
    ...counties.map((name) => ({ "@type": "AdministrativeArea", name })),
  ],
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
