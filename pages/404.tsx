import { Fraunces } from "next/font/google";
import { ErrorPage } from "@/components/error-page";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display"
});

export default function Custom404() {
  return (
    <ErrorPage
      code="404"
      eyebrow="Record not found"
      title="Missing page"
      description="The page you asked for isn’t in the directory. It may have moved, been renamed, or never existed."
      displayClassName={fraunces.className}
      schemeLabel="Route schematic"
      schemeDescription="A clean exit back into the directory."
      primaryCtaLabel="Back to home"
      primaryCtaHref="/"
      secondaryCtaLabel="Search the directory"
      secondaryCtaHref="/directory"
    />
  );
}
