"use client";

import { Shield } from "lucide-react";
import type { Etape } from "@/lib/devis/types";


export function MarkerTooltip({ etape }: { etape: Etape }) {
  return (
    <div
      role="tooltip"
      className="absolute bottom-[calc(100%+12px)] left-1/2 w-60 -translate-x-1/2 rounded-2xl border border-white/40 bg-white/95 p-3.5 text-left shadow-2xl backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        {etape.heure && (
          <span className="font-mono text-xs font-bold text-night">
            {etape.heure}
          </span>
        )}
        <span className="font-display text-sm font-bold text-night">
          {etape.label}
        </span>
      </div>

      {etape.rse && (
        <div className="mt-2 flex gap-2">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rse" aria-hidden />
          <p className="text-xs leading-relaxed text-gray-600">{etape.rse}</p>
        </div>
      )}

      {/* Flèche */}
      <span
        aria-hidden
        className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/40 bg-white/95"
      />
    </div>
  );
}
