import type { Metadata } from "next";
import "./globals.css";
import { SimulatorProvider } from "../context/SimulatorContext";
import { Cormorant_Garamond, Poppins, Great_Vibes, Amiri } from "next/font/google";
import dynamic from "next/dynamic";

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

const DemoSimulatorBar = dynamic(() => import("../components/DemoSimulatorBar"), { ssr: false });
const ProfileDetails = dynamic(() => import("../components/ProfileDetails"), { ssr: false });
const ChatbotWidget = dynamic(() => import("../components/ChatbotWidget"), { ssr: false });
const CallButton = dynamic(() => import("../components/CallButton"), { ssr: false });
const WhatsAppButton = dynamic(() => import("../components/WhatsAppButton"), { ssr: false });

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
    <html lang="en" className={`${cormorantGaramond.variable} ${poppins.variable} ${greatVibes.variable} ${amiri.variable}`}>
      <body>
        <SimulatorProvider>
          <DemoSimulatorBar />
          <ProfileDetails />
          {children}
          <ChatbotWidget />
          <CallButton />
          <WhatsAppButton />
        </SimulatorProvider>
      </body>
    </html>
  );
}




