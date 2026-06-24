"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function AutocarPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans">
      <LandingHeader />
      <main>
        <section className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0F19] to-[#0B0F19] pt-12 pb-20 border-b border-slate-800/60">
          <div className="mx-auto max-w-6xl px-6">
            <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-slate-300 transition-colors">Accueil</Link><span>»</span><span className="text-slate-300">Autocar Standard</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-500/10 px-3 py-1 text-xs font-medium text-lime-400 mb-4 border border-lime-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />Notre flotte
            </span>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-display">Autocar Standard</h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-6">Le véhicule de référence pour les voyages de groupe. Capacité maximale et solutions longue distance pour voyager en toute sérénité.</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {["49 à 63 places", "Longue distance", "Idéal séminaires"].map((tag) => (
                <span key={tag} className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-300 border border-slate-800">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/devis" className="rounded-full bg-[#D4FF3A] hover:bg-[#c2eb30] px-6 py-3 text-sm font-semibold text-black transition-all shadow-lg shadow-lime-500/10">Demander un devis</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400 block mb-2">Guide véhicule</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Quand choisir un autocar ?</h2>
              <div className="text-slate-400 space-y-4 leading-relaxed">
                <p>C'est le format classique et incontournable. Il est conçu pour les trajets longs, les voyages d'affaires, les comités d'entreprise (CE) ou les grands circuits touristiques.</p>
                <p>Il offre un espace en soute très important pour les longs séjours.</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 border border-slate-800 sticky top-6">
            <h3 className="text-xl font-bold text-white mb-2">Préparer votre devis</h3>
            <div className="space-y-4 mb-6 mt-6">
              {[
                { label: "Capacité", val: "49 à 63 places" },
                { label: "Idéal pour", val: "Séminaires, CE, grands groupes, Europe" },
                { label: "Trajets", val: "National et international" },
                { label: "Bagages", val: "Grandes soutes pour valises" }
              ].map((spec, idx) => (
                <div key={idx} className="border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
                  <span className="text-[10px] font-bold text-lime-400 uppercase block mb-0.5">{spec.label}</span>
                  <span className="text-sm text-slate-300">{spec.val}</span>
                </div>
              ))}
            </div>
            <Link href="/devis" className="w-full inline-flex justify-center rounded-xl bg-[#D4FF3A] hover:bg-[#c2eb30] py-3 text-sm font-semibold text-black transition-all">Demander un devis</Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
