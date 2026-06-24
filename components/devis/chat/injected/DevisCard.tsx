"use client";

import { Shield, ArrowRight } from "lucide-react";
import type { Devis } from "@/lib/devis/types";

const eur = (n: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(n);

export function DevisCard({ devis }: { devis: Devis }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-sm">
      <div className="bg-night px-5 py-4 text-white">
        <p className="text-[10px] font-bold uppercase tracking-widest text-lime">
          Votre devis
        </p>
        {devis.vehicule && (
          <p className="mt-1 text-sm text-white/70">{devis.vehicule}</p>
        )}
      </div>

      <div className="px-5 py-4">
        <div className="flex items-end justify-between">
          <span className="text-sm text-gray-500">Total TTC</span>
          <span className="font-mono text-2xl font-bold text-night">
            {eur(devis.montant_ttc)}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
          <span>dont HT</span>
          <span className="font-mono">{eur(devis.montant_ht)}</span>
        </div>

        {devis.rseConforme && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rse">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            Trajet conforme à la Réglementation Sociale Européenne
          </p>
        )}

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-night transition-transform hover:scale-[1.02]"
        >
          Recevoir le devis en PDF
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
