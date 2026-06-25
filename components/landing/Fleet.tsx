import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FLOTTE, type Vehicule } from "@/lib/landing/content";

function VehiculeCard({ v }: { v: Vehicule }) {
  return (
    <Link 
      href={v.href} 
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-lime-400/50 hover:shadow-xl block"
    >
      <div className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.img}
          alt={v.nom}
          className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex grow flex-col p-6">
        <h3 className="mb-1 text-xl font-bold text-gray-900">{v.nom}</h3>
        <p className="mb-6 text-sm font-bold text-lime-600">{v.capacite}</p>
        <div className="grow space-y-3 text-sm text-gray-600">
          <p>
            <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-gray-800">
              Usages
            </span>
            {v.usages}
          </p>
          <p>
            <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-gray-800">
              Confort
            </span>
            {v.confort}
          </p>
          <p>
            <span className="mb-0.5 block text-xs font-bold uppercase tracking-wider text-gray-800">
              Équipements
            </span>
            {v.equipements}
          </p>
        </div>
        {/* L'ancien lien devient une simple div qui réagit au survol de la carte (group-hover) */}
        <div className="mt-6 flex w-max items-center gap-2 text-sm font-bold text-gray-900 transition-colors group-hover:text-lime-600">
          Découvrir
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

export function Fleet() {
  return (
    <section id="flotte" className="bg-gray-50 px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center md:text-left">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Des véhicules pour chaque besoin.
          </h2>
          <p className="text-sm text-gray-500 md:text-base">
            Sélectionnés par notre IA selon votre trajet et vos exigences.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {FLOTTE.slice(0, 3).map((v) => (
            <VehiculeCard key={v.nom} v={v} />
          ))}
        </div>

        <div className="mx-auto grid grid-cols-1 gap-8 md:w-2/3 md:grid-cols-2">
          {FLOTTE.slice(3, 5).map((v) => (
            <VehiculeCard key={v.nom} v={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
