import {
  ShieldCheck,
  Star,
  Leaf,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

export interface Reassurance {
  icon: LucideIcon;
  text: string;
}

export const REASSURANCE: Reassurance[] = [
  { icon: BadgeCheck, text: "Avis vérifiés (4.8/5 sur Trusted Shops)" },
  { icon: ShieldCheck, text: "Garantie & Assurance 10M€" },
  { icon: Star, text: "Transporteurs certifiés Capacité Pro" },
  { icon: Leaf, text: "Partenaire transition écologique (WWF)" },
];

export interface Usage {
  img: string;
  title: string;
  desc: string;
  tag: string;
}

export const USAGES: Usage[] = [
  {
    img: "https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=600&h=400&fit=crop",
    title: "Séminaire d'entreprise",
    desc: "Vos équipes transportées pour conventions et séminaires, de bout en bout.",
    tag: "Jusqu'à 85 passagers",
  },
  {
    img: "https://images.unsplash.com/photo-1626448167527-33aec453f913?w=600&h=400&fit=crop",
    title: "Voyage scolaire",
    desc: "Sorties pédagogiques et classes découvertes, en sécurité avec chauffeur dédié.",
    tag: "Écoles & collèges",
  },
  {
    img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop",
    title: "Déplacement sportif",
    desc: "Clubs et délégations conduits sur les lieux de compétition, à l'heure.",
    tag: "Clubs & compétitions",
  },
  {
    img: "https://images.unsplash.com/photo-1556704498-49037b3a4403?w=600&h=400&fit=crop",
    title: "Événement privé",
    desc: "Mariages, festivals, sorties de groupe : un autocar pour rassembler vos invités.",
    tag: "Sur-mesure",
  },
];

export interface Vehicule {
  nom: string;
  capacite: string;
  img: string;
  usages: string;
  confort: string;
  equipements: string;
}

export const FLOTTE: Vehicule[] = [
  {
    nom: "Minibus",
    capacite: "Jusqu'à 25 places",
    img: "https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/minibus.jpg",
    usages: "Navettes, petits groupes, gares.",
    confort: "Format agile avec accompagnement chauffeur.",
    equipements: "Climatisation, Soutes",
  },
  {
    nom: "Minicar",
    capacite: "25 à 35 places",
    img: "https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/minicar.jpg",
    usages: "Excursions, groupes loisirs, scolaires.",
    confort: "Bon compromis entre capacité et maniabilité.",
    equipements: "Climatisation, Micro",
  },
  {
    nom: "Autocar Standard",
    capacite: "49 à 63 places",
    img: "https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/autocar.jpg",
    usages: "Séminaires, CE, grands groupes, Europe.",
    confort: "Capacité maxi avec solutions longue distance.",
    equipements: "WC selon modèle, Vidéo, Soutes",
  },
  {
    nom: "Autocar Double Étage",
    capacite: "Jusqu'à 93 places",
    img: "https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/autocar-double-etage.jpg",
    usages: "Très grands groupes, voyages scolaires.",
    confort: "Capacité renforcée avec organisation adaptée.",
    equipements: "Grande capacité, Soutes, Confort",
  },
  {
    nom: "Berline VTC",
    capacite: "1 à 7 places VIP",
    img: "https://www.autocar-location.com/wp-content/themes/autocar-theme/assets/images/berline.jpg",
    usages: "Dirigeants, accueil VIP, transferts premium.",
    confort: "Prestation discrète et haut de gamme.",
    equipements: "Accueil personnalisé, Bagages",
  },
];

export interface Review {
  auteur: string;
  entreprise: string;
  note: number;
  text: string;
}

export const REVIEWS: Review[] = [
  {
    auteur: "Marie L.",
    entreprise: "CE Schneider Electric",
    note: 5,
    text: "Service impeccable pour notre séminaire à Annecy. Le chauffeur était extrêmement ponctuel et l'autocar d'une propreté irréprochable.",
  },
  {
    auteur: "Thomas R.",
    entreprise: "BDE Sciences Po",
    note: 5,
    text: "Rapport qualité-prix imbattable pour notre week-end d'intégration. L'assistant IA a capté toutes nos contraintes de nuit et le calcul du prix est transparent.",
  },
  {
    auteur: "Jean-Pierre M.",
    entreprise: "Association Randonnée & Nature",
    note: 5,
    text: "Cette nouvelle interface IA simplifie grandement nos demandes de circuits sans perdre le contact humain qui fait la force de Neotravel.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Comment fonctionne le calcul de mon devis ?",
    a: "Votre prix est généré exclusivement par un moteur de règles déterministe basé sur la distance, la capacité du véhicule, la saisonnalité et l'urgence. L'IA ne calcule jamais le prix elle-même pour éviter toute hallucination tarifaire.",
  },
  {
    q: "Quel est le délai de traitement d'une demande ?",
    a: "Grâce à notre infrastructure connectée, l'assistant IA qualifie et structure votre demande instantanément. Une première estimation vous est délivrée en quelques secondes, avant validation finale par un de nos agents sous 2 heures.",
  },
  {
    q: "Puis-je modifier ma demande après l'envoi ?",
    a: "Tout à fait. Une fois la demande initiée avec l'assistant, vous disposez d'un espace de suivi. Nos conseillers humains peuvent reprendre la main à tout moment.",
  },
];

export const SUGGESTIONS: string[] = [
  "Crée un nouveau voyage en autocar",
  "Organise un voyage scolaire",
  "Planifie un séminaire d'entreprise",
  "Réserve un transfert de dernière minute",
];
