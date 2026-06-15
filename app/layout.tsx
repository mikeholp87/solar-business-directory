import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    default: "UKSD BUS Installer Directory",
    template: "%s | UKSD BUS Installer Directory"
  },
  description: "Search approved BUS and MCS air source heat pump installers by UK territory."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
