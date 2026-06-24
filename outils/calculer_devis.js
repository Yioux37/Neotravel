/* ====================================================================
 * calculer_devis — NŒUD CODE N8N (PAS un fichier du front Next.js)
 * --------------------------------------------------------------------
 * À coller dans un nœud "Code" de N8N. Déterministe et PUR :
 *   - il NE lit PAS Airtable (c'est le rôle du nœud "Lookup règles",
 *     en amont, qui lui passe les coefficients) ;
 *   - il applique les matrices de tarification et rend un montant.
 *
 * Entrée attendue (json de l'item) :
 *   {
 *     demande: {
 *       date_depart: "2025-07-14",
 *       nb_passagers: 45,
 *       urgence: "urgent" | "standard",
 *       distance_km?: 460          // si dispo, sinon base forfaitaire
 *     },
 *     matrices: [                   // sortie du nœud "Lookup règles"
 *       { type_critere: "saison",   valeur_critere: "haute saison", coefficient: 1.2 },
 *       { type_critere: "urgence",  valeur_critere: "urgent",       coefficient: 1.15 },
 *       { type_critere: "capacite", valeur_critere: "20-53",        coefficient: 1.1 },
 *       ...
 *     ],
 *     params?: { tarifBase: 750, prixKm: 2.4, tva: 0.10 }
 *   }
 *
 * ⚠️ DEUX HYPOTHÈSES À CONFIRMER AVEC LE MÉTIER (non figées dans le modèle) :
 *   1. La formule de base. Ici : tarifBase + prixKm * distance_km (le km
 *      est optionnel — sans lui on retombe sur tarifBase seul). À ajuster
 *      dès que la grille tarifaire de référence est connue.
 *   2. La résolution "saison" / "capacité". Idéalement, la table Matrice
 *      stocke des bornes numériques (min/max) plutôt que des libellés type
 *      ">19 et ≤53 passagers", trop fragiles à parser. En attendant, les
 *      résolveurs ci-dessous sont volontairement explicites et modifiables.
 * ==================================================================== */

const DEFAULT_PARAMS = { tarifBase: 750, prixKm: 2.4, tva: 0.1 };

/** Détermine la saison à partir de la date (règle simple à confirmer). */
function resoudreSaison(dateDepart) {
  const mois = new Date(dateDepart).getMonth() + 1; // 1–12
  const hauteSaison = [6, 7, 8, 12].includes(mois);
  return hauteSaison ? "haute saison" : "basse saison";
}

/** Détermine la tranche de capacité à partir du nombre de passagers. */
function resoudreCapacite(nbPassagers) {
  if (nbPassagers <= 19) return "1-19";
  if (nbPassagers <= 53) return "20-53";
  return "54+";
}

/** Récupère le coefficient d'un critère, 1 par défaut (= neutre). */
function coefficient(matrices, typeCritere, valeurCritere) {
  const regle = matrices.find(
    (m) =>
      String(m.type_critere).toLowerCase() === typeCritere &&
      String(m.valeur_critere).toLowerCase() ===
        String(valeurCritere).toLowerCase(),
  );
  return regle ? Number(regle.coefficient) : 1;
}

/** Cœur du calcul — pur, testable hors de n8n. */
function calculerDevis(demande, matrices = [], params = {}) {
  const { tarifBase, prixKm, tva } = { ...DEFAULT_PARAMS, ...params };

  // 1. Prix de base (forfait + km si la distance est fournie)
  const distance = Number(demande.distance_km) || 0;
  const base = tarifBase + prixKm * distance;

  // 2. Coefficients applicables, lus dans les matrices passées en entrée
  const coefSaison = coefficient(
    matrices,
    "saison",
    resoudreSaison(demande.date_depart),
  );
  const coefUrgence = coefficient(matrices, "urgence", demande.urgence);
  const coefCapacite = coefficient(
    matrices,
    "capacite",
    resoudreCapacite(Number(demande.nb_passagers)),
  );

  // 3. Application déterministe
  const montantHt = base * coefSaison * coefUrgence * coefCapacite;
  const montantTtc = montantHt * (1 + tva);

  // Arrondi au centime
  const arrondi = (n) => Math.round(n * 100) / 100;

  return {
    montant_ht: arrondi(montantHt),
    montant_ttc: arrondi(montantTtc),
    detail: {
      base: arrondi(base),
      coef_saison: coefSaison,
      coef_urgence: coefUrgence,
      coef_capacite: coefCapacite,
      tva,
    },
  };
}

/* ---- Adaptateur N8N (mode "Run Once for All Items") ---- */
return $input.all().map((item) => {
  const { demande, matrices, params } = item.json;
  return { json: calculerDevis(demande, matrices, params) };
});
