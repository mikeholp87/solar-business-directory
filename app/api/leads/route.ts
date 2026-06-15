import { NextResponse } from "next/server";
import { z } from "zod";
import { createLeadFromForm } from "@/lib/repositories/leads";

const leadSchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().min(6).max(40),
  postcode: z.string().min(3).max(12),
  address: z.string().max(240).optional(),
  homeowner_status: z.string().optional(),
  current_heating_source: z.string().optional(),
  monthly_bill: z.string().optional(),
  property_type: z.string().optional(),
  bedrooms: z.coerce.number().min(0).max(20).optional(),
  best_time_to_contact: z.string().optional(),
  consent_contact: z.literal("true"),
  gdpr_acceptance: z.literal("true"),
  preferred_installer_id: z.string().optional()
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = leadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead details" }, { status: 400 });
  const result = await createLeadFromForm({
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    postcode: parsed.data.postcode,
    address: parsed.data.address,
    homeowner_status: parsed.data.homeowner_status,
    current_heating_source: parsed.data.current_heating_source,
    monthly_bill: parsed.data.monthly_bill,
    property_type: parsed.data.property_type,
    bedrooms: parsed.data.bedrooms,
    interests: formData.getAll("interests").map(String),
    consent_contact: true,
    consent_marketing: formData.get("consent_marketing") === "true",
    gdpr_acceptance: true,
    preferred_installer_id: parsed.data.preferred_installer_id || null,
    source: parsed.data.preferred_installer_id ? "installer_profile" : "directory"
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error, assignment: result.assignment }, { status: 500 });
  }

  return NextResponse.json({ ok: true, assignment: result.assignment });
}
