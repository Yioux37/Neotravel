"use client";

import { useState } from "react";
import { Send, Paperclip } from "lucide-react";

interface DevisComposerProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function DevisComposer({ onSend, disabled }: DevisComposerProps) {
  const [value, setValue] = useState("");

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-line bg-cloud px-5 py-4">
      <div className="flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-4 pr-1.5 shadow-sm focus-within:border-lime">
        <button
          type="button"
          aria-label="Joindre un fichier"
          className="grid h-9 w-9 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray50 hover:text-night"
        >
          <Paperclip className="h-4 w-4" aria-hidden />
        </button>

        <label htmlFor="devis-input" className="sr-only">
          Votre message
        </label>
        <input
          id="devis-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Aller-retour, 53 passagers, départ le 14 juin…"
          className="flex-1 bg-transparent py-2 text-[15px] text-night placeholder:text-gray-400 focus:outline-none"
        />

        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Envoyer"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime text-night transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
