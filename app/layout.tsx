import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { RootErrorBoundary } from "../components/error-boundary";
import { siteUrl } from "@/lib/runtime";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body" });

const baseUrl = siteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102A43",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "The Renewable Directory",
    template: "%s | The Renewable Directory",
  },
  description:
    "Find trusted solar PV, battery storage, heat pump, and EV charger installers across the UK. Compare MCS-certified installers, request quotes, and connect with specialists.",
  icons: {
    icon: "/favicon.svg",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Renewable Directory",
    description:
      "Find trusted solar PV, battery storage, heat pump, and EV charger installers across the UK.",
  },
  alternates: {
    languages: {
      "en-GB": `${baseUrl}/`,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className={`${montserrat.variable} flex min-h-screen flex-col`}>
        <Header />
        <main className="flex-1">
          <RootErrorBoundary>{children}</RootErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}
