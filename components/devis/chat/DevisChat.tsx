"use client";

import { Sparkles } from "lucide-react";
import type { DevisChatMessage } from "@/lib/devis/types";
import { ChatThread } from "./ChatThread";
import { DevisComposer } from "./DevisComposer";

interface DevisChatProps {
  messages: DevisChatMessage[];
  isSending: boolean;
  onSend: (text: string) => void;
  onConfirmVehicule: (label: string) => void;
}

export function DevisChat({
  messages,
  isSending,
  onSend,
  onConfirmVehicule,
}: DevisChatProps) {
  return (
    <div className="flex h-full flex-col bg-cloud">
      <header className="flex items-center gap-3 border-b border-line bg-white px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-night">
          <Sparkles className="h-4 w-4 text-lime" aria-hidden />
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-night">
            Agent NeoTravel
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Devis déterministe · sans hallucination
          </p>
        </div>
      </header>

      <ChatThread
        messages={messages}
        isSending={isSending}
        onConfirmVehicule={onConfirmVehicule}
      />

      <DevisComposer onSend={onSend} disabled={isSending} />
    </div>
  );
}
