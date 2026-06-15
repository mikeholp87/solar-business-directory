import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase";

const applicationSchema = z.object({
  company_name: z.string().min(2).max(140),
  contact_name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(6).max(40),
  website: z.string().optional(),
  company_number: z.string().optional(),
  vat_number: z.string().optional(),
  mcs_number: z.string().min(3).max(80),
  recc_number: z.string().optional(),
  hies_number: z.string().optional(),
  trustmark_number: z.string().optional(),
  monthly_install_capacity: z.coerce.number().min(0).max(200).optional(),
  survey_turnaround_days: z.coerce.number().min(0).max(90).optional(),
  areas_covered: z.string().optional(),
  notes: z.string().optional()
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = applicationSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return NextResponse.json({ error: "Invalid application details" }, { status: 400 });

  const payload = {
    ...parsed.data,
    bus_registered: formData.get("bus_registered") === "true",
    services: formData.getAll("services"),
    areas_covered: parsed.data.areas_covered?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    preferred_territories: formData.getAll("preferred_territories"),
    handles_bus_applications: formData.get("handles_bus_applications") === "true",
    completes_heat_loss_calculations: formData.get("completes_heat_loss_calculations") === "true",
    offers_solar: formData.get("offers_solar") === "true",
    offers_battery: formData.get("offers_battery") === "true",
    open_to_monthly_listing: formData.get("open_to_monthly_listing") === "true",
    open_to_pay_per_install: formData.get("open_to_pay_per_install") === "true",
    status: "pending"
  };

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("installer_applications").insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
