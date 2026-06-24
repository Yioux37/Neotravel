import type { Itineraire } from "./types";

// Itinéraire de démonstration : la carte est vivante dès l'ouverture de /devis,
// même sans n8n branché. Coordonnées en repère normalisé 0..100 (carte vectorielle
// abstraite, pas géographiquement exacte — c'est un outil de preuve, pas un GPS).
export const DEMO_ITINERAIRE: Itineraire = {
  type: "aller",
  distanceKm: 465,
  dureeConduite: "4 h 35",
  etapes: [
    {
      id: "e1",
      type: "depart",
      label: "Paris",
      x: 42,
      y: 22,
      heure: "08:00",
      rse: "Départ. Le temps de conduite continu démarre ici (max 4 h 30 avant pause obligatoire).",
    },
    {
      id: "e2",
      type: "pause",
      label: "Pause — Beaune",
      x: 55,
      y: 55,
      heure: "10:30",
      rse: "Pause chauffeur de 45 min imposée par la Réglementation Sociale Européenne après 4 h 30 de conduite.",
    },
    {
      id: "e3",
      type: "destination",
      label: "Lyon",
      x: 63,
      y: 82,
      heure: "12:35",
      rse: "Arrivée. Amplitude de la journée conforme : 4 h 35 de conduite sur la journée.",
    },
  ],
};
