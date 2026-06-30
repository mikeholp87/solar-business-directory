import Link from "next/link";
import { ArrowLeft, Home, MapPinned, Search } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home", description: "Return to the homepage" },
  { href: "/directory", label: "Directory", description: "Browse all installer listings" },
  { href: "/services", label: "Services", description: "Explore service categories" },
  { href: "/apply", label: "Apply", description: "Join the directory as an installer" }
];

type ErrorPageProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  displayClassName: string;
  schemeLabel: string;
  schemeDescription: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export function ErrorPage({
  code,
  eyebrow,
  title,
  description,
  displayClassName,
  schemeLabel,
  schemeDescription,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref
}: ErrorPageProps) {
  return (
    <main className="section-band relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,166,81,0.12),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(16,42,67,0.08),_transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(16,42,67,0.12)] to-transparent" />

      <div className="container-page relative">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <section className="surface-card overflow-hidden border border-navy/10 bg-navy text-white shadow-[0_20px_60px_rgba(16,42,67,0.22)]">
            <div className="relative h-full p-6 sm:p-8 lg:p-10">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#00A651]/15 blur-3xl not-found-float" />
              <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-white/8 blur-3xl not-found-drift" />

              <p className="eyebrow border-white/10 bg-white/6 text-white/75">{eyebrow}</p>

              <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-end">
                <div>
                  <p className={`${displayClassName} text-[clamp(5rem,18vw,10rem)] leading-none tracking-[-0.08em] text-white`}>
                    {code}
                  </p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-white/45">{title}</p>
                </div>

                <div className="max-w-xl">
                  <p className="text-lg leading-8 text-white/76">{description}</p>
                </div>
              </div>

              <div className="mt-10 rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-white/45">{schemeLabel}</p>
                    <p className="mt-1 text-sm text-white/70">{schemeDescription}</p>
                  </div>
                  <MapPinned className="text-[#00A651]" size={22} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["Home", "Directory", "Services"].map((node, index) => (
                    <div key={node} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-black text-white/80">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-white">{node}</p>
                          <p className="text-xs text-white/52">Suggested next stop</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <svg
                  className="not-found-float pointer-events-none absolute right-6 top-[8.25rem] hidden h-28 w-40 text-[#00A651]/70 sm:block"
                  viewBox="0 0 160 112"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M8 56H52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
                  <path d="M52 56L86 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M52 56L86 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M52 56L86 86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="52" cy="56" r="8" stroke="currentColor" strokeWidth="2" />
                  <circle cx="86" cy="26" r="6" fill="currentColor" />
                  <circle cx="86" cy="56" r="6" fill="currentColor" />
                  <circle cx="86" cy="86" r="6" fill="currentColor" />
                </svg>
              </div>
            </div>
          </section>

          <aside className="surface-card border border-navy/10 bg-white p-6 shadow-[0_14px_40px_rgba(16,42,67,0.08)] sm:p-8">
            <p className="eyebrow">Choose a route</p>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-navy">{title}</h2>
            <p className="mt-4 text-base leading-8 text-navy/70">
              If the page is recoverable, the fastest path is usually back to the directory or the home page.
            </p>

            <div className="mt-8 grid gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-2xl border border-navy/10 bg-slate-50 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-[#00A651]/30 hover:bg-white"
                >
                  <span>
                    <span className="block text-sm font-black uppercase tracking-[0.18em] text-navy/48">{link.label}</span>
                    <span className="mt-1 block text-sm leading-6 text-navy/66">{link.description}</span>
                  </span>
                  <ArrowLeft className="rotate-180 text-navy/30 transition-transform group-hover:translate-x-1 group-hover:text-[#00A651]" size={18} />
                </Link>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryCtaHref} className="button-primary">
                <Home size={18} />
                {primaryCtaLabel}
              </Link>
              <Link href={secondaryCtaHref} className="button-secondary">
                <Search size={18} />
                {secondaryCtaLabel}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
