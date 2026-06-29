"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DevisChatMessage, Devis, Itineraire, StructuredChatResponse, ChatSession, FunnelComponentType } from "./types";
import { DEMO_ITINERAIRE } from "./demoItineraire";

type Status = "idle" | "sending" | "error";

function makeId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const GREETING = (): DevisChatMessage => ({
  id: makeId(),
  role: "assistant",
  kind: "text",
  content: "Bonjour ! Configurons ensemble votre itinéraire routier.",
  createdAt: Date.now(),
  componentType: "type",
});

export function useDevis(initialQuery: string | null = null) {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [messages, setMessages] = useState<DevisChatMessage[]>([]);
  const [itineraire, setItineraire] = useState<Itineraire>(DEMO_ITINERAIRE);
  const [currentStep, setCurrentStep] = useState<FunnelComponentType>("type");
  const [status, setStatus] = useState<Status>("idle");
  
  const sessionId = useRef<string>(makeId());
  const isLoaded = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || isLoaded.current) return;
    const saved = localStorage.getItem("neotravel_chats");
    let initialHistory: ChatSession[] = saved ? JSON.parse(saved) : [];
    
    if (initialHistory.length === 0) {
      const newId = makeId();
      const defaultChat: ChatSession = {
        id: newId,
        title: initialQuery ? initialQuery : "Nouveau projet",
        date: "À l'instant",
        status: "nouveau",
        messages: [GREETING()],
        itineraire: DEMO_ITINERAIRE,
        currentStep: "type",
      };
      initialHistory = [defaultChat];
      localStorage.setItem("neotravel_chats", JSON.stringify(initialHistory));
    }

    setHistory(initialHistory);
    const chatToActivate = initialHistory[0];
    setActiveChatId(chatToActivate.id);
    setMessages(chatToActivate.messages);
    setItineraire(chatToActivate.itineraire);
    setCurrentStep(chatToActivate.currentStep);
    sessionId.current = chatToActivate.id;
    isLoaded.current = true;
  }, [initialQuery]);

  useEffect(() => {
    if (!activeChatId || history.length === 0) return;

    setHistory((prevHistory) => {
      const updated = prevHistory.map((session) => {
        if (session.id === activeChatId) {
          let currentTitle = session.title;
          if (itineraire?.start?.name && itineraire?.end?.name) {
            currentTitle = `${itineraire.start.name} → ${itineraire.end.name}`;
          }
          return {
            ...session,
            title: currentTitle,
            messages,
            itineraire,
            currentStep,
            status: currentStep === "final" ? "devis_envoye" : "en_cours",
          };
        }
        return session;
      });
      localStorage.setItem("neotravel_chats", JSON.stringify(updated));
      return updated;
    });
  }, [messages, itineraire, currentStep, activeChatId]);

  const createNewChat = useCallback(() => {
    const newId = makeId();
    const newChat: ChatSession = {
      id: newId,
      title: "Nouveau projet",
      date: "À l'instant",
      status: "nouveau",
      messages: [GREETING()],
      itineraire: DEMO_ITINERAIRE,
      currentStep: "type",
    };
    setHistory((prev) => {
      const updated = [newChat, ...prev];
      localStorage.setItem("neotravel_chats", JSON.stringify(updated));
      return updated;
    });
    setActiveChatId(newId);
    setMessages(newChat.messages);
    setItineraire(newChat.itineraire);
    setCurrentStep(newChat.currentStep);
    sessionId.current = newId;
    setStatus("idle");
  }, []);

  const selectChat = useCallback((id: string) => {
    const target = history.find((h) => h.id === id);
    if (!target) return;
    setActiveChatId(id);
    setMessages(target.messages);
    setItineraire(target.itineraire);
    setCurrentStep(target.currentStep);
    sessionId.current = target.id;
    setStatus("idle");
  }, [history]);

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

  // === CALCUL DU TRAJET SÉCURISÉ (70 KM/H + PAUSES RSE + GESTION ALLER-RETOUR) ===
  const calculateRealRoute = useCallback(async (depart: string, arrivee: string) => {
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
          
          // Distance aller simple de base en kilomètres
          let distanceKm = Number((route.distance / 1000).toFixed(0));

          // 🔄 RECONNAISSANCE INTELLIGENTE ALLER-RETOUR
          // On vérifie si l'utilisateur a cliqué ou écrit "Aller-Retour" dans le fil de discussion
          const isAllerRetour = messages.some(m => m.content && m.content.includes("Aller-Retour"));
          
          if (isAllerRetour) {
            console.log("🔄 Type Aller-Retour détecté localement : Distance totale doublée !");
            distanceKm = distanceKm * 2;
          }

          // 🏎️ Vitesse moyenne fixe de 70 km/h pour l'autocar sur la distance totale
          const pureDurationMinutes = Math.round((distanceKm / 70) * 60);

          // 🛑 REGULATION DES PAUSES RSE : +20 min toutes les 2h (120 minutes) de conduite pure
          const numberOfBreaks = Math.floor(pureDurationMinutes / 120); 
          const breakDuration = 20; 
          
          // Durée globale finale (Conduite à 70km/h + pauses cumulées)
          const totalDurationWithBreaks = pureDurationMinutes + (numberOfBreaks * breakDuration);

          const newItineraire: Itineraire = {
            coords: coordinates, // On garde le tracé simple de l'itinéraire sur la carte
            distance: distanceKm,
            duration: totalDurationWithBreaks, 
            start: { name: depart, coords: [startLat, startLon] },
            end: { name: endDest, coords: [endLat, endLon] },
          };
          setItineraire(newItineraire);
          return newItineraire;
        }
      }
      return null;
    } catch (error) {
      console.error("❌ OSRM Error:", error);
      return null;
    }
  }, [messages]); // 💡 Ajout de messages ici pour traquer dynamiquement les choix de l'utilisateur

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
        const nextStep = data.componentType || nextStepFallback;
        if (nextStep) setCurrentStep(nextStep);

        let activeDevis = data.devis;
        let cleanReply = data.reply;

        if (!activeDevis && cleanReply && (cleanReply.includes("Montant HT") || cleanReply.includes("Montant TTC"))) {
          const htMatch = cleanReply.match(/Montant HT\s*[\*:]+\s*([0-9.,\s]+)/i) || cleanReply.match(/HT\s*:\s*([0-9.,\s]+)/i);
          const ttcMatch = cleanReply.match(/Montant TTC\s*[\*:]+\s*([0-9.,\s]+)/i) || cleanReply.match(/TTC\s*:\s*([0-9.,\s]+)/i);
          
          if (htMatch || ttcMatch) {
            activeDevis = {
              montant_ht: htMatch ? parseFloat(htMatch[1].replace(/\s/g, '').replace(',', '.')) : 0,
              montant_ttc: ttcMatch ? parseFloat(ttcMatch[1].replace(/\s/g, '').replace(',', '.')) : 0,
              vehicule: cleanReply.toLowerCase().includes("aller simple") ? "Aller Simple" : "Aller-Retour",
              rseConforme: true
            };
            cleanReply = cleanReply.split(/Montant HT|Base transfert/i)[0].trim();
          }
        }

        if (cleanReply) pushText("assistant", cleanReply, activeDevis ? "final" : nextStep);

        const textToAnalyze = content + " " + (data.reply || "");
        const match = textToAnalyze.match(/(?:de\s+|depuis\s+|Départ de\s+)([A-Z][a-zà-ÿ\s'-]+)(?:\s+(?:à|vers|pour|-)\s+|,\s*destination\s*:\s*)([A-Z][a-zà-ÿ\s'-]+)/i) ||
                      textToAnalyze.match(/entre\s+([A-Z][a-zà-ÿ\s'-]+)\s+et\s+([A-Z][a-zà-ÿ\s'-]+)/i);
        
        if (match && match[1] && match[2]) {
          void calculateRealRoute(match[1].trim(), match[2].trim());
        }

        if (activeDevis) {
          pushDevisCard(activeDevis);
          setCurrentStep("final");
        }
        setStatus("idle");
      } catch {
        pushText("assistant", "Erreur réseau.");
        setStatus("error");
      }
    },
    [status, pushText, pushDevisCard, calculateRealRoute],
  );

  return {
    messages,
    itineraire,
    status,
    currentStep,
    setCurrentStep,
    sendMessage,
    calculateRealRoute,
    history,
    activeChatId,
    createNewChat,
    selectChat,
  };
}