"use client";

import { useState } from "react";
import { MessageSquare, Map } from "lucide-react";
import { useDevis } from "@/lib/devis/useDevis";
import { DevisChat } from "./chat/DevisChat";
import { MapPanel } from "./map/MapPanel";

type MobileView = "chat" | "carte";

export function DevisShell({ initialQuery }: { initialQuery: string | null }) {
  const {
    messages,
    itineraire,
    status,
    selectedEtapeId,
    setSelectedEtapeId,
    sendMessage,
    confirmVehicule,
  } = useDevis(initialQuery);

  const [view, setView] = useState<MobileView>("chat");
  const isSending = status === "sending";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Bascule mobile — masquée en desktop (split permanent) */}
      <div className="flex shrink-0 gap-1 border-b border-line bg-white p-1.5 lg:hidden">
        <TabButton
          active={view === "chat"}
          onClick={() => setView("chat")}
          icon={<MessageSquare className="h-4 w-4" aria-hidden />}
          label="Conversation"
        />
        <TabButton
          active={view === "carte"}
          onClick={() => setView("carte")}
          icon={<Map className="h-4 w-4" aria-hidden />}
          label="Itinéraire"
        />
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,440px)_1fr]">
        <section
          className={`min-h-0 ${view === "chat" ? "block" : "hidden"} lg:block lg:border-r lg:border-line`}
        >
          <DevisChat
            messages={messages}
            isSending={isSending}
            onSend={sendMessage}
            onConfirmVehicule={confirmVehicule}
          />
        </section>

        <section className={`min-h-0 ${view === "carte" ? "block" : "hidden"} lg:block`}>
          <MapPanel
            itineraire={itineraire}
            selectedEtapeId={selectedEtapeId}
            onSelectEtape={setSelectedEtapeId}
          />
        </section>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-colors",
        active ? "bg-night text-white" : "text-gray-500 hover:bg-gray50",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
