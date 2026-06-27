import type { MetadataRoute } from "next";
import { siteUrl, subServices } from "./data";
import { areaKeys } from "./area-data";

// All public routes: 7 static + 7 sub-services + 7x5 service-by-area = 49 URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const u = (p: string) => `${siteUrl}${p}`;

  const staticPaths = [
    "",
    "/services",
    "/gallery",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: u(p),
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/services" ? 0.9 : 0.6,
  }));

  for (const s of subServices) {
    entries.push({
      url: u(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    for (const a of areaKeys) {
      entries.push({
        url: u(`/services/${s.slug}/${a}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
