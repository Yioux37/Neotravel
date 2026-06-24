import { Sparkles } from "lucide-react";
import { HeroSearchBox } from "./HeroSearchBox";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 pb-32 pt-16 text-center md:px-8">
      {/* Visuel d'ambiance + dégradés de lisibilité */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&h=1200&fit=crop')] bg-cover bg-center opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-gray-900/80 px-4 py-1.5 text-xs font-semibold text-lime-400 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" aria-hidden /> Autocars
          · pilotés par l&apos;IA
        </span>

        <h1 className="mb-4 text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl">
          Votre voyage. Planifié en quelques minutes.
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-gray-300 md:text-xl">
          Prix en direct, tout au même endroit, et un expert humain quand vous
          en avez besoin.
        </p>

        <HeroSearchBox />

        <p className="mt-8 flex items-center gap-1.5 text-xs font-medium text-gray-400">
          Découvrez comment l&apos;assistant vous aide
          <span className="animate-bounce">↓</span>
        </p>
      </div>
    </section>
  );
}
