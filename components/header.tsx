import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-[#f7f3ea]/88 backdrop-blur">
      <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid size-10 place-items-center rounded-full bg-fern text-white shadow-soft">
            <ShieldCheck size={22} aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span>UKSD BUS Installers</span>
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-ink/55">Approved directory</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <Link className="rounded-full px-3 py-2 hover:bg-white/75" href="/directory">Directory</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/75" href="/apply">Installer applications</Link>
          <Link className="rounded-full px-3 py-2 hover:bg-white/75" href="/installer-dashboard">Installer login</Link>
          <Link className="button-primary" href="/directory">Find an Installer</Link>
        </nav>
      </div>
    </header>
  );
}
