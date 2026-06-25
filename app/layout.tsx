import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "The Renewable Directory",
    template: "%s | The Renewable Directory"
  },
  description: "Find trusted solar PV, battery storage, heat pump, and EV charger installers across the UK. Compare MCS-certified installers, request quotes, and connect with specialists."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className={montserrat.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
