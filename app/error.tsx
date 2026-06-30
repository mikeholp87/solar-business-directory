"use client";

import { Fraunces } from "next/font/google";
import { ErrorPage } from "@/components/error-page";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export default function Error({ reset }: { reset: () => void }) {
  return (
    <ErrorPage
      code="500"
      eyebrow="Server error"
      title="Temporary outage"
      description="Something on the server failed while handling this request. The directory is still there, but this page could not be rendered just now."
      displayClassName={fraunces.className}
      schemeLabel="Recovery path"
      schemeDescription="Try again, return to the homepage, or browse the directory."
      primaryCtaLabel="Try again"
      primaryCtaHref="/"
      secondaryCtaLabel="Browse the directory"
      secondaryCtaHref="/directory"
    />
  );
}
