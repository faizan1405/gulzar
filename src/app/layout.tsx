import type { Metadata } from "next";
import "./globals.css";
import { SimulatorProvider } from "../context/SimulatorContext";
import DemoSimulatorBar from "../components/DemoSimulatorBar";
import ProfileDetails from "../components/ProfileDetails";
import ChatbotWidget from "../components/ChatbotWidget";

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
        <SimulatorProvider>
          <DemoSimulatorBar />
          <ProfileDetails />
          {children}
          <ChatbotWidget />
        </SimulatorProvider>
      </body>
    </html>
  );
}



