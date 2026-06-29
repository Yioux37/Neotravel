# `calculer_devis()` — Moteur de tarification déterministe

## 1. Rôle et principe

`calculer_devis()` est le **moteur de tarification** du projet Neotravel. Il transforme les caractéristiques d'un déplacement (distance, date, nombre de passagers, options) en un montant HT et TTC, accompagné d'un détail ligne par ligne.

**Règle d'or du projet :** le LLM ne calcule **jamais** le prix. L'agent conversationnel se contente de collecter les données brutes auprès du prospect (villes, date, passagers, options) ; tout le calcul est confié à cette fonction. Cela garantit des tarifs **exacts, reproductibles et auditables** : à entrées identiques, la fonction renvoie toujours le même résultat, indépendamment de toute variabilité d'un modèle de langage.

La fonction est **pure** (aucun effet de bord) et **testable en isolation**, sans IA ni connexion réseau. C'est une exigence du cahier des charges : le moteur a été codé et validé avant d'être branché à l'agent.

## 2. Entrées et sorties

### Entrées (objet `entree`)

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| `distance_km` | number | oui | Distance **aller simple** en km (> 0) |
| `date_depart` | string | oui | Date de départ, format ISO `AAAA-MM-JJ` |
| `nb_passagers` | number | oui | Nombre de passagers (> 0) |
| `aller_retour` | boolean | non | `true` si aller **et** retour (défaut `false`) |
| `date_demande` | string | non | Date de la demande (défaut : aujourd'hui) |
| `guide_jours` | number | non | Nombre de jours de guide/accompagnateur (défaut 0) |
| `nuits_chauffeur` | number | non | Nombre de nuits chauffeur (défaut 0) |
| `peages` | number | non | Forfait péages en € (défaut 0) |

### Sorties

La fonction renvoie un objet avec un champ `status` :

- `status: "ok"` → devis calculé : `montant_ht`, `montant_ttc`, `montant_tva`, un objet `detail` complet et `lignes_detail` (texte prêt pour le PDF/CRM).
- `status: "manuel"` → capacité supérieure au seuil automatisable (> 85 passagers) : la demande est routée vers un conseiller, **aucun prix n'est annoncé**.
- `status: "erreur"` → données indispensables manquantes ou invalides (avec le motif).

## 3. Logique de calcul

Le calcul se fait dans un ordre strict :

1. **Base de transport** — selon la distance aller simple :
   - jusqu'à 180 km : grille de **forfaits** par paliers de 10 km (arrondi au palier supérieur) ;
   - au-delà de 180 km : formule `km × 2 × 2,5 €` (le facteur 2 modélise le trajet à vide du véhicule). La transition est continue : à 180 km, forfait = 900 € = `180 × 2 × 2,5`.
   - Si aller-retour : base × 2.
2. **Coefficients d'ajustement** (multiplicatifs) :
   - **saisonnalité** selon le mois de départ (basse −7 %, moyenne 0 %, haute +10 %, très haute +15 %) ;
   - **anticipation** selon le nombre de jours avant le départ (≤ 14 j : +10 % ; ≤ 30 j : +5 % ; ≤ 90 j : −5 % ; > 90 j : −10 %) ;
   - **capacité** selon le nombre de passagers (≤ 19 : −5 % ; ≤ 53 : 0 % ; ≤ 63 : +15 % ; ≤ 67 : +20 % ; ≤ 85 : +40 %).
   - Formule : `transport_ajusté = base × (1 + saison) × (1 + anticipation) × (1 + capacité)`.
3. **Options** (additives) : `guide_jours × 80 €` + `nuits_chauffeur × 120 €` + `péages`.
4. **Marge** : `(transport_ajusté + options) × 1,15` = **montant HT**.
5. **TVA** : `HT × 1,10` = **montant TTC**.

Tous les paramètres (grille, coefficients, seuils, marge, TVA) proviennent de la matrice de pricing du projet, stockée dans Airtable. Le moteur embarque aussi un jeu de règles par défaut identique, utilisé pour les tests en isolation.

## 4. Jeu de tests (golden set)

Le fichier `calculer_devis.js` contient un jeu de tests exécutable :

```bash
node calculer_devis.js
```

Le jeu couvre **3 cas types** et **7 cas limites**. Chaque test documente en commentaire le calcul attendu — il sert de référence (« golden set ») contre laquelle toute évolution du code peut être revalidée.

### Cas types

| # | Scénario | Résultat attendu |
|---|---|---|
| T1 | 50 km, aller simple, juillet, J-14, 45 pax (cas de référence) | 487,03 € HT / 535,73 € TTC |
| T2 | 200 km, aller-retour, mai, J-120, 60 pax, guide 2 j + 1 nuit + péages | 3 117,08 € HT / 3 428,78 € TTC |
| T3 | 30 km, aller simple, janvier, J-120, 12 pax (réductions cumulées) | 228,61 € HT / 251,47 € TTC |

### Cas limites

| # | Scénario testé | Résultat attendu |
|---|---|---|
| T4 | Frontière exacte 180 km → dernier **forfait** (900 €) | 983,25 € HT |
| T5 | 181 km → bascule sur la **formule** (continuité vérifiée) | 988,71 € HT |
| T6 | Capacité **exactement 85** → reste en calcul automatique | `status: ok` |
| T7 | Capacité **86** → bascule en **flux manuel** | `status: manuel` |
| T8 | Données indispensables manquantes | `status: erreur` |
| T9 | Distance = 0 (invalide) | `status: erreur` |
| T10 | Frontière exacte J-14 → coefficient **prioritaire** (+10 %) | 404,80 € HT |

### Résultat d'exécution

```
=== CAS TYPES ===
✅ T1 aller simple — HT                 ->     487.03 (attendu 487.03)
✅ T1 aller simple — TTC                ->     535.73 (attendu 535.73)
✅ T2 A/R + options + >180km — HT       ->    3117.08 (attendu 3117.08)
✅ T2 A/R + options + >180km — TTC      ->    3428.78 (attendu 3428.78)
✅ T3 petit groupe basse saison — HT    ->     228.61 (attendu 228.61)
✅ T3 petit groupe basse saison — TTC   ->     251.47 (attendu 251.47)

=== CAS LIMITES ===
✅ T4 frontière 180km (forfait) — HT    ->     983.25 (attendu 983.25)
✅ T5 seuil 181km (formule) — HT        ->     988.71 (attendu 988.71)
✅ T6 capacité = 85 (limite auto)       ->         ok (attendu ok)
✅ T7 capacité = 86 (flux manuel)       ->     manuel (attendu manuel)
✅ T8 données manquantes (erreur)       ->     erreur (attendu erreur)
✅ T9 distance = 0 (erreur)             ->     erreur (attendu erreur)
✅ T10 frontière J-14 (prioritaire)     ->      404.8 (attendu 404.8)

13/13 tests OK
```

## 5. Branchement dans n8n

Le moteur est encapsulé dans le sous-workflow **`calculer_devis`**, appelé par l'agent. Le sous-workflow :

1. reçoit les données du trajet (dont les villes de départ/destination) ;
2. appelle le sous-workflow `calculer_distance` (OpenRouteService) pour obtenir la distance routière — la distance ne transite donc jamais par le LLM ;
3. lit la matrice de pricing dans Airtable ;
4. exécute `calculer_devis()` dans un nœud Code ;
5. enregistre le résultat dans la table Devis (upsert sur `session_id`, ce qui permet de recalculer sans créer de doublon).

L'agent ne fournit que des données brutes ; il ne choisit aucun coefficient et ne réalise aucun calcul.
