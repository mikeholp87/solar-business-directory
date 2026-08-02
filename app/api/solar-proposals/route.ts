import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { createLeadFromForm } from "@/lib/repositories/leads";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { calculateSolarProposal, type SolarProposalInput } from "@/lib/solar-proposal";
import { queueEmailNotification } from "@/lib/notifications/email";
import { sendNotificationEmail } from "@/lib/notifications/resend";
import { createSolarProposalPdf } from "@/lib/solar-proposal-pdf";
import { siteUrl } from "@/lib/runtime";

const schema = z.object({
  postcode: z.string().min(3).max(12), address: z.string().min(2).max(240), propertyType: z.string().min(1), ownership: z.string().min(1),
  roofType: z.string().min(1), roofCovering: z.string().min(1), shading: z.string().min(1), orientation: z.string().min(1),
  consumptionMethod: z.enum(["annual", "monthly", "profile"]), annualConsumption: z.number().optional(), monthlySpend: z.number().optional(), householdProfile: z.string().optional(),
  futureLoads: z.array(z.string()), batteryPreference: z.string(), objective: z.string(), firstName: z.string().min(1).max(120), lastName: z.string().min(1).max(120),
  email: z.string().email(), phone: z.string().min(7).max(40), preferredContactMethod: z.string(), preferredContactTime: z.string(), consentTransactional: z.literal(true), consentMarketing: z.boolean().optional()
});

export async function POST(request: Request) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the proposal details", fields: parsed.error.flatten().fieldErrors }, { status: 400 });

  const input = parsed.data as SolarProposalInput;
  const proposal = calculateSolarProposal(input);
  const reference = `SD-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const pdf = await createSolarProposalPdf(input as SolarProposalInput & { firstName: string; lastName: string; email: string }, proposal, reference);
  const pdfUrl = `${siteUrl()}/api/solar-proposals/${encodeURIComponent(reference)}/pdf`;
  const lead = await createLeadFromForm({
    first_name: input.firstName!, last_name: input.lastName!, email: input.email!, phone: input.phone!, postcode: input.postcode,
    address: input.address, property_type: input.propertyType, monthly_bill: input.monthlySpend ? `£${input.monthlySpend}` : undefined,
    best_time_to_contact: input.preferredContactTime, interests: ["solar_proposal", ...input.futureLoads, input.batteryPreference],
    consent_contact: true, consent_marketing: input.consentMarketing ?? false, gdpr_acceptance: true, source: "solar_proposal"
  });
  if (!lead.ok) return NextResponse.json({ error: lead.error }, { status: 500 });

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase.from("solar_proposals").insert({
      proposal_reference: reference, lead_id: lead.leadId ?? null, postcode: input.postcode.toUpperCase(), address: input.address,
      input_json: input, calculation_json: proposal, status: "generated", pdf_url: pdfUrl
    });
  }

  await queueEmailNotification({
    eventType: "solar_proposal.generated",
    recipientEmail: input.email,
    recipientRole: undefined,
    subject: `Your personalised solar proposal for ${input.address}`,
    body: [
      `Hi ${input.firstName},`,
      "",
      "Your personalised Solar Direct proposal is ready.",
      `Recommended system: ${proposal.panelCount} x ${proposal.panelWattage} W panels (${proposal.solarCapacityKwp} kWp)${proposal.batteryCapacityKwh ? ` with a ${proposal.batteryCapacityKwh} kWh battery` : ""}.`,
      `Indicative installed price: £${proposal.priceRange.min.toLocaleString()}-£${proposal.priceRange.max.toLocaleString()}.`,
      `Estimated first-year saving: £${proposal.firstYearSaving.toLocaleString()}.`,
      "",
      "The next step is a complimentary remote survey to confirm the roof, specification and fixed quotation.",
      "",
      `Proposal reference: ${reference}`,
      `View your proposal online: ${pdfUrl}`
    ].join("\n"),
    payload: { reference, address: input.address, postcode: input.postcode, pdfUrl, ...proposal },
    attachments: [{ filename: `Solar-Proposal-${input.lastName}-${input.postcode.replaceAll(" ", "-")}.pdf`, content: pdf }]
  }, { sendEmail: sendNotificationEmail });

  return NextResponse.json({ ok: true, reference, proposal, email: input.email, pdfUrl });
}
