import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: "UKSD BUS Installer Directory",
      type: "website"
    }
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data)
  };
}
