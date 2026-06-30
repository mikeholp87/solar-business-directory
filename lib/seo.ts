import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type PageMetadataOptions = {
  noindex?: boolean;
};

export function pageMetadata(title: string, description: string, path = "/", options: PageMetadataOptions = {}): Metadata {
  return {
    title,
    description,
    robots: options.noindex ? { index: false, follow: false } : undefined,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: "Renewable Directory",
      type: "website"
    }
  };
}

export function jsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data)
  };
}
