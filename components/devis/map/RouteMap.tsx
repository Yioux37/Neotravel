"use client";

import dynamic from "next/dynamic";
import type { Itineraire } from "@/lib/devis/types";

// Chargement dynamique obligatoire pour Leaflet (qui a besoin de window)
const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-transparent">
      <span className="text-sm font-medium text-night/50">Chargement de la carte...</span>
    </div>
  ),
});

interface RouteMapProps {
  itineraire: Itineraire;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  // Fonction de callback pour remonter les calculs d'OSRM à MapPanel
  onRouteUpdate?: (distance: number, duration: number) => void;
}

export function RouteMap({ itineraire, selectedId, onSelect, onRouteUpdate }: RouteMapProps) {
  if (itineraire.etapes.length < 2) return null;

  // --- HACK GPS TEMPORAIRE ---
  // (À retirer une fois que ton backend/mock enverra directement `lat` et `lng`)
  const itineraireAvecGPS = {
    ...itineraire,
    etapes: itineraire.etapes.map((etape) => {
      let lat = (etape as any).lat || 46.2276; 
      let lng = (etape as any).lng || 2.2137;

      const labelLower = etape.label.toLowerCase();
      if (labelLower.includes("paris")) { lat = 48.8566; lng = 2.3522; }
      else if (labelLower.includes("beaune")) { lat = 47.0260; lng = 4.8390; }
      else if (labelLower.includes("lyon")) { lat = 45.7640; lng = 4.8357; }
      
      return { ...etape, lat, lng };
    })
  };
  // ---------------------------

  return (
    <WorldMap 
      itineraire={itineraireAvecGPS} 
      selectedId={selectedId} 
      onSelect={onSelect}
      onRouteUpdate={onRouteUpdate} // On fait passer la fonction au composant enfant
    />
  );
}