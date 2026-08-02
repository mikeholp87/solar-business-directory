import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createSolarProposalPdf } from "@/lib/solar-proposal-pdf";
import type { SolarProposal, SolarProposalInput } from "@/lib/solar-proposal";

export async function GET(_request: Request, { params }: { params: { reference: string } }) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Proposal unavailable" }, { status: 404 });
  const { data, error } = await supabase.from("solar_proposals").select("proposal_reference,input_json,calculation_json").eq("proposal_reference", params.reference).maybeSingle();
  if (error || !data) return NextResponse.json({ error: "Proposal unavailable" }, { status: 404 });
  const pdf = await createSolarProposalPdf(data.input_json as SolarProposalInput & { firstName: string; lastName: string; email: string }, data.calculation_json as SolarProposal, data.proposal_reference);
  return new NextResponse(pdf as BodyInit, { headers: { "Content-Type": "application/pdf", "Content-Disposition": `inline; filename="Solar-Proposal-${data.proposal_reference}.pdf"`, "Cache-Control": "private, max-age=300" } });
}
