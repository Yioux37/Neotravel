"use client";

import { useRef, useState } from "react";

interface ComposerProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function Composer({ onSend, disabled }: ComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function submit() {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    // Réinitialise la hauteur après envoi
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Entrée envoie, Maj+Entrée passe à la ligne.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    // Hauteur auto, plafonnée par max-h via CSS.
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  return (
    <div className="border-t border-mist bg-surface p-3">
      <div className="flex items-end gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Votre message
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Paris → Lyon, le 14 juin, 45 personnes…"
          className="flex-1 resize-none rounded-xl border border-mist bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-slate/70 focus:border-route-deep focus:outline-none"
          aria-label="Décrivez votre trajet"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="h-11 shrink-0 rounded-xl bg-route px-5 font-medium text-ink transition-colors hover:bg-route-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Envoyer
        </button>
      </div>
      <p className="mt-2 px-1 text-xs text-slate">
        Entrée pour envoyer · Maj + Entrée pour aller à la ligne
      </p>
    </div>
  );
}
