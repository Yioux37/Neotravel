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
(`app/api/chat/route.ts`) et afficher la réponse, structurée
(`{ reply, itineraire?, devis? }`) pour piloter la carte du funnel `/devis`.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **lucide-react**
- Fontes : Bricolage Grotesque (display) + Geist (sans/mono)

## Direction artistique

Identité unique slate-950 / lime fluo (`#a3e635`) + couleurs sémantiques de
cartographie (RSE). `slate-950` est aligné sur la DA (`#0f1115`) dans
`app/globals.css`. Tokens du funnel : `--color-night`, `--color-lime`,
`--color-rse`, `--color-pause`, `--color-nuit`, etc.

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner N8N_WEBHOOK_URL
npm run dev                  # http://localhost:3000
```

> `/devis` tourne en mode démo sans n8n (itinéraire + parcours scénarisés).
> Le chat réel et l'amorçage depuis la landing nécessitent `N8N_WEBHOOK_URL`.

## Structure

```
app/
  page.tsx            Landing (hero + sections)
  devis/page.tsx      Funnel split-screen ; lit ?q= (searchParams async)
  api/chat/route.ts   Proxy webhook vers n8n (Node runtime)
  layout.tsx · globals.css · icon.svg
components/
  landing/            Header, Hero (+ HeroSearchBox), Reassurance, Usages,
                      Process, Fleet, Reviews, Faq, Footer
  devis/              Funnel : DevisShell, chat/, map/
lib/
  landing/content.ts  Données de la landing
  devis/              État partagé chat↔carte (useDevis), types, démo
n8n/
  calculer_devis.js   Référence du nœud Code n8n (NE s'exécute pas dans Next)
```

## Parcours

1. Landing `/` : le hero est une **barre de recherche** (glassmorphism). Saisie
   ou clic sur une suggestion / un cas d'usage → redirection vers
   `/devis?q=<demande>`.
2. Funnel `/devis` : split-screen. Gauche = chat IA (formulaires injectés dans
   le fil). Droite = carte vectorielle (tracé animé + marqueurs RSE cliquables).
   La demande `?q=` amorce automatiquement la conversation.

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
Le front (landing + funnel `/devis`) est intégré sur `front/ui-ux`.
