"use client";

import dynamic from "next/dynamic";
import { Shield, Navigation, Clock, Loader2 } from "lucide-react";
import type { Itineraire } from "@/lib/devis/types";

// Import dynamique de ta NOUVELLE carte (sans erreur SSR)
const RouteMap = dynamic(
  () => import("./RouteMap").then((mod) => mod.RouteMap),
  { ssr: false }
);

interface MapPanelProps {
  itineraire: Itineraire | null;
  isCalculating: boolean; // Permet d'afficher le spinner
  selectedEtapeId?: string | null;
  onSelectEtape?: (id: string | null) => void;
}

// Helper pour formater proprement les minutes venant d'OSRM
const formatDuration = (mins: number | string | undefined) => {
  if (!mins || mins === "N/A") return '--';
  const m = Number(mins);
  if (isNaN(m)) return '--';
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${(m % 60).toString().padStart(2, '0')}`;
};

export function MapPanel({
  itineraire,
  isCalculating,
  selectedEtapeId,
  onSelectEtape,
}: MapPanelProps) {
  
  // Les données arrivent déjà toutes prêtes depuis l'IA et OSRM
  const displayDistance = itineraire?.distance;
  const displayDuration = itineraire?.duration;

  return (
    <div className="relative h-full w-full overflow-hidden bg-cloud map-grid">
      
      {/* Ambiance : halos colorés diffus de ton design */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-10 z-0 h-72 w-72 rounded-full bg-aller/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 z-0 h-80 w-80 rounded-full bg-lime/15 blur-3xl"
      />

      {/* Badge RSE (haut gauche) */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-white/95 px-3.5 py-2 shadow-xl backdrop-blur-sm pointer-events-auto">
        <Shield className="h-4 w-4 text-rse" aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-widest text-night">
          Conformité RSE assurée
        </span>
      </div>

      {/* Badge distance / durée (haut droite) dynamique */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-4 rounded-2xl border border-white/40 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-sm pointer-events-auto min-h-[44px]">
        {isCalculating ? (
          // Affichage du Loader rotatif pendant que la route se calcule
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Calcul RSE...</span>
          </div>
        ) : (
          <>
            {/* Section Kilomètres */}
            {displayDistance !== undefined && displayDistance > 0 && (
              <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-night">
                <Navigation className="h-3.5 w-3.5 text-aller" aria-hidden />
                {displayDistance} km
              </span>
            )}

            {/* Section Temps */}
            {displayDuration !== undefined && displayDuration > 0 && (
              <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-night">
                <Clock className="h-3.5 w-3.5 text-pause" aria-hidden />
                {formatDuration(displayDuration)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Carte Leaflet en fond de la vue, branchée sur les nouvelles variables */}
      <div className="absolute inset-0 z-0">
        <RouteMap 
          routeCoords={itineraire?.coords || []} 
          startPoint={itineraire?.start} 
          endPoint={itineraire?.end} 
        />
      </div>

      {/* Aide à la lecture */}
      <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-night/80 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
        Cliquez un point d&apos;arrêt pour la règle RSE
      </p>
    </div>
  );
}