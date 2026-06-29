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

interface RouteMapProps {
  routeCoords: [number, number][];
  startPoint?: { name: string; coords: [number, number] };
  endPoint?: { name: string; coords: [number, number] };
}

// 🎥 Composant magique qui "cadre" la caméra sur le trajet
function MapBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      // On ajoute un padding pour que la ligne ne touche pas les bords de l'écran
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
}

export function RouteMap({ routeCoords, startPoint, endPoint }: RouteMapProps) {
  // Centre par défaut (Le centre de la France)
  const defaultCenter: [number, number] = [46.2276, 2.2137];

  return (
    <MapContainer
      center={startPoint?.coords || defaultCenter}
      zoom={6}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false} // On désactive les boutons + et - pour un design plus épuré
    >
      {/* 🗺️ Fond de carte ultra-design et clair (CartoDB Light) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* 🔵 Le tracé de la route en bleu */}
      {routeCoords && routeCoords.length > 0 && (
        <>
          <Polyline positions={routeCoords} color="#3b82f6" weight={5} opacity={0.8} />
          <MapBounds coords={routeCoords} />
        </>
      )}

      {/* 📍 Marqueur de Départ */}
      {startPoint && (
        <Marker position={startPoint.coords}>
          <Popup className="font-sans">
            <span className="font-bold text-slate-900">Départ:</span> {startPoint.name}
          </Popup>
        </Marker>
      )}

      {/* 📍 Marqueur d'Arrivée */}
      {endPoint && (
        <Marker position={endPoint.coords}>
          <Popup className="font-sans">
            <span className="font-bold text-slate-900">Arrivée:</span> {endPoint.name}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}