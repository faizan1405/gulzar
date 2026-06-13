import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shadi Mubarak — Trusted Muslim Matrimonial Platform",
  description: "Shadi Mubarak is a secure, manual-verified Muslim matrimonial site offering verified matches, curated profiles, second marriages, and premium high-profile listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
