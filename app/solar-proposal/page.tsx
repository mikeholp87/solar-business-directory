import type { Metadata } from "next";
import { SolarProposalFunnel } from "@/components/solar-proposal-funnel";

export const metadata: Metadata = {
  title: "Personalised Solar Proposal | Solar Direct",
  description: "Discover how much you could save with a personalised solar and battery proposal from Solar Direct."
};

export default function SolarProposalPage() {
  return <SolarProposalFunnel />;
}
