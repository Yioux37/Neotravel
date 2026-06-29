"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";
import { TRACE_COLOR, ETAPE_STYLE } from "./etapeStyle";
import { MarkerTooltip } from "./MarkerTooltip";
import type { Itineraire, Etape } from "@/lib/devis/types";

interface WorldMapProps {
  itineraire: Itineraire;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  // Nouvelle prop pour faire remonter les calculs OSRM
  onRouteUpdate?: (distance: number, duration: number) => void;
}

const createCustomIcon = (etape: Etape, isSelected: boolean) => {
  /* ... (Garde exactement ton code actuel ici) ... */
  const style = ETAPE_STYLE[etape.type as keyof typeof ETAPE_STYLE];
  const Icon = style.icon;

  const htmlString = renderToStaticMarkup(
    <div className="relative flex flex-col items-center -translate-y-1/2">
      {isSelected && <MarkerTooltip etape={etape} />}
      <div
        className={[
          "grid h-9 w-9 place-items-center rounded-full text-white shadow-lg transition-transform duration-200",
          isSelected ? "scale-125 ring-4 ring-lime-400/70" : "",
        ].join(" ")}
        style={{ backgroundColor: style.color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="mt-1.5 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-sm backdrop-blur-sm">
        {etape.label}
      </span>
    </div>
  );

  return L.divIcon({ html: htmlString, className: "bg-transparent border-none", iconSize: [40, 60], iconAnchor: [20, 30] });
};

export default function WorldMap({ itineraire, selectedId, onSelect, onRouteUpdate }: WorldMapProps) {
  const { etapes, type } = itineraire;
  const [routePath, setRoutePath] = useState<[number, number][]>([]);

  const validEtapes = etapes.filter((e: any) => typeof e.lat === "number" && typeof e.lng === "number");
  const basePositions: [number, number][] = validEtapes.map((e: any) => [e.lat, e.lng]);
  if (type === "circuit" && basePositions.length > 0) basePositions.push([validEtapes[0].lat, validEtapes[0].lng]);

  useEffect(() => {
    if (basePositions.length < 2) return;

    const fetchRoute = async () => {
      try {
        const coordsString = basePositions.map(p => `${p[1]},${p[0]}`).join(";");
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // ---> ON REMONTE LES DONNÉES ICI <---
          if (onRouteUpdate) {
            onRouteUpdate(route.distance, route.duration);
          }

          const decodedPath = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
          setRoutePath(decodedPath);
        } else {
          setRoutePath(basePositions);
        }
      } catch (error) {
        setRoutePath(basePositions);
      }
    };

    fetchRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(basePositions)]); // On ignore le warning eslint pour onRouteUpdate

  const color = TRACE_COLOR[type];
  const bounds = basePositions.length > 0 ? L.latLngBounds(basePositions).pad(0.2) : L.latLngBounds([[42.3, -5.1], [51.1, 9.6]]);

  return (
    <MapContainer bounds={bounds} zoomControl={false} className="h-full w-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {(routePath.length > 0 || basePositions.length > 1) && (
        <Polyline positions={routePath.length > 0 ? routePath : basePositions} color={color} weight={4} dashArray="8 8" lineCap="round" lineJoin="round" />
      )}
      {validEtapes.map((etape: any) => (
        <Marker key={etape.id} position={[etape.lat, etape.lng]} icon={createCustomIcon(etape, selectedId === etape.id)} eventHandlers={{ click: () => onSelect(selectedId === etape.id ? null : etape.id) }} />
      ))}
    </MapContainer>
  );
}