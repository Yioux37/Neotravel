"use client";

import { useState } from "react";
import { Bus, Check } from "lucide-react";

const VEHICULES = [
  { id: "minibus", label: "Minibus", capacite: "jusqu'à 19 pax" },
  { id: "standard", label: "Autocar standard", capacite: "20 à 53 pax" },
  { id: "gt", label: "Grand Tourisme", capacite: "53 pax · confort +" },
  { id: "double", label: "Double étage", capacite: "jusqu'à 87 pax" },
];

export function VehiculeChoice({
  onConfirm,
}: {
  onConfirm: (label: string) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-sm">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-night">
        <Bus className="h-4 w-4 text-lime-deep" aria-hidden />
        Quel véhicule pour ce groupe ?
      </p>

      <div className="grid grid-cols-2 gap-2">
        {VEHICULES.map((v) => {
          const active = chosen === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setChosen(v.id);
                onConfirm(v.label);
              }}
              aria-pressed={active}
              className={[
                "flex flex-col items-start rounded-2xl border p-3 text-left transition-all",
                active
                  ? "border-lime bg-lime/10 ring-2 ring-lime"
                  : "border-line hover:border-lime/60 hover:bg-gray50",
              ].join(" ")}
            >
              <span className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-night">
                  {v.label}
                </span>
                {active && <Check className="h-4 w-4 text-lime-deep" aria-hidden />}
              </span>
              <span className="mt-0.5 text-xs text-gray-500">{v.capacite}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
