import Link from "next/link";
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/roles";

export const metadata: Metadata = {
  robots: { index: false, follow: false }
};

const tabs = [
  ["/installer-dashboard", "Overview"],
  ["/installer-dashboard/profile", "Profile"],
  ["/installer-dashboard/leads", "Leads"],
  ["/installer-dashboard/documents", "Documents"],
  ["/installer-dashboard/territories", "Territories"]
] as const;

export default async function InstallerDashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireRole(["installer", "admin"]);
  return (
    <main className="section-band">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Installer login area</p>
            <h1 className="mt-2 text-4xl font-black">Installer Portal</h1>
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
