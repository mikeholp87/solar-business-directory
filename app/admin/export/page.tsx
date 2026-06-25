import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Export", "Download admin data exports.", "/admin/export");

export default function AdminExportPage() {
  return (
    <section className="grid gap-4">
      <div className="surface-card p-5">
        <h2 className="text-2xl font-black">Exports</h2>
        <p className="mt-2 text-sm leading-6 text-navy/65">Download lead data as CSV for finance, ops and reporting.</p>
      </div>
      <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h3 className="text-xl font-black">Lead export</h3>
          <p className="mt-1 text-sm text-navy/65">Includes stage, assignment, territory and referral fields.</p>
        </div>
        <Link className="button-primary" href="/api/admin/export">Download CSV</Link>
      </div>
    </section>
  );
}
