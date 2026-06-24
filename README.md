# NeoTravel

Autocariste assisté par IA. Le prospect décrit son trajet en conversation,
l'agent calcule un devis et le renvoie en PDF.

## Principe d'architecture

**L'agent décide, le code exécute.** Le front Next.js est une *interface*, pas
un cerveau : il ne contient **aucune logique métier**. Tout le calcul (pricing,
RSE, PDF, CRM, relances) vit dans **n8n**.

```
Prospect ──> Front Next.js ──(webhook)──> (Agent IA + outils) ──> Airtable
                  │                              │
            /api/chat (proxy)        Lookup · calculer_devis · PDF · CRM · relance
```

Le seul rôle réseau du front : relayer les messages vers le webhook n8n
(`app/api/chat/route.ts`) et afficher la réponse. La réponse est structurée
(`{ reply, itineraire?, devis? }`) pour piloter la carte du funnel `/devis`.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (tokens dans `app/globals.css`)
- **lucide-react** (icônes)
- Fontes : Bricolage Grotesque (display) + Geist (sans/mono)

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner N8N_WEBHOOK_URL
npm run dev                  # http://localhost:3000
```

> La page `/devis` tourne en mode démo sans n8n (itinéraire + parcours
> scénarisés). Le chat réel nécessite `N8N_WEBHOOK_URL`.

## Structure

```
app/
  page.tsx            Landing (hero + chat intégré)
  devis/page.tsx      Funnel immersif split-screen (chat IA + carte RSE)
  api/chat/route.ts   Proxy webhook vers n8n (Node runtime)
  layout.tsx · globals.css · icon.svg
components/
  landing/            Hero, HowItWorks
  chat/               Chat de la landing
  devis/              Funnel : DevisShell, chat/, map/
lib/
  chat/               Logique du chat landing
  devis/              État partagé chat↔carte (useDevis), types, démo
n8n/
  calculer_devis.js   Référence du nœud Code n8n (NE s'exécute pas dans Next)
```

## Deux surfaces de chat

- **Landing (`/`)** : palette navy/ambre, motif « ligne d'itinéraire ».
- **Funnel (`/devis`)** : DA v2 — slate-950 + lime + couleurs sémantiques de
  cartographie (RSE). Les tokens v2 sont additifs ; la landing peut être
  réalignée sur la DA v2 ultérieurement.

## Contrat n8n (réponse de `/api/chat`)

```json
{
  "reply": "Voici votre estimation…",
  "itineraire": {
    "type": "aller",
    "distanceKm": 465,
    "dureeConduite": "4 h 35",
    "etapes": [
      { "id": "e1", "type": "depart", "label": "Paris", "x": 42, "y": 22, "heure": "08:00", "rse": "…" }
    ]
  },
  "devis": { "montant_ht": 1290, "montant_ttc": 1419, "vehicule": "Autocar standard", "rseConforme": true }
}
```

`type` d'étape ∈ `depart | etape | pause | nuitee | destination`.
`x`/`y` : coordonnées normalisées 0..100 (carte vectorielle, pas un GPS).
`reply` seul suffit ; `itineraire` et `devis` sont optionnels.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `N8N_WEBHOOK_URL` | URL du webhook n8n (serveur uniquement) |
| `N8N_WEBHOOK_SECRET` | Secret partagé envoyé en en-tête `x-webhook-secret` (recommandé) |

## Modèle de branches

`front/*`, `backend/*`, `automation/*`, `docs/*` → `dev` → `main`.
Le funnel `/devis` est intégré sur `front/ui-ux`.
