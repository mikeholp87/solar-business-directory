import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-950/10 bg-white/90 backdrop-blur">
      <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid size-10 place-items-center rounded-lg bg-fern text-white">
            <ShieldCheck size={22} aria-hidden />
          </span>
          <span>UKSD BUS Installers</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <Link className="px-3 py-2" href="/directory">Directory</Link>
          <Link className="px-3 py-2" href="/apply">Installer applications</Link>
          <Link className="px-3 py-2" href="/installer-dashboard">Installer login</Link>
          <Link className="button-primary" href="/directory">Find an Installer</Link>
        </nav>
      </div>
    </header>
  );
}
