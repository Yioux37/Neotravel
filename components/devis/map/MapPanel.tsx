"use client";

import dynamic from "next/dynamic";
import { Route, Loader2, Navigation, Clock } from "lucide-react";
import type { Itineraire } from "@/lib/devis/types";

// Import dynamique de la carte Leaflet
const RouteMap = dynamic(
  () => import("./RouteMap").then((mod) => mod.RouteMap),
  { ssr: false }
);

// Helper pour formater proprement les minutes venant d'OSRM
const formatDuration = (mins: number | string | undefined) => {
  if (!mins || mins === "N/A") return '--';
  const m = Number(mins);
  if (isNaN(m)) return '--';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)}h${(m % 60).toString().padStart(2, '0')}`;
};

interface MapPanelProps {
  itineraire: Itineraire | null;
  isCalculating: boolean;
}

export function MapPanel({ itineraire, isCalculating }: MapPanelProps) {
  const displayDistance = itineraire?.distance;
  const displayDuration = itineraire?.duration;

  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-50 map-grid">
      
      {/* Halos décoratifs en arrière-plan */}
      <div aria-hidden className="pointer-events-none absolute -left-16 top-10 z-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-10 bottom-0 z-0 h-80 w-80 rounded-full bg-lime-500/10 blur-3xl" />

      {/* BLOC TÉLÉMÉTRIE ALLONGÉ (Haut de carte) */}
      <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl px-8 py-5 border border-slate-200 shadow-xl pointer-events-auto w-full">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <Route className="w-5 h-5 text-slate-400" />
            <span className="font-bold text-xs uppercase tracking-widest text-slate-500">Analyse de l Itinéraire OSRM</span>
          </div>
          
          <div className="flex justify-between items-center px-2">
            {/* Section Distance */}
            <div className="flex flex-col">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-tight">Distance réelle</p>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <p className="text-2xl font-black text-slate-900">
                  {isCalculating ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                  ) : (
                    displayDistance && displayDistance > 0 ? `${displayDistance} km` : '--'
                  )}
                </p>
              </div>
            </div>

            {/* Séparateur visuel au milieu (optionnel) */}
            <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>

            {/* Section Temps de conduite */}
            <div className="flex flex-col text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-tight">Conduite pure</p>
              <div className="flex items-center gap-2 justify-end">
                <Clock className="w-4 h-4 text-emerald-600" />
                <p className="text-2xl font-black text-slate-900">
                  {isCalculating ? (
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                  ) : (
                    displayDuration && displayDuration > 0 ? formatDuration(displayDuration) : '--'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LA CARTE (Remplit tout l'espace) */}
      <div className="absolute inset-0 z-0">
        <RouteMap 
          routeCoords={itineraire?.coords || []} 
          startPoint={itineraire?.start} 
          endPoint={itineraire?.end} 
        />
      </div>

      {/* Aide à la lecture en bas */}
      <p className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900/80 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm shadow-lg">
        Itinéraire optimisé sans hallucination
      </p>
    </div>
  );
}