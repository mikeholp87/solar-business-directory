import Link from "next/link";

const installerLinks = [
  { label: "Solar PV installers", href: "/directory?type=Solar%20PV" },
  { label: "Battery storage installers", href: "/directory?type=Battery%20Storage" },
  { label: "Heat pump installers", href: "/directory?type=Air%20Source%20Heat%20Pump" },
  { label: "EV charger installers", href: "/directory?type=EV%20Charger" },
  { label: "Commercial renewable", href: "/directory?type=Commercial" },
];

const forInstallers = [
  { label: "Join the directory", href: "/apply" },
  { label: "Installer dashboard", href: "/installer-dashboard" },
  { label: "MCS certification guide", href: "/heat-pump-installers/wales" },
];

const legalLinks = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white" role="contentinfo">
      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-3">
              <svg viewBox="0 0 36 36" width="36" height="36" fill="none" className="shrink-0">
                <rect width="36" height="36" rx="8" fill="#00A651" />
                <path d="M9 25V15l9-5.5 9 5.5v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 25v-7h8v7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-bold leading-tight">The Renewable Directory</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Connecting homeowners with trusted MCS-certified renewable energy installers across the UK.
            </p>
          </div>

          {/* Find Installers */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">Find Installers</h2>
            <ul className="mt-4 grid gap-2.5">
              {installerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Installers */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">For Installers</h2>
            <ul className="mt-4 grid gap-2.5">
              {forInstallers.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">Legal</h2>
            <ul className="mt-4 grid gap-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} The Renewable Directory. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Follow us on Facebook"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 transition-colors hover:text-white"
              aria-label="Follow us on LinkedIn"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
