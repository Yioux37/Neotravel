"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import type { DevisChatMessage } from "@/lib/devis/types";
import { VehiculeChoice } from "./injected/VehiculeChoice";
import { DevisCard } from "./injected/DevisCard";

interface ChatThreadProps {
  messages: DevisChatMessage[];
  isSending: boolean;
  onConfirmVehicule: (label: string) => void;
}

export function ChatThread({
  messages,
  isSending,
  onConfirmVehicule,
}: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  return (
    <div
      className="flex-1 space-y-4 overflow-y-auto px-5 py-6"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.map((m) => {
        if (m.kind === "text") {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={`msg-in flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={[
                  "max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed",
                  isUser
                    ? "rounded-[1.25rem] rounded-br-md bg-night text-white"
                    : "rounded-[1.25rem] rounded-bl-md bg-white text-night ring-1 ring-line",
                ].join(" ")}
              >
                <span className="whitespace-pre-wrap break-words">{m.content}</span>
              </div>
            </div>
          );
        }

        // Composants injectés (côté assistant)
        return (
          <div key={m.id} className="msg-in max-w-[92%]">
            {m.kind === "vehicule" && (
              <VehiculeChoice onConfirm={onConfirmVehicule} />
            )}
            {m.kind === "devis" && <DevisCard devis={m.devis} />}
          </div>
        );
      })}

      {isSending && (
        <div className="msg-in flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4 animate-soft-pulse text-lime-deep" aria-hidden />
          L&apos;agent prépare votre itinéraire…
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
