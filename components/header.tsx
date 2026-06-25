import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/88">
      <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
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
          <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/directory">Directory</Link>
          <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/apply">Apply Now</Link>
          <Link className="rounded-lg px-3 py-2 text-navy transition-colors hover:bg-surface" href="/installer-dashboard">Installer login</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="button-primary text-sm" href="/directory">
            Find an Installer
          </Link>
        </div>
      </div>
    </header>
  );
}
