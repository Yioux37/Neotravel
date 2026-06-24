import Link from "next/link";
import { Bus } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 px-6 pb-10 pt-16 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 md:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <Bus className="h-6 w-6 text-lime-400" aria-hidden />
            Neo<span className="text-lime-400">Travel</span>
          </Link>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-400">
            <Link href="/devis" className="transition-colors hover:text-lime-400">
              Demander un devis
            </Link>
            <a href="#" className="transition-colors hover:text-lime-400">
              Mentions légales
            </a>
            <a href="#" className="transition-colors hover:text-lime-400">
              CGV
            </a>
            <a href="#" className="transition-colors hover:text-lime-400">
              Confidentialité
            </a>
            <a href="#" className="transition-colors hover:text-lime-400">
              Contact
            </a>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-500">
          © 2026 NeoTravel — L&apos;autocariste assisté par intelligence
          artificielle.
        </p>
      </div>
    </footer>
  );
}
