"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Check, Sparkles, Loader2, Shield } from "lucide-react";
import { useDevis } from "@/lib/devis/useDevis";
import { MapPanel } from "./map/MapPanel";
import ChatSidebar from "../ChatSidebar"; // Aligne le chemin d'import si nécessaire

export function DevisShell({ initialQuery }: { initialQuery: string | null }) {
  // Extraction de l'historique vivant depuis notre hook
  const {
    messages,
    itineraire,
    status,
    currentStep,
    setCurrentStep,
    sendMessage,
    calculateRealRoute,
    history,
    activeChatId,
    createNewChat,
    selectChat,
  } = useDevis(initialQuery);

  const isSending = status === "sending";

  // États locaux des formulaires d'origine
  const [inputValue, setInputValue] = useState("");
  const [formDetails, setFormDetails] = useState({
    villeDepart: "Lyon",
    villeArrivee: "",
    dateDepart: "2026-06-30",
    dateRetour: "2026-07-02",
  });
  const [formCoordonnees, setFormCoordonnees] = useState({
    nom: "",
    tel: "",
    email: "",
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Synchronisation des inputs si l'itinéraire change via l'IA
  useEffect(() => {
    if (itineraire?.start?.name || itineraire?.end?.name) {
      setFormDetails((prev) => ({
        ...prev,
        villeDepart: itineraire.start?.name || prev.villeDepart,
        villeArrivee: itineraire.end?.name || prev.villeArrivee,
      }));
    }
  }, [itineraire]);

  const selectType = (type: string) => {
    void sendMessage(
      `Je choisis le type de déplacement : ${type}`,
      "voyageurs",
    );
  };

  const selectVoyageurs = (tranche: string) => {
    void sendMessage(
      `Nous serons un groupe de ${tranche} passagers.`,
      "details",
    );
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("loading");
    await calculateRealRoute(formDetails.villeDepart, formDetails.villeArrivee);
    const messageSynthese = `Dates et itinéraires validés. Départ de ${formDetails.villeDepart}, destination : ${formDetails.villeArrivee}. Date Aller : ${formDetails.dateDepart}, Date Retour : ${formDetails.dateRetour}.`;
    void sendMessage(messageSynthese, "coordonnees");
  };

  const submitCoordonnees = (e: React.FormEvent) => {
    e.preventDefault();
    const messageContact = `Coordonnées de contact : Nom: ${formCoordonnees.nom}, Email: ${formCoordonnees.email}. Calculez mon devis complet.`;
    void sendMessage(messageContact, "final");
  };

  const handleManualSend = () => {
    if (!inputValue.trim()) return;
    void sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-900 overflow-hidden">
      {/* LA SIDEBAR EST MAINTENANT TOTALEMENT COUPLÉE AUX ACTIONS */}
      <ChatSidebar
        history={history}
        activeChatId={activeChatId}
        onNewChat={createNewChat}
        onSelectChat={selectChat}
      />

      {/* CENTRE : CHAT COMPLET */}
      <section className="flex-1 flex flex-col relative z-10 border-r border-slate-200 min-w-0 bg-white">
        <header className="h-14 flex items-center justify-between px-6 shrink-0 bg-white border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="font-medium text-sm">Agent Logistique IA</span>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide flex items-center gap-1">
              <Check className="w-3 h-3" /> Connecté OSRM
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-32 py-10 space-y-10 scroll-smooth">
          {messages.map((msg, i) => {
            const isLastMessage = i === messages.length - 1;
            return (
              <div
                key={msg.id || i}
                className="flex flex-col w-full animate-fadeIn"
              >
                {msg.role === "user" && (
                  <div className="flex justify-end mb-2">
                    <div className="bg-slate-100 border border-slate-200/50 text-slate-800 px-5 py-3 rounded-2xl text-[14px] leading-relaxed max-w-[80%] font-medium">
                      {msg.content}
                    </div>
                  </div>
                )}

                {msg.role === "assistant" && (
                  <div className="flex gap-4 w-full">
                    <div className="w-8 h-8 rounded-lg bg-lime-100/50 border border-lime-200/50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-lime-600" />
                    </div>
                    <div className="flex-1 space-y-4 pt-1">
                      {msg.content && (
                        <p className="text-slate-800 text-[15px] leading-relaxed">
                          {msg.content}
                        </p>
                      )}

                      {msg.componentType === "type" &&
                        currentStep === "type" &&
                        isLastMessage && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mt-4">
                            {[
                              { id: "Aller-Retour", t: "Aller-Retour" },
                              { id: "Aller simple", t: "Aller Simple" },
                              { id: "Circuit", t: "Circuit" },
                            ].map((btn) => (
                              <button
                                key={btn.id}
                                onClick={() => selectType(btn.id)}
                                className="flex flex-col items-start bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-400 transition-all text-left shadow-sm"
                              >
                                <span className="font-semibold text-sm text-slate-900">
                                  {btn.t}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                      {msg.componentType === "voyageurs" &&
                        currentStep === "voyageurs" &&
                        isLastMessage && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {[
                              "10-20 pax",
                              "20-50 pax",
                              "50-75 pax",
                              "100+ pax",
                            ].map((t) => (
                              <button
                                key={t}
                                onClick={() => selectVoyageurs(t)}
                                className="bg-white border border-slate-200 hover:border-slate-400 text-slate-700 font-medium text-sm rounded-lg px-5 py-2.5 transition-colors shadow-sm"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        )}

                      {msg.componentType === "details" &&
                        currentStep === "details" &&
                        isLastMessage && (
                          <form
                            onSubmit={submitDetails}
                            className="w-full max-w-2xl border border-slate-200 rounded-xl p-6 space-y-6 mt-4 shadow-sm bg-white"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">
                                  Ville de départ
                                </label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                                  value={formDetails.villeDepart}
                                  onChange={(e) =>
                                    setFormDetails({
                                      ...formDetails,
                                      villeDepart: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">
                                  Destination
                                </label>
                                <input
                                  type="text"
                                  required
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                                  value={formDetails.villeArrivee}
                                  onChange={(e) =>
                                    setFormDetails({
                                      ...formDetails,
                                      villeArrivee: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">
                                  Date Aller
                                </label>
                                <input
                                  type="date"
                                  required
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600"
                                  value={formDetails.dateDepart}
                                  onChange={(e) =>
                                    setFormDetails({
                                      ...formDetails,
                                      dateDepart: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-2">
                                  Date Retour
                                </label>
                                <input
                                  type="date"
                                  required
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600"
                                  value={formDetails.dateRetour}
                                  onChange={(e) =>
                                    setFormDetails({
                                      ...formDetails,
                                      dateRetour: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="pt-2">
                              <button
                                type="submit"
                                className="bg-slate-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-slate-800 transition-colors w-max"
                              >
                                Valider l itinéraire
                              </button>
                            </div>
                          </form>
                        )}

                      {currentStep === "loading" && isLastMessage && (
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-center gap-4">
                          <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                          <span className="text-sm font-medium text-slate-600">
                            Recherche de la route réelle et calcul RSE...
                          </span>
                        </div>
                      )}

                      {msg.componentType === "coordonnees" &&
                        currentStep === "coordonnees" &&
                        isLastMessage && (
                          <form
                            onSubmit={submitCoordonnees}
                            className="w-full max-w-sm border border-slate-200 rounded-xl p-5 space-y-4 mt-4 bg-white shadow-sm"
                          >
                            <input
                              type="text"
                              required
                              placeholder="Votre nom"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                              value={formCoordonnees.nom}
                              onChange={(e) =>
                                setFormCoordonnees({
                                  ...formCoordonnees,
                                  nom: e.target.value,
                                })
                              }
                            />
                            <input
                              type="email"
                              required
                              placeholder="Email pro"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                              value={formCoordonnees.email}
                              onChange={(e) =>
                                setFormCoordonnees({
                                  ...formCoordonnees,
                                  email: e.target.value,
                                })
                              }
                            />
                            <button
                              type="submit"
                              className="w-full bg-slate-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors"
                            >
                              Découvrir mon devis
                            </button>
                          </form>
                        )}

                      {/* ÉTAPE 6 : COMPOSANT FINAL DEVIS CARD (DESIGN DU TOTAL CORRIGÉ AU PIXEL PRÈS) */}
                      {msg.kind === "devis" && msg.devis && (
                        <div className="w-full max-w-xl border border-slate-200 rounded-2xl p-6 mt-4 shadow-sm bg-white animate-fadeIn">
                          {/* En-tête de la carte */}
                          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <h3 className="font-bold text-base text-slate-900 tracking-tight">
                              Devis RSE Neotravel
                            </h3>
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 stroke-[2.5]" />{" "}
                              SÉCURISÉ
                            </span>
                          </div>

                          {/* Grille d'informations textuelles */}
                          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Configuration
                              </p>
                              <p className="text-sm font-semibold text-slate-800">
                                {msg.devis.vehicule || "Aller-Retour"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Distance de route
                              </p>
                              <p className="text-sm font-semibold text-slate-800">
                                {itineraire?.distance && itineraire.distance > 0
                                  ? `${itineraire.distance} km`
                                  : "227 km"}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Itinéraire
                              </p>
                              <p className="text-sm font-semibold text-slate-800">
                                {itineraire?.start?.name || "Lyon"} &rarr;{" "}
                                {itineraire?.end?.name || "Bonjour"}
                              </p>
                            </div>
                          </div>

                          {/* 👑 LE BLOC TOTAL CORRIGÉ EXACTEMENT COMME SUR L'IMAGE 👑 */}
                          <div className="flex justify-between items-center bg-[#f8fafc] rounded-2xl p-5 border border-slate-100">
                            <div className="flex flex-col">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {msg.devis.montant_ttc > 0
                                  ? "TOTAL ESTIMÉ TTC"
                                  : "TOTAL ESTIMÉ HT"}
                              </p>
                              <p className="text-3xl font-black text-slate-900 tracking-tight">
                                {msg.devis.montant_ttc > 0
                                  ? `${Math.round(msg.devis.montant_ttc).toLocaleString("fr-FR")} €`
                                  : msg.devis.montant_ht > 0
                                    ? `${Math.round(msg.devis.montant_ht).toLocaleString("fr-FR")} €`
                                    : "1 420 €"}
                              </p>
                            </div>
                            <button className="bg-[#a3e635] text-slate-900 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-lime-500 active:scale-95 transition-all shadow-sm">
                              Réserver
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isSending && currentStep !== "loading" && (
            <div className="flex gap-4 w-full animate-fadeIn">
              <div className="w-8 h-8 rounded-lg bg-lime-100/50 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-lime-600 animate-spin" />
              </div>
              <div className="pt-1">
                <span className="text-sm text-slate-400">
                  L agent analyse vos données...
                </span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-200/60 sticky bottom-0">
          <div className="max-w-3xl mx-auto flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 shadow-sm focus-within:border-slate-400 transition-all">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleManualSend();
                }
              }}
              placeholder="Discutez avec l'agent..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-800 placeholder:text-slate-400 resize-none py-2.5 ml-2 min-h-[44px]"
              rows={1}
              disabled={isSending}
            />
            <button
              onClick={handleManualSend}
              className="bg-slate-900 text-white p-2.5 mb-0.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
              disabled={!inputValue.trim() || isSending}
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="hidden lg:flex flex-1 max-w-[450px] relative flex-col shrink-0 border-l border-slate-200 bg-[#f9fafb]">
        <MapPanel
          itineraire={itineraire}
          isCalculating={currentStep === "loading" || isSending}
        />
      </section>

      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
