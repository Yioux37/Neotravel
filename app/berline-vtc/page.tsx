"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function BerlinePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <LandingHeader />
      <main>
        <section className="relative pt-24 pb-32">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/berline.jpg" alt="Berline VTC" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gray-900/80"></div>
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <nav className="text-xs text-gray-300 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <span>»</span><span className="text-white font-medium">Berline VTC</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400 mb-4 backdrop-blur-sm border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> Notre flotte
            </span>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Berline VTC</h1>
              <p className="text-lg text-gray-200 leading-relaxed mb-8">La berline VTC avec chauffeur complète la flotte pour les transferts premium, VIP et petits comités.</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-10">
              {["1 à 7 places", "Accueil VIP", "Transfert premium"].map((tag) => (
                <span key={tag} className="rounded-md bg-black/40 backdrop-blur-md px-4 py-2 text-sm font-medium text-white border border-white/20">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/devis" className="rounded-full bg-lime-400 hover:bg-lime-500 px-8 py-3.5 text-sm font-bold text-gray-900 transition-all shadow-lg">Demander un devis</Link>
              <a href="#comparatif" className="rounded-full bg-white hover:bg-gray-100 px-8 py-3.5 text-sm font-bold text-gray-900 transition-all">Comparer la flotte</a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lime-600 block mb-2">Guide véhicule</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quand choisir une berline VTC ?</h2>
              <div className="text-gray-600 space-y-4 leading-relaxed text-lg">
                <p>La location de berline avec chauffeur s'adresse aux dirigeants, intervenants, invités VIP, équipes réduites et besoins premium. Elle peut être combinée avec un dispositif autocar ou minibus pour gérer les accueils individualisés, transferts aéroport, hôtels, gares et lieux événementiels.</p>
                <p>La berline est adaptée lorsque le confort, la discrétion, la ponctualité et l'accueil personnalisé priment sur la capacité. Pour plusieurs passagers avec bagages ou navette collective, un minibus peut être plus cohérent.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Capacité", value: "1 à 7", desc: "Berline, van ou véhicule premium selon besoin." },
                { title: "Usage", value: "VIP", desc: "Accueil personnalisé, discrétion et horaires maîtrisés." },
                { title: "Coordination", value: "Sur mesure", desc: "Peut compléter un dispositif autocar ou événement." }
              ].map((item, idx) => (
                <div key={idx} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                  <span className="text-xs font-bold text-lime-600 block mb-2 uppercase tracking-wider">{item.title}</span>
                  <span className="text-2xl font-bold text-gray-900 block mb-3">{item.value}</span>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Préparer votre devis</h3>
            <div className="space-y-5 mb-8">
              {[
                { label: "Capacité", val: "1 à 7 places VIP, selon berline, van ou gamme disponible" },
                { label: "Idéal pour", val: "dirigeants, VIP, transferts premium" },
                { label: "Trajets", val: "urbain, aéroport, événement" },
                { label: "Bagages", val: "bagages à préciser" }
              ].map((spec, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">{spec.label}</span>
                  <span className="text-sm font-medium text-gray-800">{spec.val}</span>
                </div>
              ))}
            </div>
            <Link href="/devis" className="w-full inline-flex justify-center rounded-full bg-gray-900 hover:bg-gray-800 py-4 text-sm font-bold text-white transition-all">Demander un devis</Link>
          </div>
        </section>

        <section className="bg-white py-20 border-y border-gray-100">
          <div className="mx-auto max-w-6xl px-6">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-600 block mb-2">Usages fréquents</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Pour quels trajets louer une berline VTC ?</h2>
            <p className="text-lg text-gray-500 mb-10">Des cas concrets pour choisir plus vite le bon format de transport avec chauffeur.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { t: "Transferts dirigeants", d: "Gare, aéroport, hôtel, bureau, centre de congrès ou site confidentiel." },
                { t: "Accueil VIP événementiel", d: "Prise en charge personnalisée d'intervenants, clients, artistes ou invités spéciaux." },
                { t: "Complément de flotte", d: "Gestion des arrivées décalées pendant qu'un autocar transporte le groupe principal." },
                { t: "Petits comités premium", d: "Voyages d'affaires, roadshows, rendez-vous multi-sites et déplacements confidentiels." }
              ].map((usage, idx) => (
                <div key={idx} className="rounded-2xl bg-gray-50 p-6 border border-gray-100 hover:border-lime-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="h-2 w-2 rounded-full bg-lime-500"></span>
                    <h4 className="font-bold text-gray-900">{usage.t}</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{usage.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl bg-white p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Informations à transmettre</h3>
            <p className="text-sm text-gray-500 mb-6">Plus la demande est précise, plus le devis peut être calé rapidement avec le bon véhicule et les bonnes contraintes chauffeur.</p>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
              {["Nom du passager, lieu de rendez-vous et consigne d'accueil.", "Nombre de bagages et besoin de van plutôt que berline.", "Numéro de train ou vol pour ajuster la prise en charge.", "Éventuelles contraintes de confidentialité ou de protocole."].map((li, i) => (
                <li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 text-lime-500 shrink-0" /><span>{li}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Confort et équipements</h3>
            <p className="text-sm text-gray-500 mb-6">Prestation discrète et haut de gamme.</p>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
              {["Chauffeur professionnel", "Véhicule premium selon disponibilité", "Accueil personnalisé", "Coordination possible avec transport de groupe"].map((li, i) => (
                <li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 text-lime-500 shrink-0" /><span>{li}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ce qui influence le prix</h3>
            <p className="text-sm text-gray-500 mb-6">Le prix final dépend rarement du seul nombre de kilomètres. L'amplitude, les attentes et les contraintes terrain comptent autant.</p>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
              {["Distance, durée de mobilisation et amplitude horaire.", "Date, saison, délai de réservation et disponibilité locale.", "Nombre d'arrêts, temps d'attente et complexité du programme.", "Péages, stationnement, accès urbains et contraintes de dépose."].map((li, i) => (
                <li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 text-lime-500 shrink-0" /><span>{li}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-gray-900 text-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Une demande cadrée, puis un devis ajusté</h2>
              <p className="text-lg text-gray-400">Le formulaire collecte les informations essentielles, puis un conseiller vérifie les points sensibles avant la proposition.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { step: "01", t: "Vous décrivez le trajet", d: "Type de voyage, villes, dates et capacité : nous récupérons les infos utiles sans vous faire perdre de temps." },
                { step: "02", t: "Un commercial vous rappelle", d: "Nous validons les points sensibles, les contraintes horaires et le type de véhicule le plus adapté." },
                { step: "03", t: "Vous recevez une proposition", d: "Le devis est affiné humainement avec nos partenaires, puis ajusté si votre besoin évolue." }
              ].map((step, idx) => (
                <div key={idx} className="relative p-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-400 text-gray-900 font-bold text-xl mb-6">{step.step}</div>
                  <h4 className="text-xl font-bold mb-3">{step.t}</h4>
                  <p className="text-gray-400 leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-lime-400 p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-10 items-center shadow-xl shadow-lime-200">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-gray-800 block mb-2">Exemples</span>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Demandes typiques</h3>
              <p className="text-gray-800 font-medium">Ces exemples aident à formuler votre besoin avant la demande de devis.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-900 font-bold">
              {[
                "Accueil d'un dirigeant à l'aéroport avant un séminaire.",
                "Transfert VIP entre hôtel et lieu de congrès.",
                "Roadshow d'une équipe de direction sur plusieurs sites.",
                "Véhicules premium en complément d'autocars événementiels."
              ].map((ex, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/40 backdrop-blur-sm px-4 py-3 rounded-xl">
                  <Check className="h-5 w-5 text-gray-900 flex-shrink-0" /><span>{ex}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comparatif" className="mx-auto max-w-6xl px-6 py-10 scroll-mt-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Minibus, minicar ou autocar : comment choisir ?</h2>
          <p className="text-lg text-gray-500 mb-8">Le bon véhicule dépend du nombre de voyageurs, du confort attendu, des bagages et du programme.</p>
          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-5">Véhicule</th><th className="px-6 py-5">Capacité</th><th className="px-6 py-5">Idéal pour</th><th className="px-6 py-5 text-right">Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  { name: "Minibus", cap: "8 à 25 places", ideal: "transferts, navettes, petits groupes", link: "/minibus" },
                  { name: "Minicar", cap: "25 à 35 places", ideal: "excursions, scolaires, associations", link: "/minicar" },
                  { name: "Autocar Standard", cap: "49 à 63 places", ideal: "CE, scolaires, séminaires, circuits", link: "/autocar" },
                  { name: "Autocar double étage", cap: "Jusqu'à 93 places", ideal: "très grands groupes et événements", link: "/autocar-double-etage" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-bold text-gray-900">{row.name}</td><td className="px-6 py-5 font-medium">{row.cap}</td><td className="px-6 py-5">{row.ideal}</td>
                    <td className="px-6 py-5 text-right"><Link href={row.link} className="inline-flex items-center gap-1 font-bold text-lime-600 hover:text-lime-700">Comparer <ArrowRight className="h-4 w-4" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-600 block mb-2">FAQ Véhicule</span>
            <h2 className="text-3xl font-bold text-gray-900">Questions fréquentes</h2>
            <p className="text-gray-500 mt-3">Les points à clarifier avant de choisir le bon véhicule avec chauffeur.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "Quelle capacité prévoir pour une berline VTC ?", a: "La capacité indicative est 1 à 7 places VIP. Elle reste confirmée selon le modèle disponible, le nombre d'accompagnateurs et le volume de bagages." },
              { q: "Le chauffeur est-il inclus dans la location ?", a: "Oui, la demande porte sur une location avec chauffeur professionnel. Le devis intègre la prestation de conduite et les contraintes horaires." },
              { q: "Pourquoi le prix n'est-il pas affiché immédiatement ?", a: "Le tarif dépend du trajet, de la date, de la durée de mobilisation, du type de véhicule et des contraintes locales. Un conseiller vérifie ces points pour éviter un prix automatique trompeur." },
              { q: "Quel délai prévoir pour réserver ?", a: "Le plus tôt possible, surtout en période de salons et grands événements. Les demandes urgentes restent étudiées selon disponibilité locale." }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all shadow-sm">
                  <button onClick={() => toggleFaq(idx)} className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-900 hover:text-lime-600 transition-colors">
                    <span>{faq.q}</span><ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-lime-500" : ""}`} />
                  </button>
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-40 border-t border-gray-100" : "max-h-0"}`}><p className="p-6 text-gray-600 leading-relaxed bg-gray-50">{faq.a}</p></div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
