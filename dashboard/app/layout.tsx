import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryno Detailing Dashboard",
  description: "Ryno Detailing Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
