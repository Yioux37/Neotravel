import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export function DevisHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-white px-5">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-night"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Retour
      </Link>

      <span className="font-display text-base font-bold tracking-tight text-night">
        Neo<span className="text-lime-deep">Travel</span>
      </span>

      <span className="hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:flex">
        <Shield className="h-3.5 w-3.5 text-rse" aria-hidden />
        RSE assurée
      </span>
    </header>
  );
}
