import type { Metadata } from "next";
import { DevisHeader } from "@/components/devis/DevisHeader";
import { DevisShell } from "@/components/devis/DevisShell";

export const metadata: Metadata = {
  title: "Votre devis en direct — NeoTravel",
  description:
    "Construisez votre devis autocar en conversation. L'itinéraire et les contraintes RSE s'affichent en temps réel.",
};

// Funnel immersif : occupe tout l'écran, aucune distraction, pas de footer.
export default function DevisPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DevisHeader />
      <DevisShell />
    </div>
  );
}
