"use client";

import type { ChatMessage } from "@/lib/chat/types";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`msg-in flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={[
          "max-w-[82%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
          isUser
            ? "bg-ink text-paper rounded-br-sm"
            : "bg-paper text-ink ring-1 ring-mist rounded-bl-sm",
        ].join(" ")}
      >
        {/* Préserve les retours à la ligne du devis renvoyé par l'agent */}
        <span className="whitespace-pre-wrap break-words">
          {message.content}
        </span>
      </div>
    </div>
  );
}
