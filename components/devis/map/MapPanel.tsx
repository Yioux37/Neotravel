"use client";

import { useState } from "react";
import { Shield, Navigation, Clock } from "lucide-react";
import type { Itineraire } from "@/lib/devis/types";
import { RouteMap } from "./RouteMap";

interface MapPanelProps {
  itineraire: Itineraire;
  selectedEtapeId: string | null;
  onSelectEtape: (id: string | null) => void;
}

export function MapPanel({
  itineraire,
  selectedEtapeId,
  onSelectEtape,
}: MapPanelProps) {
  // État pour stocker les calculs en direct d'OSRM (distance en mètres, durée en secondes)
  const [routeMetrics, setRouteMetrics] = useState<{ distance: number; duration: number } | null>(null);

  // --- CALCULS ---
  // Distance : on passe de mètres à kilomètres (ou on garde la valeur par défaut)
  const displayDistance = routeMetrics 
    ? Math.round(routeMetrics.distance / 1000) 
    : itineraire.distanceKm;

  // Temps : on calcule les heures et les minutes à partir des secondes
  const hours = routeMetrics ? Math.floor(routeMetrics.duration / 3600) : null;
  const minutes = routeMetrics ? Math.round((routeMetrics.duration % 3600) / 60) : null;

  return (
    <div className="relative h-full w-full overflow-hidden bg-cloud map-grid">
      
      {/* Ambiance : halos colorés diffus */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-10 z-0 h-72 w-72 rounded-full bg-aller/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 z-0 h-80 w-80 rounded-full bg-lime/15 blur-3xl"
      />

      {/* Badge RSE (haut gauche) */}
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/40 bg-white/95 px-3.5 py-2 shadow-xl backdrop-blur-sm">
        <Shield className="h-4 w-4 text-rse" aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-widest text-night">
          Conformité RSE assurée
        </span>
      </div>

      {/* Badge distance / durée (haut droite) dynamique */}
      {(displayDistance !== undefined || routeMetrics || itineraire.dureeConduite) && (
        <div className="absolute right-5 top-5 z-10 flex items-center gap-4 rounded-2xl border border-white/40 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-sm">
          
          {/* Section Kilomètres */}
          {displayDistance !== undefined && (
            <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-night">
              <Navigation className="h-3.5 w-3.5 text-aller" aria-hidden />
              {displayDistance} km
            </span>
          )}

          {/* Section Temps */}
          {(hours !== null || itineraire.dureeConduite) && (
            <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-night">
              <Clock className="h-3.5 w-3.5 text-pause" aria-hidden />
              {routeMetrics ? (
                // Si on a les données OSRM, on formate proprement
                hours! > 0 
                  ? `${hours} h ${minutes!.toString().padStart(2, '0')}` 
                  : `${minutes} min`
              ) : (
                // Sinon on affiche le texte par défaut du mock
                itineraire.dureeConduite
              )}
            </span>
          )}
        </div>
      )}

      {/* Carte Leaflet en fond de la vue */}
      <div className="absolute inset-0 z-0">
        <RouteMap 
          itineraire={itineraire} 
          selectedId={selectedEtapeId}
          onSelect={onSelectEtape}
          onRouteUpdate={(dist, dur) => setRouteMetrics({ distance: dist, duration: dur })}
        />
      </div>

      {/* Aide à la lecture */}
      <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-night/80 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm">
        Cliquez un point d&apos;arrêt pour la règle RSE
      </p>
    </div>
  );
}