"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  DevisChatMessage,
  Devis,
  Itineraire,
  StructuredChatResponse,
} from "./types";
import { DEMO_ITINERAIRE } from "./demoItineraire";

type Status = "idle" | "sending" | "error";

// Générateur d'ID unique pour les messages du chat
function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const GREETING: DevisChatMessage = {
  id: "greeting",
  role: "assistant",
  kind: "text",
  content:
    "Voici votre trajet à droite. Choisissez un véhicule, ou précisez date et nombre de passagers — la carte se met à jour en direct.",
  createdAt: Date.now(),
};

// Initialisation des messages selon s'il y a une recherche depuis l'accueil ou non
function initialMessages(hasQuery: boolean): DevisChatMessage[] {
  if (hasQuery) return [GREETING];
  return [
    GREETING,
    { id: "ask-vehicule", role: "assistant", kind: "vehicule", createdAt: Date.now() },
  ];
}

export function useDevis(initialQuery: string | null = null) {
  // === ÉTATS ===
  const [messages, setMessages] = useState<DevisChatMessage[]>(() =>
    initialMessages(Boolean(initialQuery)),
  );
  const [itineraire, setItineraire] = useState<Itineraire>(DEMO_ITINERAIRE);
  const [status, setStatus] = useState<Status>("idle");
  const [selectedEtapeId, setSelectedEtapeId] = useState<string | null>(null);
  
  // === RÉFÉRENCES ===
  const sessionId = useRef<string>(makeId());
  const seeded = useRef(false);

  // === HELPERS D'AFFICHAGE ===
  const pushText = useCallback((role: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role, kind: "text", content, createdAt: Date.now() },
    ]);
  }, []);

  const pushDevisCard = useCallback((devis: Devis) => {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "assistant", kind: "devis", devis, createdAt: Date.now() },
    ]);
  }, []);

  // === LA FONCTION MAGIQUE : CALCUL D'ITINÉRAIRE OSRM ===
  const calculateRealRoute = useCallback(async (depart: string, arrivee: string) => {
    console.log(`🗺️ Calcul OSRM demandé : ${depart} → ${arrivee}`);
    try {
      // 1. Géocodage Ville de Départ (Nominatim)
      const startRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(depart)}&format=json&limit=1`
      );
      const startData = await startRes.json();

      // 2. Géocodage Ville d'Arrivée (Nominatim)
      const endDest = arrivee.split(",")[0].trim();
      const endRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endDest)}&format=json&limit=1`
      );
      const endData = await endRes.json();

      if (startData.length > 0 && endData.length > 0) {
        const startLat = parseFloat(startData[0].lat);
        const startLon = parseFloat(startData[0].lon);
        const endLat = parseFloat(endData[0].lat);
        const endLon = parseFloat(endData[0].lon);

        // 3. Routage réel (OSRM)
        const osrmRes = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`
        );
        const osrmData = await osrmRes.json();

        if (osrmData.routes && osrmData.routes.length > 0) {
          const route = osrmData.routes[0];
          // OSRM renvoie [lon, lat], Leaflet a besoin de [lat, lon]
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [
            coord[1],
            coord[0],
          ]);

          const newItineraire: Itineraire = {
            coords: coordinates,
            distance: Number((route.distance / 1000).toFixed(0)),
            duration: Math.round(route.duration / 60),
            start: { name: depart, coords: [startLat, startLon] },
            end: { name: endDest, coords: [endLat, endLon] },
          };

          setItineraire(newItineraire);
          console.log("✅ Itinéraire OSRM mis à jour avec succès :", newItineraire);
          return true;
        }
      }
      console.warn("⚠️ Nominatim ou OSRM n'a pas pu résoudre le trajet.");
      return false;
    } catch (error) {
      console.error("❌ Erreur lors du calcul de la route réelle :", error);
      return false;
    }
  }, []);

  // === COMMUNICATION AVEC L'IA N8N ===
  const sendMessage = useCallback(
    async (text: string) => {
      console.log("🛠️ ETAPE 1 : Déclenchement de sendMessage :", text);
      const content = text.trim();

      if (!content || status === "sending") return;

      pushText("user", content);
      setStatus("sending");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId.current, message: content }),
        });

        if (!res.ok) {
          pushText("assistant", "L'agent est momentanément indisponible. Réessayez dans un instant.");
          setStatus("error");
          return;
        }

        const data = (await res.json()) as StructuredChatResponse;
        console.log("✅ ETAPE 4 : Données reçues de n8n :", data);

        if (data.reply) pushText("assistant", data.reply);
        
        // Mise à jour de la carte (avec l'analyse intelligente du texte de l'IA)
        if (data.itineraire) {
          setItineraire(data.itineraire);
        } else {
          // On additionne ce qu'a dit le client ET ce qu'a répondu l'IA pour maximiser les chances de trouver les villes
          const textToAnalyze = content + " " + (data.reply || "");
          
          // Regex plus permissive qui gère "de X à Y", "de X vers Y", "X - Y", "X pour Y"
          const match = textToAnalyze.match(/(?:de\s+|depuis\s+)?([A-Z][a-zà-ÿ]+)\s+(?:à|vers|pour|-)\s+([A-Z][a-zà-ÿ]+)/i);
          
          if (match && match[1] && match[2]) {
            console.log("📍 Trajet détecté automatiquement :", match[1], "->", match[2]);
            void calculateRealRoute(match[1], match[2]);
          }
        }

        if (data.devis) pushDevisCard(data.devis);

        setStatus("idle");
      } catch (error) {
        console.error("❌ Connexion impossible au serveur.", error);
        pushText("assistant", "Connexion impossible pour l'instant. Vérifiez votre réseau et réessayez.");
        setStatus("error");
      }
    },
    [status, pushText, pushDevisCard, calculateRealRoute],
  );

  // === INITIALISATION AUTOMATIQUE ===
  useEffect(() => {
    if (initialQuery && !seeded.current) {
      console.log("🚀 Initialisation automatique depuis l'URL avec :", initialQuery);
      seeded.current = true;
      void sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage]);

  // === CONFIRMATION VÉHICULE (DÉMO) ===
  const confirmVehicule = useCallback(
    (label: string) => {
      pushText("user", `Véhicule : ${label}`);
      const demoDevis: Devis = {
        vehicule: label,
        montant_ht: 1290,
        montant_ttc: 1419,
        rseConforme: true,
      };
      pushText("assistant", "Voici votre estimation pour ce trajet :");
      pushDevisCard(demoDevis);
    },
    [pushText, pushDevisCard],
  );

  // === RETOUR DU HOOK ===
  return {
    messages,
    itineraire,
    status,
    selectedEtapeId,
    setSelectedEtapeId,
    sendMessage,
    confirmVehicule,
    calculateRealRoute, 
  };
}