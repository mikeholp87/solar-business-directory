import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/auth/session";
import { exportLeadsCsv } from "@/lib/repositories/admin";

export async function GET() {
  const user = await getCurrentSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const csv = await exportLeadsCsv();
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="leads-export.csv"'
    }
  });
}
