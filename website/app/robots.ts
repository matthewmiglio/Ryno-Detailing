import type { MetadataRoute } from "next";
import { siteUrl } from "./data";

export default function robots(): MetadataRoute.Robots {
  // Block indexing on Vercel preview/staging; allow only on production.
  const isProd = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : true;

  if (!isProd) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
