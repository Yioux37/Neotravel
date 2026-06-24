"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { SUGGESTIONS } from "@/lib/landing/content";

/**
 * Le hero ne contient PAS un moteur de chat (il vit sur /devis). C'est une
 * barre de recherche : on saisit (ou on clique une suggestion), et on part
 * vers le funnel avec la demande pré-remplie via ?q=.
 */
export function HeroSearchBox() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go(query: string) {
    const q = query.trim();
    router.push(q ? `/devis?q=${encodeURIComponent(q)}` : "/devis");
  }

  return (
    <div className="w-full">
      {/* Barre glassmorphism */}
      <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-full border border-white/20 bg-white/95 p-2 pl-5 shadow-2xl backdrop-blur-sm">
        <Sparkles className="h-5 w-5 shrink-0 text-lime-600" aria-hidden />
        <label htmlFor="hero-search" className="sr-only">
          Décrivez votre trajet
        </label>
        <input
          id="hero-search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go(value)}
          placeholder="Paris → Lyon, 45 personnes, le 14 juin…"
          className="flex-1 bg-transparent py-2 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => go(value)}
          aria-label="Démarrer ma demande"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime-400 text-gray-900 transition-transform hover:scale-105"
        >
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Suggestions (pills) */}
      <div className="relative z-20 mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => go(text)}
            className="cursor-pointer rounded-full border border-white/10 bg-gray-900/90 px-5 py-2.5 text-xs font-semibold text-lime-400 shadow-lg transition-all duration-300 hover:border-lime-400 hover:bg-lime-400 hover:text-black md:text-sm"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
