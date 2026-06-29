"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DevisChatMessage, Devis, Itineraire, StructuredChatResponse } from "./types";
import { DEMO_ITINERAIRE } from "./demoItineraire";

type Status = "idle" | "sending" | "error";

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const GREETING: DevisChatMessage = {
  id: "greeting",
  role: "assistant",
  kind: "text",
  content: "Bonjour ! Configurons ensemble votre itinéraire routier.",
  createdAt: Date.now(),
  componentType: "type", // On affiche directement le choix du type au début
};

export function useDevis(initialQuery: string | null = null) {
  const [messages, setMessages] = useState<DevisChatMessage[]>(() => [GREETING]);
  const [itineraire, setItineraire] = useState<Itineraire>(DEMO_ITINERAIRE);
  const [status, setStatus] = useState<Status>("idle");
  const [currentStep, setCurrentStep] = useState<string>("type");
  
  const sessionId = useRef<string>(makeId());
  const seeded = useRef(false);

  const pushText = useCallback((role: "user" | "assistant", content: string, componentType?: any) => {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role, kind: "text", content, createdAt: Date.now(), componentType },
    ]);
  }, []);

  const pushDevisCard = useCallback((devis: Devis) => {
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: "assistant", kind: "devis", content: "", devis, createdAt: Date.now(), componentType: "final" },
    ]);
  }, []);

  // CALCUL GPS VIA OSRM
  const calculateRealRoute = useCallback(async (depart: string, arrivee: string) => {
    console.log(`🗺️ Calcul OSRM demandé : ${depart} → ${arrivee}`);
    try {
      const startRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(depart)}&format=json&limit=1`);
      const startData = await startRes.json();

      const endDest = arrivee.split(",")[0].trim();
      const endRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endDest)}&format=json&limit=1`);
      const endData = await endRes.json();

      if (startData.length > 0 && endData.length > 0) {
        const startLat = parseFloat(startData[0].lat);
        const startLon = parseFloat(startData[0].lon);
        const endLat = parseFloat(endData[0].lat);
        const endLon = parseFloat(endData[0].lon);

        const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`);
        const osrmData = await osrmRes.json();

        if (osrmData.routes && osrmData.routes.length > 0) {
          const route = osrmData.routes[0];
          const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);

          const newItineraire: Itineraire = {
            coords: coordinates,
            distance: Number((route.distance / 1000).toFixed(0)),
            duration: Math.round(route.duration / 60),
            start: { name: depart, coords: [startLat, startLon] },
            end: { name: endDest, coords: [endLat, endLon] },
          };

          setItineraire(newItineraire);
          return newItineraire;
        }
      }
      return null;
    } catch (error) {
      console.error("❌ Erreur OSRM :", error);
      return null;
    }
  }, []);

  // ENVOI DU TEXTE POST VERS L'IA
  const sendMessage = useCallback(
    async (text: string, nextStepFallback?: any) => {
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
          pushText("assistant", "L'agent est momentanément indisponible.");
          setStatus("error");
          return;
        }

        const data = (await res.json()) as StructuredChatResponse;
        
        // On détermine la prochaine étape dictée par n8n, sinon on utilise le fallback local
        const nextStep = data.componentType || nextStepFallback;
        if (nextStep) setCurrentStep(nextStep);

        if (data.reply) {
          pushText("assistant", data.reply, nextStep);
        }

        // Radar intelligent pour mettre à jour la carte en lisant la réponse ou la demande
        // 🛑 CORRECTIF DU BUG DE LA CARTE 🛑
        // On IGNORE totalement les fausses données de la carte renvoyées par le backend (Paris-Portugal)
        // On ne fait confiance qu'à notre analyse de texte et à OSRM.

        const textToAnalyze = content + " " + (data.reply || "");
        
        // Regex ultra-intelligente qui détecte :
        // 1. "de Paris à Lyon" (discussion naturelle)
        // 2. "Départ de Lyon, destination : Marseille" (phrase secrète envoyée par notre formulaire)
        const match = textToAnalyze.match(/(?:de\s+|depuis\s+|Départ de\s+)([A-Z][a-zà-ÿ\s-]+)(?:\s+(?:à|vers|pour|-)\s+|,\s*destination\s*:\s*)([A-Z][a-zà-ÿ\s-]+)/i);
        
        if (match && match[1] && match[2]) {
          console.log("📍 Trajet détecté automatiquement :", match[1].trim(), "->", match[2].trim());
          void calculateRealRoute(match[1].trim(), match[2].trim());
        }

        if (data.devis) pushDevisCard(data.devis);

        setStatus("idle");
      } catch (error) {
        pushText("assistant", "Erreur de connexion.");
        setStatus("error");
      }
    },
    [status, pushText, pushDevisCard, calculateRealRoute],
  );

  useEffect(() => {
    if (initialQuery && !seeded.current) {
      seeded.current = true;
      void sendMessage(initialQuery, "voyageurs");
    }
  }, [initialQuery, sendMessage]);

  return {
    messages,
    itineraire,
    status,
    currentStep,
    setCurrentStep,
    sendMessage,
    calculateRealRoute,
  };
}