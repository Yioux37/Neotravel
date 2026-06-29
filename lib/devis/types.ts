/* ---------- Cartographie / RSE ---------- */

export type EtapeType = "depart" | "etape" | "pause" | "nuitee" | "destination";

export interface Etape {
  id: string;
  type: EtapeType;
  label: string;
  x: number;
  y: number;
  lat: number; 
  lng: number;
  heure?: string;
  rse?: string;
  itineraire?: string;
  ItineraireOSRM?: string;
  dist?: number;
  dur?: number;
}

export type TraceType = "aller" | "circuit";

export interface PointItineraire {
  name: string;
  coords: [number, number];
}

/** * INTERFACE ITINÉRAIRE UNIFIÉE 
 * Fusionne l'ancien système d'étapes et le nouveau tracé réel OSRM
 */
export interface Itineraire {
  type?: TraceType;
  etapes?: Etape[];
  distanceKm?: number;
  dureeConduite?: string;
  
  // Nouveaux champs requis pour le tracé réel OSRM
  coords: [number, number][]; // Tableau de coordonnées GPS [lat, lon]
  distance: number;           // Distance en km
  duration: number;           // Durée en minutes
  start?: PointItineraire;    // Point de départ
  end?: PointItineraire;      // Point d'arrivée
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

// Types des étapes du formulaire / entonnoir
export type FunnelComponentType = "type" | "voyageurs" | "details" | "loading" | "coordonnees" | "final";

interface BaseMessage {
  id: string;
  role: Role;
  createdAt: number;
  // Permet d'associer un widget/formulaire visuel à un message précis
  componentType?: FunnelComponentType; 
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
  // Permet à n'importe quel message ou réponse de n8n de forcer l'affichage d'une étape
  componentType?: FunnelComponentType; 
}