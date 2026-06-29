"use client";

import { useState } from "react";
import { MessageSquare, Map as MapIcon, Check } from "lucide-react";
import { useDevis } from "@/lib/devis/useDevis";
import { DevisChat } from "./chat/DevisChat";
import { MapPanel } from "./map/MapPanel";
// Ajuste le chemin du ChatSidebar selon ton arborescence si besoin
import ChatSidebar from "../ChatSidebar"; 

type MobileView = "chat" | "carte";

// Historique factice pour la sidebar en attendant de la connecter à une vraie base de données
const INITIAL_HISTORY = [
  { id: "c1", title: "Nouveau Trajet", date: "À l'instant", status: "nouveau" }
];

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
  
  // États locaux pour empêcher la Sidebar de crasher
  const [history] = useState(INITIAL_HISTORY);
  const [activeChatId, setActiveChatId] = useState<string | null>("c1");

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* 1. SIDEBAR GAUCHE (Historique) */}
      <div className="hidden md:block">
        <ChatSidebar 
          history={history} 
          activeChatId={activeChatId} 
          onNewChat={() => {}} 
          onSelectChat={(id: string) => setActiveChatId(id)} 
        />
      </div>

      {/* 2. CENTRE : CHAT ET HEADER */}
      <section className={`flex-1 flex flex-col relative z-10 border-r border-slate-200 min-w-0 bg-white ${view === "chat" ? "flex" : "hidden lg:flex"}`}>
        
        {/* Header Designé */}
        <header className="h-14 flex items-center justify-between px-6 shrink-0 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="font-medium text-sm">Agent Logistique IA</span>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide flex items-center gap-1">
              <Check className="w-3 h-3" /> Connecté OSRM
            </span>
          </div>
          
          {/* Bascule Mobile : Bouton "Voir Carte" */}
          <div className="flex lg:hidden gap-2">
            <button onClick={() => setView("carte")} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors">
              <MapIcon className="w-3 h-3" /> Voir Carte
            </button>
          </div>
        </header>

        {/* Espace de discussion (Composant séparé) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <DevisChat
            messages={messages}
            isSending={isSending}
            onSend={sendMessage}
            onConfirmVehicule={confirmVehicule}
          />
        </div>
      </section>

      {/* 3. DROITE : CARTE & TÉLÉMÉTRIE */}
      <section className={`lg:flex flex-1 max-w-[450px] relative flex-col shrink-0 border-l border-slate-200 bg-[#f9fafb] ${view === "carte" ? "flex" : "hidden"}`}>
        
        {/* Bascule Mobile : Bouton "Retour Chat" */}
        <div className="lg:hidden h-14 flex items-center px-4 bg-white border-b border-slate-100 shrink-0">
          <button onClick={() => setView("chat")} className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-200 transition-colors">
            <MessageSquare className="w-3 h-3" /> Retour au Chat
          </button>
        </div>

        {/* Conteneur de la carte avec Télémétrie intégrée */}
        <MapPanel
          itineraire={itineraire}
          selectedEtapeId={selectedEtapeId}
          onSelectEtape={setSelectedEtapeId}
        />
      </section>
    </div>
  );
}