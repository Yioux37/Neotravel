"use client";

import type { Etape } from "@/lib/devis/types";
import { ETAPE_STYLE } from "./etapeStyle";
import { MarkerTooltip } from "./MarkerTooltip";


interface MapMarkerProps {
  etape: Etape;
  selected: boolean;
  onSelect: (id: string | null) => void;
}

export function MapMarker({ etape, selected, onSelect }: MapMarkerProps) {
  const style = ETAPE_STYLE[etape.type];
  const Icon = style.icon;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${etape.x}%`, top: `${etape.y}%` }}
    >
      <div className="relative flex flex-col items-center">
        {selected && <MarkerTooltip etape={etape} />}

        <button
          type="button"
          onClick={() => onSelect(selected ? null : etape.id)}
          aria-pressed={selected}
          aria-label={`${style.label} — ${etape.label}`}
          className={[
            "grid h-9 w-9 place-items-center rounded-full text-white shadow-lg transition-transform duration-200",
            selected ? "scale-125 ring-4 ring-lime/70" : "hover:scale-110",
          ].join(" ")}
          style={{ backgroundColor: style.color }}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </button>

        {/* Libellé sous le marqueur */}
        <span className="mt-1.5 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-night shadow-sm backdrop-blur-sm">
          {etape.label}
        </span>
      </div>
    </div>
  );
}
