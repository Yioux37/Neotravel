"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Itineraire } from "@/lib/devis/types";

const WorldMap = dynamic(() => import("./WorldMap.tsx"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[600px] w-full items-center justify-center rounded-2xl bg-[#f8faf9] border border-slate-100">
      <span className="text-sm font-medium text-slate-500">Chargement de la carte...</span>
    </div>
  ),
});

interface RouteMapProps {
  itineraire: Itineraire;
}

export function RouteMap({ itineraire }: RouteMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (itineraire.etapes.length < 2) return null;

  // --- HACK TEMPORAIRE POUR VOIR LES POINTS ---
  // On crée une copie de l'itinéraire en forçant des coordonnées GPS 
  // en fonction du nom de la ville (label)
  const itineraireAvecGPS = {
    ...itineraire,
    etapes: itineraire.etapes.map((etape) => {
      // Regarde ce qu'il y a dans l'étape dans ta console
      console.log("Étape brute :", etape);

      let lat = 46.2276; // Centre de la France par défaut
      let lng = 2.2137;

      const labelLower = etape.label.toLowerCase();
      if (labelLower.includes("paris")) { lat = 48.8566; lng = 2.3522; }
      else if (labelLower.includes("beaune")) { lat = 47.0260; lng = 4.8390; }
      else if (labelLower.includes("lyon")) { lat = 45.7640; lng = 4.8357; }
      else if (labelLower.includes("marseille")) { lat = 43.2965; lng = 5.3698; }
      else if (labelLower.includes("bordeaux")) { lat = 44.8378; lng = -0.5792; }

      // On retourne l'étape avec les propriétés lat et lng ajoutées
      return { ...etape, lat, lng };
    })
  };
  // ---------------------------------------------

  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden rounded-2xl bg-[#f8faf9] shadow-inner">
      
      {/* On passe notre itineraire modifié avec les GPS à la carte */}
      <WorldMap 
        itineraire={itineraireAvecGPS} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />

      <div className="absolute bottom-8 left-1/2 z-[1000] -translate-x-1/2 pointer-events-none">
        <div className="whitespace-nowrap rounded-full bg-[#334155]/95 px-5 py-2.5 text-[14px] font-medium text-white shadow-xl backdrop-blur-md transition-all">
          Cliquez un point d'arrêt pour la règle RSE
        </div>
      </div>
      
    </div>
  );
}