"use client";

import { useCallback, useRef, useState } from "react";
import type {
  ChatMessage,
  ChatRequestBody,
  ChatResponseBody,
  ChatErrorBody,
} from "@/lib/chat/types";

type Status = "idle" | "sending" | "error";

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Bonjour ! Dites-moi votre trajet — départ, destination, date et nombre de passagers — et je vous prépare un devis.",
  createdAt: Date.now(),
};

function makeId() {
  // crypto.randomUUID est dispo dans tous les navigateurs cibles de Next 16.
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [status, setStatus] = useState<Status>("idle");
  const sessionId = useRef<string>(makeId());

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || status === "sending") return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    // Affichage optimiste du message utilisateur.
    setMessages((prev) => [...prev, userMessage]);
    setStatus("sending");

    try {
      const payload: ChatRequestBody = {
        sessionId: sessionId.current,
        message: content,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ChatResponseBody | ChatErrorBody;

      if (!res.ok || "error" in data) {
        const errorText =
          "error" in data ? data.error : "Réponse inattendue de l'agent.";
        appendAssistant(setMessages, errorText);
        setStatus("error");
        return;
      }

      appendAssistant(setMessages, data.reply);
      setStatus("idle");
    } catch {
      appendAssistant(
        setMessages,
        "Connexion impossible pour l'instant. Vérifiez votre réseau et réessayez.",
      );
      setStatus("error");
    }
  }, [status]);

  return { messages, status, sendMessage };
}

function appendAssistant(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  content: string,
) {
  setMessages((prev) => [
    ...prev,
    { id: makeId(), role: "assistant", content, createdAt: Date.now() },
  ]);
}
