import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Création de marqueurs HTML personnalisés (Style SaaS)
const createCustomIcon = (label, colorClass) => {
  return L.divIcon({
    className: 'bg-transparent border-none',
    html: `<div class="flex flex-col items-center transform -translate-y-1/2">
             <div class="w-7 h-7 rounded-full ${colorClass} text-white flex items-center justify-center text-[12px] font-bold shadow-md border-2 border-white">${label}</div>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Auto-cadrage de la carte sur le tracé
const FitBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [bounds, map]);
  return null;
};

export default function RouteMap({ routeCoords, startPoint, endPoint }) {
  // Centre par défaut : France
  const defaultCenter = [46.2276, 2.2137];
  const bounds = routeCoords.length > 0 ? routeCoords : (startPoint && endPoint ? [startPoint.coords, endPoint.coords] : null);

  return (
    <div className="w-full h-full relative z-0 bg-[#f9fafb]">
      <MapContainer center={defaultCenter} zoom={6} zoomControl={false} style={{ height: '100%', width: '100%', background: 'transparent' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {/* Le tracé routier OSRM */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} pathOptions={{ color: '#0f1115', weight: 4, dashArray: '8 8', lineCap: 'round' }} />
        )}
        
        {/* Les marqueurs Départ et Arrivée */}
        {startPoint && (
          <Marker position={startPoint.coords} icon={createCustomIcon('D', 'bg-slate-900')} />
        )}
        {endPoint && (
          <Marker position={endPoint.coords} icon={createCustomIcon('A', 'bg-emerald-500')} />
        )}
        
        {bounds && <FitBounds bounds={bounds} />}
      </MapContainer>
    </div>
  );
}
