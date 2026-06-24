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

// Sans demande pré-remplie, on injecte d'emblée le sélecteur de véhicule
// (principe "formulaires dans la conversation", DA §5). Avec une demande
// venue de la landing, on laisse l'agent répondre d'abord.
function initialMessages(hasQuery: boolean): DevisChatMessage[] {
  if (hasQuery) return [GREETING];
  return [
    GREETING,
    { id: "ask-vehicule", role: "assistant", kind: "vehicule", createdAt: Date.now() },
  ];
}

/**
 * Source de vérité unique du funnel : un même état alimente le chat (gauche)
 * et la carte (droite). Le calcul reste chez n8n ; ici on n'orchestre que
 * l'affichage et la sélection.
 */
export function useDevis(initialQuery: string | null = null) {
  const [messages, setMessages] = useState<DevisChatMessage[]>(() =>
    initialMessages(Boolean(initialQuery)),
  );
  const [itineraire, setItineraire] = useState<Itineraire>(DEMO_ITINERAIRE);
  const [status, setStatus] = useState<Status>("idle");
  const [selectedEtapeId, setSelectedEtapeId] = useState<string | null>(null);
  const sessionId = useRef<string>(makeId());

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

  const sendMessage = useCallback(
    async (text: string) => {
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
          pushText(
            "assistant",
            "L'agent est momentanément indisponible. Réessayez dans un instant.",
          );
          setStatus("error");
          return;
        }

        const data = (await res.json()) as StructuredChatResponse;

        if (data.reply) pushText("assistant", data.reply);
        if (data.itineraire) setItineraire(data.itineraire);
        if (data.devis) pushDevisCard(data.devis);

        setStatus("idle");
      } catch {
        pushText(
          "assistant",
          "Connexion impossible pour l'instant. Vérifiez votre réseau et réessayez.",
        );
        setStatus("error");
      }
    },
    [status, pushText, pushDevisCard],
  );

  // Amorçage : si la landing a transmis une demande (?q=), on l'envoie une fois.
  const seeded = useRef(false);
  useEffect(() => {
    if (initialQuery && !seeded.current) {
      seeded.current = true;
      void sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage]);

  /**
   * Confirmation d'un véhicule via le composant injecté.
   * ⚠️ DÉMO : le devis ci-dessous est un exemple statique pour la soutenance.
   * En production, ces montants viennent de n8n (nœud calculer_devis) via la
   * réponse structurée { devis } — ne pas chiffrer côté front.
   */
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

  return {
    messages,
    itineraire,
    status,
    selectedEtapeId,
    setSelectedEtapeId,
    sendMessage,
    confirmVehicule,
  };
}
