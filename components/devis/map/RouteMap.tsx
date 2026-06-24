"use client";

import type { Itineraire } from "@/lib/devis/types";
import { TRACE_COLOR } from "./etapeStyle";

/**
 * Tracé vectoriel reliant les étapes. viewBox 0..100 + preserveAspectRatio="none"
 * pour que les coordonnées 0..100 des étapes correspondent exactement aux
 * marqueurs HTML positionnés en %. vector-effect évite la déformation du trait.
 */
export function RouteMap({ itineraire }: { itineraire: Itineraire }) {
  const { etapes, type } = itineraire;
  if (etapes.length < 2) return null;

  const points = etapes.map((e) => `${e.x},${e.y}`);
  // Circuit : on referme la boucle vers le départ.
  const d =
    "M " +
    points.join(" L ") +
    (type === "circuit" ? ` L ${etapes[0].x},${etapes[0].y}` : "");

  const color = TRACE_COLOR[type];

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Halo doux sous le tracé */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.12}
        vectorEffect="non-scaling-stroke"
      />
      {/* Tracé pointillé animé */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 8"
        vectorEffect="non-scaling-stroke"
        className="animate-dash"
      />
    </svg>
  );
}
