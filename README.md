# NeoTravel

Autocariste assisté par IA. Le prospect décrit son trajet en conversation, l'agent calcule un devis, affiche une interface interactive et génère un tracé cartographique réel.

## Principe d'architecture

**L'agent décide, le front-end sécurise et enrichit.** Le front Next.js sert d'interface de dialogue avec l'IA via **n8n**, mais il embarque également une couche d'intelligence logistique locale (calculs RSE, télémétrie réelle et persistance) pour garantir une expérience utilisateur fluide et sans hallucination visuelle.

                ┌────────────────────────┐
                │     Prospect (UI)      │
                └───────────┬────────────┘
                            │
                    (useDevis Hook)
                            │
    ┌───────────────────────┴───────────────────────┐
    ▼                                               ▼

┌───────────────┐                               ┌───────────────┐
│  /api/chat    │                               │   OSRM API    │
│  (Proxy n8n)  │                               │ (Nominatim)   │
└───────┬───────┘                               └───────┬───────┘
│ (Webhook)                                     │
▼                                               ▼
┌───────────────┐                               ┌───────────────┐
│   Agent IA    │                               │ Tracé Réel    │
│  + Airtable   │                               │ GPS & Bornes  │
└───────────────┘                               └───────────────┘


Le front-end intercepte les messages textuels de n8n pour en extraire dynamiquement les informations financières si le bloc structuré fait défaut, évitant ainsi tout problème de rendu.

## Spécificités Logistiques & Règles Métiers (Front-end)

Pour coller aux réalités du transport par autocar et à la réglementation sociale européenne (RSE), le hook `useDevis` recalcule automatiquement la télémétrie d'après les règles suivantes :
* **Vitesse moyenne fixe :** Le temps de conduite pure est indexé sur une moyenne stricte de **70 km/h** calculée sur la distance réelle, indépendamment des estimations pour véhicules légers.
* **Pauses RSE obligatoires :** Le système injecte automatiquement **20 minutes de pause toutes les 2 heures (120 minutes)** de conduite pure calculée.
* **Gestion Aller-Retour :** Si l'utilisateur sélectionne l'option "Aller-Retour", la distance kilométrique renvoyée par OSRM est automatiquement **doublée**, et les temps de conduite ainsi que les pauses associées sont recalculés sur cette distance globale.

## Stack

* **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
* **Tailwind CSS v4** · **lucide-react**
* **Leaflet & React-Leaflet** (Cartographie OpenStreetMap open-source)
* Fontes : Bricolage Grotesque (display) + Geist (sans/mono)

## Direction artistique

Identité unique slate-950 / lime fluo (`#a3e635`) + couleurs sémantiques de cartographie. Le thème `slate-950` est configuré sur la DA (`#0f1115`) dans `app/globals.css`. 
Les marqueurs Leaflet sont personnalisés via des `divIcon` CSS épurés (Point **A** en émeraude, Point **B** en ardoise sombre) reliés par une polyline noire en pointillés (`dashArray`).

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner N8N_WEBHOOK_URL
npm run dev                  # http://localhost:3000

    /devis initialise un premier projet générique par défaut au démarrage. Le chat réel et l'interconnexion complète avec l'Agent IA nécessitent de renseigner l'adresse N8N_WEBHOOK_URL.

Structure

app/
  page.tsx            Landing (hero + sections)
  devis/page.tsx      Funnel split-screen ; lit ?q= (searchParams async)
  api/chat/route.ts   Proxy webhook vers n8n (Node runtime)
  layout.tsx · globals.css
components/
  landing/            Header, Hero, Fleet, Reviews, Faq, Footer...
  devis/              Funnel UI : DevisShell, widgets de formulaires intégrés
  components/devis/map/
    MapPanel.tsx      Panneau de télémétrie allongé (Bannière supérieure Distance & Temps)
    RouteMap.tsx      Moteur de rendu Leaflet (Tracé en pointillés, marqueurs A et B)
lib/
  devis/
    types.ts          Contrats unifiés (Itinéraire hybride OSRM/Étapes, ChatSession)
    useDevis.ts       Cerveau synchrone (localStorage, OSRM, RSE 70km/h, Parseur anti-NaN)
    demoItineraire.ts Tracé géographique par défaut

Fonctionnalités Avancées du Funnel
1. Persistance & Multi-sessions (Mémoire locale)

Toutes les discussions, l'état d'avancement dans l'entonnoir (currentStep), ainsi que les coordonnées géographiques des tracés sont sauvegardés automatiquement dans le localStorage du navigateur sous la clé neotravel_chats.

    L'utilisateur peut créer une nouvelle discussion via le bouton + Nouveau projet.

    La barre latérale permet de naviguer instantanément entre les différentes sessions historiques.

    Les projets sont renommés dynamiquement à la volée dès qu'un trajet est identifié (ex: Lyon → Marseille).

2. Parseur de Devis Robuste (Anti-NaN)

Dans le cas où l'IA répond par un bloc Markdown brut contenant les prix (ex: Montant TTC : 4 582,46 €), un intercepteur Regex nettoie la chaîne de caractères (suppression de tous les formats d'espaces typographiques, insécables ou Unicode) afin d'isoler les valeurs numériques. Il génère alors automatiquement le composant graphique carte de devis épuré avec son bouton "Réserver" sans afficher de texte brut dans le fil ni générer de mention NaN €.
3. Radar de Trajet Intelligent

La fonction sendMessage analyse en continu les entrées utilisateur et les réponses de l'IA à l'aide d'expressions régulières adaptées aux formulations naturelles ("de Lyon à...", "entre Paris et..."). Dès qu'une correspondance géographique valide est isolée, Nominatim géocode les adresses et OSRM actualise immédiatement la carte de droite.
Contrat n8n attendu (réponse de /api/chat)
JSON

{
  "reply": "Voici votre estimation...",
  "componentType": "details",
  "devis": { 
    "montant_ht": 4582.46, 
    "montant_ttc": 5040.71, 
    "vehicule": "Aller-Retour", 
    "rseConforme": true 
  }
}

Le paramètre componentType peut accepter les valeurs suivants pour forcer l'affichage d'un widget à l'écran : type | voyageurs | details | loading | coordonnees | final.