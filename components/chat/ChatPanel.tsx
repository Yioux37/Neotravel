"use client";

import { useChat } from "@/lib/chat/useChat";
import { MessageList } from "./MessageList";
import { Composer } from "./Composer";

export function ChatPanel() {
  const { messages, status, sendMessage } = useChat();

  return (
    <div className="flex h-[34rem] max-h-[80vh] flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[0_24px_60px_-24px_rgba(14,27,44,0.35)] ring-1 ring-mist">
      {/* En-tête : reprend le motif itinéraire (la "ligne" du voyage) */}
      <header className="flex items-center gap-3 border-b border-mist bg-ink px-4 py-3 text-paper">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-route font-display font-bold text-ink">
          N
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold">Agent NeoTravel</p>
          <p className="flex items-center gap-1.5 text-xs text-paper/70">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            En ligne — répond en quelques secondes
          </p>
        </div>
      </header>

      <MessageList messages={messages} isSending={status === "sending"} />

      <Composer onSend={sendMessage} disabled={status === "sending"} />
    </div>
  );
}
