"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function AutocarPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <LandingHeader />
      <main>
        <section className="relative pt-24 pb-32">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/autocar.jpg" alt="Autocar Standard" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gray-900/75"></div>
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <nav className="text-xs text-gray-300 mb-6 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              <span>»</span><span className="text-white font-medium">Autocar</span>
            </nav>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400 mb-4 backdrop-blur-sm border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400" /> Notre flotte
            </span>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Autocar</h1>
              <p className="text-lg text-gray-200 leading-relaxed mb-8">L'autocar de tourisme avec chauffeur est la solution de référence pour transporter un grand groupe en France ou en Europe.</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-10">
              {["49 à 63 places", "France et Europe", "Grandes soutes"].map((tag) => (
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quand choisir un autocar ?</h2>
              <div className="text-gray-600 space-y-4 leading-relaxed text-lg">
                <p>La location d'autocar avec chauffeur répond aux besoins des entreprises, comités d'entreprise, associations, groupes scolaires, BDE, clubs et organisateurs d'événements. Elle permet de centraliser le transport, de sécuriser les horaires et d'adapter le confort au trajet : transfert, sortie à la journée, circuit multi-étapes ou longue distance.</p>
                <p>L'autocar est le bon choix lorsque le groupe est nombreux, que le trajet est long ou que le volume de bagages devient important. Il offre la meilleure capacité par véhicule et simplifie la coordination : un seul point de rendez-vous, un chauffeur identifié, un programme clair et une proposition ajustée au trajet.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Capacité", value: "49 à 63", desc: "Pour la plupart des grands groupes et voyages organisés." },
                { title: "Distance", value: "Longue", desc: "Adaptable aux circuits, week-ends et trajets internationaux." },
                { title: "Bagages", value: "Soutes", desc: "Solution adaptée aux valises, sacs et matériel de groupe." }
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
                { label: "Capacité", val: "49 à 63 places, selon modèle tourisme ou grand tourisme" },
                { label: "Idéal pour", val: "CE, scolaires, séminaires, circuits" },
                { label: "Trajets", val: "France, Europe, longue distance" },
                { label: "Bagages", val: "Soutes importantes" }
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Pour quels trajets louer un autocar ?</h2>
            <p className="text-lg text-gray-500 mb-10">Des cas concrets pour choisir plus vite le bon format de transport avec chauffeur.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { t: "Voyages scolaires", d: "Sorties pédagogiques, classes découverte, séjours linguistiques et transports encadrés." },
                { t: "Comités d'entreprise", d: "Excursions, week-ends, parcs, spectacles, séjours France et Europe pour salariés et familles." },
                { t: "Séminaires et conventions", d: "Acheminement d'équipes vers hôtels, centres de congrès, sites industriels ou lieux événementiels." },
                { t: "Associations et clubs", d: "Compétitions, festivals, pèlerinages, circuits touristiques et déplacements collectifs." }
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
              {["Itinéraire complet avec villes, adresses et horaires.", "Nombre de passagers, accompagnateurs et bagages.", "Durée de mobilisation, pauses, repas chauffeur et nuitées si besoin.", "Équipements souhaités : WC, vidéo, micro, climatisation."].map((li, i) => (
                <li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 text-lime-500 shrink-0" /><span>{li}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Confort et équipements</h3>
            <p className="text-sm text-gray-500 mb-6">Confort tourisme et équipements selon modèle.</p>
            <ul className="space-y-4 text-sm text-gray-700 font-medium">
              {["Soutes à bagages", "Climatisation selon véhicule", "Micro, vidéo ou WC selon modèle", "Sièges tourisme pour trajets longs"].map((li, i) => (
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
                "Autocar pour 55 salariés vers un séminaire de deux jours.",
                "Voyage scolaire avec départ tôt, pauses et retour en soirée.",
                "Circuit associatif multi-étapes en France ou en Europe.",
                "Transport d'invités entre parking relais et événement."
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
                  { name: "Autocar double étage", cap: "Jusqu'à 93 places", ideal: "très grands groupes et événements", link: "/autocar-double-etage" },
                  { name: "Berline VTC", cap: "1 à 7 places VIP", ideal: "dirigeants, VIP, transferts premium", link: "/berline-vtc" }
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
              { q: "Quelle capacité prévoir pour un autocar ?", a: "La capacité indicative est 49 à 63 places. Elle reste confirmée selon le modèle disponible, le nombre d'accompagnateurs et le volume de bagages." },
              { q: "Le chauffeur est-il inclus dans la location ?", a: "Oui, la demande porte sur une location avec chauffeur professionnel. Le devis intègre la prestation de conduite et les contraintes horaires." },
              { q: "Pourquoi le prix n'est-il pas affiché immédiatement ?", a: "Le tarif dépend du trajet, de la date, de la durée de mobilisation, du type de véhicule et des contraintes locales. Un conseiller vérifie ces points pour éviter un prix automatique trompeur." },
              { q: "Quel délai prévoir pour réserver ?", a: "Le plus tôt possible, surtout en période de vacances scolaires, salons, mariages et grands événements. Les demandes urgentes restent étudiées selon disponibilité locale." }
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
