"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🛠️ Répare le bug des icônes Leaflet invisibles dans Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// MARQUEURS STYLISÉS (A et D comme sur ton image)
const iconStart = L.divIcon({
  html: `<div class="w-7 h-7 bg-slate-800 text-white font-black rounded-full flex items-center justify-center border-2 border-white shadow-md text-xs">A</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const iconEnd = L.divIcon({
  html: `<div class="w-7 h-7 bg-emerald-500 text-white font-black rounded-full flex items-center justify-center border-2 border-white shadow-md text-xs">B</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface RouteMapProps {
  routeCoords: [number, number][];
  startPoint?: { name: string; coords: [number, number] };
  endPoint?: { name: string; coords: [number, number] };
}

function MapBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
}

export function RouteMap({ routeCoords, startPoint, endPoint }: RouteMapProps) {
  const defaultCenter: [number, number] = [46.2276, 2.2137];

  return (
    <MapContainer
      center={startPoint?.coords || defaultCenter}
      zoom={6}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* LIGNE EN POINTILLÉS NOIRS EXACTEMENT COMME TON IMAGE */}
      {routeCoords && routeCoords.length > 0 && (
        <>
          <Polyline 
            positions={routeCoords} 
            color="#3326ef" 
            weight={4} 
            opacity={0.9} 
            dashArray="8, 8" 
          />
          <MapBounds coords={routeCoords} />
        </>
      )}

      {startPoint && (
        <Marker position={startPoint.coords} icon={iconStart}>
          <Popup><strong>Départ:</strong> {startPoint.name}</Popup>
        </Marker>
      )}

      {endPoint && (
        <Marker position={endPoint.coords} icon={iconEnd}>
          <Popup><strong>Arrivée:</strong> {endPoint.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}