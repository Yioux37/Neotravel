import type { Metadata } from "next";
import { DevisHeader } from "@/components/devis/DevisHeader";
import { DevisShell } from "@/components/devis/DevisShell";

export const metadata: Metadata = {
  title: "Votre devis en direct — NeoTravel",
  description:
    "Construisez votre devis autocar en conversation. L'itinéraire et les contraintes RSE s'affichent en temps réel.",
};

// Next 16 : searchParams est asynchrone. On récupère la demande pré-remplie
// depuis la landing (?q=...) pour amorcer la conversation.
export default async function DevisPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DevisHeader />
      <DevisShell initialQuery={q ?? null} />
    </div>
  );
}
