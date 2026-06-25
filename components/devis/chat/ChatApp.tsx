"use client";

import { useState } from "react";
// Si tu as le type exporté, tu peux l'importer : import type { StructuredChatResponse } from "@/lib/devis/types";

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [historique, setHistorique] = useState<{ role: "user" | "agent"; text: string }[]>([]);
  const [chargement, setChargement] = useState(false);

  const envoyerMessage = async () => {
    if (!message.trim()) return;

    // 1. On affiche le message de l'utilisateur dans le chat
    setHistorique((prev) => [...prev, { role: "user", text: message }]);
    setChargement(true);
    console.log("etape1");
    
    // On garde le message en mémoire et on vide l'input
    const texteAEnvoyer = message;
    setMessage("");
    console.log("etape2");
    // ID de session (à remplacer par un vrai UUID généré pour chaque visiteur)
    const sessionId = "session-test-123";

    try {
        console.log("etape3");
      // 2. On appelle ton fichier route.ts
      const reponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: texteAEnvoyer, 
          sessionId: sessionId 
        })
      });
      console.log("etape4");
      const data = await reponse.json(); // Ceci correspond à ton StructuredChatResponse

      if (!reponse.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }
      console.log("etape5");
      // 3. On affiche la réponse de l'agent
      setHistorique((prev) => [...prev, { role: "agent", text: data.reply }]);
      
      // Ici tu pourras gérer data.itineraire et data.devis plus tard
      console.log("Données structurées reçues :", data);

    } catch (erreur) {
      console.error("Erreur :", erreur);
      setHistorique((prev) => [...prev, { role: "agent", text: "Oups, une erreur est survenue." }]);
    } finally {
      setChargement(false);
    }
  };


  return (
    <div className="flex flex-col h-[500px] max-w-md border rounded-lg overflow-hidden bg-white shadow">
      {/* Zone d'affichage des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {historique.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-black"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {chargement && <div className="text-gray-500 text-sm animate-pulse">L´agent écrit...</div>}
      </div>

      {/* Zone de saisie */}
      <div className="p-3 border-t bg-gray-50 flex gap-2">
        <input 
          type="text"
          className="flex-1 border p-2 rounded-md text-black focus:outline-none focus:border-blue-500"
          placeholder="Tapez votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && envoyerMessage()}
          disabled={chargement}
        />
        <button 
          onClick={envoyerMessage}
          disabled={chargement || !message.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}