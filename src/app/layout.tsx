import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { Cormorant_Garamond, Poppins, Great_Vibes, Amiri } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-arabic",
  display: "swap",
});

import {
  ProfileDetails,
  ChatbotWidget,
  CallButton,
  WhatsAppButton,
  RegistrationPopup
} from "../components/ClientDynamicWrappers";

export const metadata: Metadata = {
  metadataBase: new URL("https://rishteforever.in"),
  title: "Rishte Forever — Trusted Muslim Matrimonial Platform",
  description: "Rishte Forever is a secure, manual-verified Muslim matrimonial site offering verified matches, curated profiles, silver plan matches, and premium gold package options.",
  openGraph: {
    images: [{ url: "/images/rishte-forever-logo.png", width: 900, height: 340 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${poppins.variable} ${greatVibes.variable} ${amiri.variable}`}>
      <body>
        <AppProvider>
          <RegistrationPopup />
          <ProfileDetails />
          {children}
          <ChatbotWidget />
          <CallButton />
          <WhatsAppButton />
        </AppProvider>
      </body>
    </html>
  );
}




