import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-lg font-bold tracking-tight text-ink">
          Neo<span className="text-route-deep">Travel</span>
        </span>
        <Link
          href="/devis"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          Demander un devis
        </Link>
      </header>

      <main className="flex-1">
        <Hero />
        <HowItWorks />
      </main>

      <footer className="border-t border-mist">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate">
          © {new Date().getFullYear()} NeoTravel — Devis autocar en ligne.
        </div>
      </footer>
    </>
  );
}
