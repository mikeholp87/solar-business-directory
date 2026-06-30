import Link from "next/link";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/directory", label: "Directory" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/installer-dashboard", label: "Installer login" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/88">
      <div className="container-page flex min-h-16 items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <svg viewBox="0 0 36 36" width="36" height="36" fill="none" className="shrink-0">
            <rect width="36" height="36" rx="8" fill="#102A43" />
            <path d="M9 25V15l9-5.5 9 5.5v10" stroke="#00A651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 25v-7h8v7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-navy">The Renewable Directory</span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">Installer search</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link className="button-primary hidden text-sm sm:inline-flex" href="/apply">
            Apply Now
          </Link>

          <details className="group relative md:hidden">
            <summary
              className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-border bg-white text-navy transition-colors hover:bg-surface [&::-webkit-details-marker]:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={20} aria-hidden="true" />
            </summary>

            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,20rem)] overflow-hidden rounded-[22px] border border-border bg-white shadow-[0_24px_60px_rgba(16,42,67,0.14)]">
              <div className="border-b border-border bg-surface px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-navy/45">Navigation</p>
                <p className="mt-1 text-sm text-navy/66">Quick links for smaller screens.</p>
              </div>

              <nav className="grid gap-1 p-2 text-sm font-semibold">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-navy transition-colors hover:bg-surface"
                    href={link.href}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Open</span>
                  </Link>
                ))}
                <Link className="button-primary mt-1 w-full justify-center" href="/apply">
                  Apply Now
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
