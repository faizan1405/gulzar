import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { SessionProvider } from "@/context/SessionContext";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import CustomerOverlays from "@/components/CustomerOverlays";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rishteforever.com"),
  title: "Rishte Forever — Trusted Muslim Matrimonial Platform",
  description: "Rishte Forever is a secure, manual-verified Muslim matrimonial site offering verified matches, curated profiles, silver plan matches, and premium gold package options.",
  openGraph: {
    images: [{ url: "/images/rishte-forever-logo.png", width: 900, height: 340 }],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${poppins.variable}`}>
      <body>
        <NextAuthSessionProvider>
          <SessionProvider>
            {children}
            <CustomerOverlays />
          </SessionProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}




