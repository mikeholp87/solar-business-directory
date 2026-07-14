import Link from "next/link";
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/roles";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

const tabs = [
  ["/admin", "Overview"],
  ["/admin/applications", "Applications"],
  ["/admin/installers", "Installers"],
  ["/admin/territories", "Territories"],
  ["/admin/leads", "Leads"],
  ["/admin/reviews", "Reviews"],
  ["/admin/export", "Export"]
] as const;

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole(["admin"]);
  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Secure admin area</p>
            <h1 className="mt-2 text-4xl font-black">Admin Console</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map(([href, label]) => (
              <Link key={href} href={href} className="button-secondary">
                {label}
              </Link>
            ))}
            <Link href="/auth/signout" className="button-secondary">
              Sign out
            </Link>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
