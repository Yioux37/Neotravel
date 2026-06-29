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
  // === ÉTATS DE L'HISTORIQUE ===
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // === ÉTATS DE LA CONVERSATION ACTUELLE ===
  const [messages, setMessages] = useState<DevisChatMessage[]>([]);
  const [itineraire, setItineraire] = useState<Itineraire>(DEMO_ITINERAIRE);
  const [currentStep, setCurrentStep] = useState<FunnelComponentType>("type");
  const [status, setStatus] = useState<Status>("idle");
  
  const sessionId = useRef<string>(makeId());
  const isLoaded = useRef(false);

  // 1. CHARGEMENT INITIAL DU LOCALSTORAGE (Côté Client)
  useEffect(() => {
    if (typeof window === "undefined" || isLoaded.current) return;
    
    const saved = localStorage.getItem("neotravel_chats");
    let initialHistory: ChatSession[] = saved ? JSON.parse(saved) : [];
    
    if (initialHistory.length === 0) {
      // Si l'historique est vide, on crée un premier chat par défaut
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
    // On cible le premier chat ou le plus récent
    const chatToActivate = initialHistory[0];
    setActiveChatId(chatToActivate.id);
    setMessages(chatToActivate.messages);
    setItineraire(chatToActivate.itineraire);
    setCurrentStep(chatToActivate.currentStep);
    sessionId.current = chatToActivate.id; // On aligne la session n8n sur l'ID du chat
    
    isLoaded.current = true;
  }, [initialQuery]);

  // 2. SAUVEGARDE SYNCHRONE DÈS QUE LA CONVERSATION CHANGE
  useEffect(() => {
    if (!activeChatId || history.length === 0) return;

    setHistory((prevHistory) => {
      const updated = prevHistory.map((session) => {
        if (session.id === activeChatId) {
          // Tente de deviner un titre plus intelligent si l'itinéraire est calculé
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

  // 3. ACTION : CRÉER UN NOUVEAU PROJET
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

  // 4. ACTION : SELECTIONNER UN ANCIEN CHAT
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

  // HELPERS INTERNES
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
      console.error("❌ OSRM Error:", error);
      return null;
    }
  }, []);

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

        if (data.reply) pushText("assistant", data.reply, nextStep);

        const textToAnalyze = content + " " + (data.reply || "");
        const match = textToAnalyze.match(/(?:de\s+|depuis\s+|Départ de\s+)([A-Z][a-zà-ÿ\s-]+)(?:\s+(?:à|vers|pour|-)\s+|,\s*destination\s*:\s*)([A-Z][a-zà-ÿ\s-]+)/i);
        
        if (match && match[1] && match[2]) {
          void calculateRealRoute(match[1].trim(), match[2].trim());
        }

        if (data.devis) pushDevisCard(data.devis);
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
    // Exportés pour la Sidebar !
    history,
    activeChatId,
    createNewChat,
    selectChat,
  };
}