import Link from "next/link";
import { Bus } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="relative z-20 bg-slate-950 px-6 pt-6 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
        >
          <Bus className="h-6 w-6 text-lime-400" aria-hidden />
          Neo<span className="text-lime-400">Travel</span>
        </Link>

        <div className="hidden gap-8 text-sm font-medium text-gray-400 md:flex">
          <Link href="#flotte" className="transition-colors hover:text-lime-400">
            Nos autocars
          </Link>
          <Link href="#processus" className="transition-colors hover:text-lime-400">
            Comment ça marche
          </Link>
          <Link href="#usages" className="transition-colors hover:text-lime-400">
            Groupes
          </Link>
        </div>

        <Link
          href="/devis"
          className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-gray-900"
        >
          Demander un devis
        </Link>
      </nav>
    </header>
  );
}
