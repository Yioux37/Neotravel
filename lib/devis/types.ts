// Types du funnel /devis. Le chat peut injecter des composants dans le fil,
// et la carte est pilotée par un itinéraire structuré renvoyé par n8n.

/* ---------- Cartographie / RSE ---------- */

export type EtapeType = "depart" | "etape" | "pause" | "nuitee" | "destination";

export interface Etape {
  id: string;
  type: EtapeType;
  label: string;
  /** Coordonnées normalisées 0..100 dans le canevas de la carte vectorielle */
  x: number;
  y: number;
  heure?: string;
  /** Explication réglementaire révélée au clic sur le marqueur */
  rse?: string;
}

export type TraceType = "aller" | "circuit";

export interface Itineraire {
  type: TraceType;
  etapes: Etape[];
  distanceKm?: number;
  dureeConduite?: string;
}

/* ---------- Devis ---------- */

export interface Devis {
  montant_ht: number;
  montant_ttc: number;
  vehicule?: string;
  rseConforme?: boolean;
}

/* ---------- Conversation enrichie ---------- */

export type Role = "user" | "assistant";

interface BaseMessage {
  id: string;
  role: Role;
  createdAt: number;
}

/** Bulle de texte classique */
export interface TextMessage extends BaseMessage {
  kind: "text";
  content: string;
}

/** Sélecteur de véhicule injecté dans le fil */
export interface VehiculeMessage extends BaseMessage {
  kind: "vehicule";
  role: "assistant";
}

/** Carte récapitulative de devis injectée dans le fil */
export interface DevisMessage extends BaseMessage {
  kind: "devis";
  role: "assistant";
  devis: Devis;
}

export type DevisChatMessage = TextMessage | VehiculeMessage | DevisMessage;

/* ---------- Contrat avec n8n (réponse /api/chat) ---------- */

export interface StructuredChatResponse {
  reply: string;
  itineraire?: Itineraire;
  devis?: Devis;
}
