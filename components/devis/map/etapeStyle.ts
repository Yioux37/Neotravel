import { MapPin, Coffee, Moon, Flag, CircleDot, type LucideIcon } from "lucide-react";
import type { EtapeType, TraceType } from "@/lib/devis/types";



interface EtapeStyle {
  /** Variable CSS de couleur sémantique (cf. globals.css DA v2) */
  color: string;
  icon: LucideIcon;
  label: string;
}

export const ETAPE_STYLE: Record<EtapeType, EtapeStyle> = {
  depart: { color: "var(--color-rse)", icon: Flag, label: "Départ" },
  etape: { color: "var(--color-aller)", icon: CircleDot, label: "Étape" },
  pause: { color: "var(--color-pause)", icon: Coffee, label: "Pause 45 min" },
  nuitee: { color: "var(--color-nuit)", icon: Moon, label: "Nuitée 11 h" },
  destination: { color: "var(--color-dest)", icon: MapPin, label: "Destination" },
};

export const TRACE_COLOR: Record<TraceType, string> = {
  aller: "var(--color-aller)",
  circuit: "var(--color-circuit)",
};
