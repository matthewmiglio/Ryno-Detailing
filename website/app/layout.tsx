import type { Metadata } from "next";
import Link from "next/link";
import { Saira, Saira_Condensed } from "next/font/google";
import { contact, subServices, siteUrl } from "./data";
import { JsonLd, businessLd } from "./seo";
import AnalyticsTracker from "./AnalyticsTracker";
import "./globals.css";

const body = Saira({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });
const display = Saira_Condensed({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ryno Detailing | Auto Detailing in Northern Michigan",
    template: "%s | Ryno Detailing",
  },
  description:
    "High-octane auto detailing. Interior deep cleans, exterior washes, and showroom-grade resets. Call to book.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ryno Detailing",
    url: siteUrl,
    images: ["/images/black-leather-front-cab-overview-after.jpg"],
  },
  twitter: { card: "summary_large_image" },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <JsonLd data={businessLd} />
        <AnalyticsTracker />
        <nav>
          <Link href="/" className="logo">RYNO<i>/</i>DETAILING</Link>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li className="navdd">
              <details>
                <summary>Services</summary>
                <div className="ddmenu">
                  <Link href="/services">All Services</Link>
                  {subServices.map((s) => (
                    <Link key={s.slug} href={`/services/${s.slug}`}>{s.lead} {s.accent}</Link>
                  ))}
                </div>
              </details>
            </li>
            <li><Link href="/gallery">Results</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><a href={contact.phoneHref} className="navcta">Call {contact.phone}</a></li>
          </ul>
        </nav>

        {children}

        <footer>
          <div className="cond">RYNO/DETAILING</div>
          <div className="fnav">
            <Link href="/services">Services</Link>
            <Link href="/gallery">Results</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <div>&copy; 2026</div>
        </footer>
      </body>
    </html>
  );
}
