# NeoTravel — intégration

## 1. Fichiers (à copier dans le repo, en écrasant les existants)

```
app/
  layout.tsx              ← fontes + bug font corrigé
  globals.css             ← tokens v1 (landing) + DA v2 (slate/lime/sémantiques)
  page.tsx                ← landing (CTA -> /devis)
  devis/page.tsx          ← NOUVEAU : funnel immersif plein écran
  api/chat/route.ts       ← proxy n8n, réponse STRUCTURÉE { reply, itineraire?, devis? }

components/
  landing/                ← Hero, HowItWorks (inchangés)
  chat/                   ← chat de la landing (inchangé)
  devis/
    DevisHeader.tsx        DevisShell.tsx
    chat/  DevisChat.tsx  ChatThread.tsx  DevisComposer.tsx
           injected/  VehiculeChoice.tsx  DevisCard.tsx
    map/   MapPanel.tsx  RouteMap.tsx  MapMarker.tsx  MarkerTooltip.tsx  etapeStyle.ts

lib/
  chat/    types.ts  useChat.ts          ← landing
  devis/   types.ts  useDevis.ts  demoItineraire.ts   ← funnel

n8n/
  calculer_devis.js       ← RÉFÉRENCE nœud Code n8n (PAS du front)
package.json              ← ajoute lucide-react
```

## 2. À SUPPRIMER du repo
```
pages/                       (api/devis.js, api/n8n-webhook.js)
utils/calculer_devis.js
components/ChatInterface.jsx
```

## 3. Dépendance
`lucide-react` a été ajouté à package.json. Après copie : `npm install`.

## 4. Contrat n8n (réponse de /api/chat)
```json
{
  "reply": "Voici votre estimation…",
  "itineraire": {
    "type": "aller",                 // "aller" | "circuit"
    "distanceKm": 465,
    "dureeConduite": "4 h 35",
    "etapes": [
      { "id": "e1", "type": "depart",      "label": "Paris", "x": 42, "y": 22, "heure": "08:00", "rse": "…" },
      { "id": "e2", "type": "pause",       "label": "Beaune","x": 55, "y": 55, "heure": "10:30", "rse": "Pause 45 min RSE…" },
      { "id": "e3", "type": "destination", "label": "Lyon",  "x": 63, "y": 82, "heure": "12:35" }
    ]
  },
  "devis": { "montant_ht": 1290, "montant_ttc": 1419, "vehicule": "Autocar standard", "rseConforme": true }
}
```
- `type` d'étape ∈ depart | etape | pause | nuitee | destination → couleur + icône auto.
- `x` / `y` sont des coordonnées **normalisées 0..100** (carte vectorielle abstraite, pas un GPS).
- `reply` seul suffit (itineraire/devis optionnels). La landing n'utilise que `reply`.

## 5. Démo hors-ligne
`/devis` s'ouvre avec un itinéraire de démo (Paris→Lyon + pause RSE) et un parcours
véhicule→devis scénarisé (`useDevis.confirmVehicule`), pour la soutenance sans n8n.
⚠️ Le devis de démo est statique : en prod il vient de n8n. Ne jamais chiffrer côté front.

## 6. Lancer
```bash
npm install
npm run dev
```
