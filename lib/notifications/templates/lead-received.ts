import type { Lead } from "@/lib/types";

export function leadReceivedTemplate(lead: Pick<Lead, "firstName" | "lastName" | "postcode" | "stage" | "source">) {
  const subject = `New homeowner lead in ${lead.postcode}`;
  const body = [
    `A new homeowner enquiry has been received.`,
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Postcode: ${lead.postcode}`,
    `Source: ${lead.source}`,
    `Stage: ${lead.stage}`
  ].join("\n");

  return { subject, body };
}
