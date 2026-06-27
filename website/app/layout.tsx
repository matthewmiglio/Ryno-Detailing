import type { Metadata } from "next";
import Link from "next/link";
import { Saira, Saira_Condensed } from "next/font/google";
import { contact } from "./data";
import AnalyticsTracker from "./AnalyticsTracker";
import "./globals.css";

const body = Saira({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-body" });
const display = Saira_Condensed({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-display" });

export const metadata: Metadata = {
  title: { default: "Ryno Detailing", template: "%s | Ryno Detailing" },
  description:
    "High-octane auto detailing. Interior deep cleans, exterior washes, and showroom-grade resets. Call to book.",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Results" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <AnalyticsTracker />
        <nav>
          <Link href="/" className="logo">RYNO<i>/</i>DETAILING</Link>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
            ))}
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
