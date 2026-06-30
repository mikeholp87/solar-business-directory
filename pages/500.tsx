import { Fraunces } from "next/font/google";
import { ErrorPage } from "@/components/error-page";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export default function Custom500() {
  return (
    <ErrorPage
      code="500"
      eyebrow="Server error"
      title="Temporary outage"
      description="Something on the server failed while handling this request. The directory is still there, but this page could not be rendered just now."
      displayClassName={fraunces.className}
      schemeLabel="Recovery path"
      schemeDescription="Try the homepage or come back after the server recovers."
      primaryCtaLabel="Back to home"
      primaryCtaHref="/"
      secondaryCtaLabel="Browse the directory"
      secondaryCtaHref="/directory"
    />
  );
}
