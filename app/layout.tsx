import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
