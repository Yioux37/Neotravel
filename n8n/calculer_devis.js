/**
 * ============================================================================
 *  NEOTRAVEL — calculer_devis()
 *  Moteur de tarification DÉTERMINISTE pour la location d'autocars en groupe.
 * ----------------------------------------------------------------------------
 *  Règle d'or du projet : le LLM ne calcule JAMAIS le prix.
 *  Cette fonction est pure : mêmes entrées -> même sortie, auditable.
 *
 *  Architecture (Option A) :
 *    L'agent appelle d'abord "Lookup règles" (lecture Airtable de la Matrice)
 *    puis passe le résultat via le paramètre `regles`. Si `regles` est absent,
 *    la fonction utilise REGLES_DEFAUT (utile pour tester EN ISOLATION, sans IA).
 *
 *  Source des règles :
 *    - Grille de base + formule >180km + seuils en jours : PDF "Règles de calcul"
 *    - Coefficients %, options, TVA, marge : tableaux "Paramètres de Pricing"
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Règles par défaut (embarquées). Le Lookup Airtable peut les surcharger.
// ---------------------------------------------------------------------------
const REGLES_DEFAUT = {
  // Grille forfait "transfert simple", aller seul, jusqu'à 180 km (km -> €).
  // Paliers de 10 km : on arrondit AU PALIER SUPÉRIEUR (forfait).
  grilleForfait: [
    { kmMax: 30, prix: 250 }, // couvre 10, 20, 30
    { kmMax: 40, prix: 320 },
    { kmMax: 50, prix: 350 },
    { kmMax: 60, prix: 390 },
    { kmMax: 70, prix: 430 },
    { kmMax: 80, prix: 500 },
    { kmMax: 90, prix: 540 },
    { kmMax: 100, prix: 580 },
    { kmMax: 110, prix: 620 },
    { kmMax: 120, prix: 660 },
    { kmMax: 130, prix: 700 },
    { kmMax: 140, prix: 740 },
    { kmMax: 150, prix: 780 },
    { kmMax: 160, prix: 820 },
    { kmMax: 170, prix: 860 },
    { kmMax: 180, prix: 900 },
  ],
  seuilForfait: 180,           // km : au-delà, on passe à la formule
  facteurTrajetVehicule: 2,    // le véhicule fait l'aller-retour à vide
  tarifKmAuDela: 2.5,          // €/km au-delà du seuil
  // -> base (>180km) = km * facteurTrajetVehicule * tarifKmAuDela
  //    (à 180 km : 180*2*2.5 = 900 €, continu avec la grille)

  // Coefficient saisonnalité, indexé par mois de la DATE DE DÉPART (1=janv).
  saisonnalite: {
    1: { niveau: "basse",      coef: -0.07 },
    2: { niveau: "basse",      coef: -0.07 },
    8: { niveau: "basse",      coef: -0.07 },
    11: { niveau: "basse",     coef: -0.07 },
    9: { niveau: "moyenne",    coef: 0.00 },
    10: { niveau: "moyenne",   coef: 0.00 },
    12: { niveau: "moyenne",   coef: 0.00 },
    3: { niveau: "haute",      coef: 0.10 },
    4: { niveau: "haute",      coef: 0.10 },
    7: { niveau: "haute",      coef: 0.10 },
    5: { niveau: "très haute", coef: 0.15 },
    6: { niveau: "très haute", coef: 0.15 },
  },

  // Pondération date demande vs date départ, en JOURS jusqu'au départ.
  // On prend la 1re règle dont joursMax >= jours_avant_depart.
  dateDepart: [
    { joursMax: 14,       code: "DD_PRIORITAIRE",  coef: 0.10 }, // <= 14 j
    { joursMax: 30,       code: "DD_URGENT",       coef: 0.05 }, // 14 < d <= 30
    { joursMax: 90,       code: "DD_NORMAL",       coef: -0.05 }, // 30 < d <= 90
    { joursMax: Infinity, code: "DD_3MOISETPLUS",  coef: -0.10 }, // > 90 j
  ],

  // Pondération capacité (nb passagers). 1re règle dont paxMax >= nb_passagers.
  capacite: [
    { paxMax: 19, coef: -0.05 }, // <= 19
    { paxMax: 53, coef: 0.00 },  // 19 < p <= 53
    { paxMax: 63, coef: 0.15 },  // 53 < p <= 63
    { paxMax: 67, coef: 0.20 },  // 63 < p <= 67
    { paxMax: 85, coef: 0.40 },  // 67 < p <= 85
  ],
  capaciteMaxAuto: 85, // au-delà -> flux manuel (envoi au commercial)

  // Options / suppléments
  tarifGuideParJour: 80,   // €/jour
  tarifNuitChauffeur: 120, // €/nuit
  // péages : forfait variable "selon trajet", passé en entrée (€)

  marge: 0.15, // +15 % appliqués au devis avant envoi
  tva: 0.10,   // 10 %

  // "multiplicatif" : base*(1+s)*(1+d)*(1+c)   <- défaut
  // "additif"       : base*(1 + s + d + c)
  modeCoefficients: "multiplicatif",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function joursEntre(dateDemande, dateDepart) {
  const d1 = new Date(dateDemande);
  const d2 = new Date(dateDepart);
  // différence en jours calendaires, arrondie
  return Math.round((d2 - d1) / 86400000);
}

function baseTransfertSimple(km, regles) {
  if (km <= regles.seuilForfait) {
    const palier = regles.grilleForfait.find((g) => km <= g.kmMax);
    // si km <= 0 on prend le premier palier ; si > 180 on n'arrive pas ici
    return (palier || regles.grilleForfait[0]).prix;
  }
  return km * regles.facteurTrajetVehicule * regles.tarifKmAuDela;
}

// ---------------------------------------------------------------------------
// Fonction principale
// ---------------------------------------------------------------------------
/**
 * @param {Object} entree
 * @param {number}  entree.distance_km    Distance ALLER SIMPLE en km (> 0)
 * @param {boolean} entree.aller_retour   true si départ aller ET retour
 * @param {string}  entree.date_depart    ISO 'YYYY-MM-DD'
 * @param {string} [entree.date_demande]  ISO ; défaut = aujourd'hui
 * @param {number}  entree.nb_passagers
 * @param {number} [entree.guide_jours=0]
 * @param {number} [entree.nuits_chauffeur=0]
 * @param {number} [entree.peages=0]       Forfait péages en €
 * @param {Object} [regles=REGLES_DEFAUT]
 * @returns {Object} { status, montant_ht, montant_ttc, ... , lignes_detail }
 */
function calculerDevis(entree, regles = REGLES_DEFAUT) {
  const {
    distance_km,
    aller_retour = false,
    date_depart,
    date_demande = new Date().toISOString().slice(0, 10),
    nb_passagers,
    guide_jours = 0,
    nuits_chauffeur = 0,
    peages = 0,
  } = entree || {};

  // --- 1. Validation des entrées indispensables ---------------------------
  const manquants = [];
  if (!(distance_km > 0)) manquants.push("distance_km");
  if (!date_depart) manquants.push("date_depart");
  if (!(nb_passagers > 0)) manquants.push("nb_passagers");
  if (manquants.length) {
    return {
      status: "erreur",
      raison: `Données manquantes/invalides : ${manquants.join(", ")}`,
    };
  }

  // --- 2. Capacité > 85 -> flux manuel ------------------------------------
  if (nb_passagers > regles.capaciteMaxAuto) {
    return {
      status: "manuel",
      raison: `Capacité ${nb_passagers} > ${regles.capaciteMaxAuto} passagers — envoi au commercial (flux manuel).`,
    };
  }

  // --- 3. Base de transport -----------------------------------------------
  const baseSimple = baseTransfertSimple(distance_km, regles);
  const baseTrajet = aller_retour ? baseSimple * 2 : baseSimple;

  // --- 4. Sélection des coefficients --------------------------------------
  const mois = new Date(date_depart).getMonth() + 1; // 1-12
  const saison = regles.saisonnalite[mois] || { niveau: "inconnue", coef: 0 };

  const jours = joursEntre(date_demande, date_depart);
  const regleDate = regles.dateDepart.find((r) => jours <= r.joursMax);

  const regleCap = regles.capacite.find((c) => nb_passagers <= c.paxMax);

  const s = saison.coef;
  const d = regleDate.coef;
  const c = regleCap.coef;

  // --- 5. Application des coefficients sur le transport --------------------
  let transportAjuste;
  if (regles.modeCoefficients === "additif") {
    transportAjuste = baseTrajet * (1 + s + d + c);
  } else {
    transportAjuste = baseTrajet * (1 + s) * (1 + d) * (1 + c);
  }

  // --- 6. Options (additives) ---------------------------------------------
  const optGuide = guide_jours * regles.tarifGuideParJour;
  const optNuit = nuits_chauffeur * regles.tarifNuitChauffeur;
  const optionsTotal = optGuide + optNuit + peages;

  const sousTotal = transportAjuste + optionsTotal;

  // --- 7. Marge puis TVA ---------------------------------------------------
  const montantHt = sousTotal * (1 + regles.marge);
  const montantTva = montantHt * regles.tva;
  const montantTtc = montantHt + montantTva;

  // --- 8. Détail ligne par ligne (pour la table Devis / le PDF) -----------
  const pct = (x) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(0)}%`;
  const lignes_detail = [
    `Base transfert simple (${distance_km} km) : ${round2(baseSimple)} €`,
    aller_retour ? `Aller/retour (x2) : ${round2(baseTrajet)} €` : `Aller simple : ${round2(baseTrajet)} €`,
    `Saisonnalité (${saison.niveau}) : ${pct(s)}`,
    `Date demande/départ (${regleDate.code}, ${jours} j) : ${pct(d)}`,
    `Capacité (${nb_passagers} pax) : ${pct(c)}`,
    `Transport ajusté : ${round2(transportAjuste)} €`,
    optGuide ? `Guide : ${guide_jours} j x ${regles.tarifGuideParJour} € = ${round2(optGuide)} €` : null,
    optNuit ? `Nuit(s) chauffeur : ${nuits_chauffeur} x ${regles.tarifNuitChauffeur} € = ${round2(optNuit)} €` : null,
    peages ? `Péages (forfait) : ${round2(peages)} €` : null,
    `Sous-total HT avant marge : ${round2(sousTotal)} €`,
    `Marge (${pct(regles.marge)}) : ${round2(montantHt - sousTotal)} €`,
    `MONTANT HT : ${round2(montantHt)} €`,
    `TVA (${pct(regles.tva)}) : ${round2(montantTva)} €`,
    `MONTANT TTC : ${round2(montantTtc)} €`,
  ].filter(Boolean).join("\n");

  return {
    status: "ok",
    montant_ht: round2(montantHt),
    montant_ttc: round2(montantTtc),
    montant_tva: round2(montantTva),
    detail: {
      distance_km,
      aller_retour,
      base_simple: round2(baseSimple),
      base_trajet: round2(baseTrajet),
      saison: { niveau: saison.niveau, coef: s },
      date: { code: regleDate.code, coef: d, jours_avant_depart: jours },
      capacite: { coef: c },
      transport_ajuste: round2(transportAjuste),
      options: { guide: round2(optGuide), nuit_chauffeur: round2(optNuit), peages: round2(peages), total: round2(optionsTotal) },
      sous_total_ht: round2(sousTotal),
      marge_montant: round2(montantHt - sousTotal),
    },
    lignes_detail,
  };
}

// ===========================================================================
//  JEU DE TESTS  ->  exécuter :  node calculer_devis_LIVRABLE.js
// ---------------------------------------------------------------------------
//  Le brief exige que calculer_devis soit testé EN ISOLATION, avant l'IA.
//  Ce jeu couvre :
//    - des CAS TYPES (devis nominaux, aller simple / aller-retour, options)
//    - des CAS LIMITES (frontières de paliers, seuils de coefficients,
//      flux manuel, données manquantes, formule longue distance).
//  Chaque test indique le calcul attendu en commentaire = "golden set".
// ===========================================================================
function _approx(a, b, tol = 0.01) { return Math.abs(a - b) <= tol; }

function _runTests() {
  let ok = 0, total = 0;
  const t = (label, recu, attendu) => {
    total++;
    const pass = _approx(recu, attendu);
    if (pass) ok++;
    console.log(`${pass ? "✅" : "❌"} ${label.padEnd(34)} -> ${String(recu).padStart(10)} (attendu ${attendu})`);
  };
  const tStatus = (label, recu, attendu) => {
    total++;
    const pass = recu === attendu;
    if (pass) ok++;
    console.log(`${pass ? "✅" : "❌"} ${label.padEnd(34)} -> ${String(recu).padStart(10)} (attendu ${attendu})`);
  };

  console.log("=== CAS TYPES ===\n");

  // -------------------------------------------------------------------------
  // T1 — Devis nominal, aller simple (cas de référence du projet)
  // 50 km -> forfait 350 €. Juillet = haute (+10%). Demande à J-14 = DD_PRIORITAIRE
  // (+10%). 45 pax = palier 19-53 (0%).
  // 350 * 1.10 * 1.10 * 1.00 = 423.50 ; * 1.15 (marge) = 487.025 -> 487.03 HT
  // 487.03 * 1.10 (TVA) = 535.73 TTC
  // -------------------------------------------------------------------------
  const r1 = calculerDevis({
    distance_km: 50, aller_retour: false,
    date_depart: "2026-07-15", date_demande: "2026-07-01",
    nb_passagers: 45,
  });
  t("T1 aller simple — HT", r1.montant_ht, 487.03);
  t("T1 aller simple — TTC", r1.montant_ttc, 535.73);

  // -------------------------------------------------------------------------
  // T2 — Devis complet aller-retour avec options + longue distance (>180 km)
  // 200 km -> formule : 200*2*2.5 = 1000 € ; A/R *2 = 2000 €.
  // Mai = très haute (+15%). J-120 = DD_3MOISETPLUS (-10%). 60 pax = 53-63 (+15%).
  // 2000 * 1.15 * 0.90 * 1.15 = 2380.50.
  // Options : guide 2j*80 + nuit 1*120 + péages 50 = 330. Sous-total = 2710.50.
  // * 1.15 = 3117.075 -> 3117.08 HT ; * 1.10 = 3428.78 TTC.
  // -------------------------------------------------------------------------
  const r2 = calculerDevis({
    distance_km: 200, aller_retour: true,
    date_depart: "2026-05-10", date_demande: "2026-01-10",
    nb_passagers: 60, guide_jours: 2, nuits_chauffeur: 1, peages: 50,
  });
  t("T2 A/R + options + >180km — HT", r2.montant_ht, 3117.08);
  t("T2 A/R + options + >180km — TTC", r2.montant_ttc, 3428.78);

  // -------------------------------------------------------------------------
  // T3 — Petit groupe, basse saison, longue anticipation (réduction maximale)
  // 30 km -> forfait 250 €. Janvier = basse (-7%). J-120 = DD_3MOISETPLUS (-10%).
  // 12 pax = palier <=19 (-5%). 250 * 0.93 * 0.90 * 0.95 = 198.7875.
  // * 1.15 = 228.605 -> 228.61 HT ; * 1.10 = 251.47 TTC.
  // -------------------------------------------------------------------------
  const r3 = calculerDevis({
    distance_km: 30, aller_retour: false,
    date_depart: "2026-01-20", date_demande: "2025-09-22",
    nb_passagers: 12,
  });
  t("T3 petit groupe basse saison — HT", r3.montant_ht, 228.61);
  t("T3 petit groupe basse saison — TTC", r3.montant_ttc, 251.47);

  console.log("\n=== CAS LIMITES ===\n");

  // -------------------------------------------------------------------------
  // T4 — Frontière de palier kilométrique : exactement 180 km (dernier forfait)
  // 180 km -> forfait 900 € (et NON la formule). Continuité avec >180km vérifiée.
  // Septembre = moyenne (0%). J-60 = DD_NORMAL (-5%). 50 pax = 19-53 (0%).
  // 900 * 1.00 * 0.95 * 1.00 = 855. * 1.15 = 983.25 HT ; * 1.10 = 1081.58 TTC.
  // -------------------------------------------------------------------------
  const r4 = calculerDevis({
    distance_km: 180, aller_retour: false,
    date_depart: "2026-09-15", date_demande: "2026-07-17",
    nb_passagers: 50,
  });
  t("T4 frontière 180km (forfait) — HT", r4.montant_ht, 983.25);

  // -------------------------------------------------------------------------
  // T5 — Juste au-dessus du seuil : 181 km bascule sur la formule
  // 181 km -> 181*2*2.5 = 905 €. Mêmes coefficients que T4.
  // 905 * 0.95 = 859.75. * 1.15 = 988.7125 -> 988.71 HT.
  // Vérifie que le passage forfait->formule est quasi continu (900€ vs 905€).
  // -------------------------------------------------------------------------
  const r5 = calculerDevis({
    distance_km: 181, aller_retour: false,
    date_depart: "2026-09-15", date_demande: "2026-07-17",
    nb_passagers: 50,
  });
  t("T5 seuil 181km (formule) — HT", r5.montant_ht, 988.71);

  // -------------------------------------------------------------------------
  // T6 — Frontière de capacité : exactement 85 pax (dernier palier auto, +40%)
  // Doit être calculé (PAS manuel). 85 = palier 67-85 (+40%).
  // 100 km -> 580 €. Juin = très haute (+15%). J-10 = DD_PRIORITAIRE (+10%).
  // 580 * 1.15 * 1.10 * 1.40 = 1026.844 -> *1.15 = 1180.87 HT.
  // -------------------------------------------------------------------------
  const r6 = calculerDevis({
    distance_km: 100, aller_retour: false,
    date_depart: "2026-06-20", date_demande: "2026-06-10",
    nb_passagers: 85,
  });
  tStatus("T6 capacité = 85 (limite auto)", r6.status, "ok");

  // -------------------------------------------------------------------------
  // T7 — Capacité 86 pax -> bascule en flux MANUEL (juste au-dessus du seuil)
  // -------------------------------------------------------------------------
  const r7 = calculerDevis({
    distance_km: 100, date_depart: "2026-06-01", nb_passagers: 86,
  });
  tStatus("T7 capacité = 86 (flux manuel)", r7.status, "manuel");

  // -------------------------------------------------------------------------
  // T8 — Données manquantes (ni date, ni passagers) -> statut erreur
  // -------------------------------------------------------------------------
  const r8 = calculerDevis({ distance_km: 100 });
  tStatus("T8 données manquantes (erreur)", r8.status, "erreur");

  // -------------------------------------------------------------------------
  // T9 — Distance invalide (0 km) -> statut erreur
  // -------------------------------------------------------------------------
  const r9 = calculerDevis({ distance_km: 0, date_depart: "2026-06-01", nb_passagers: 30 });
  tStatus("T9 distance = 0 (erreur)", r9.status, "erreur");

  // -------------------------------------------------------------------------
  // T10 — Frontière de date : exactement 14 jours -> DD_PRIORITAIRE (+10%)
  // (et non DD_URGENT). 40 km -> 320 €. Octobre = moyenne (0%). 30 pax (0%).
  // 320 * 1.10 = 352. * 1.15 = 404.80 HT.
  // -------------------------------------------------------------------------
  const r10 = calculerDevis({
    distance_km: 40, aller_retour: false,
    date_depart: "2026-10-15", date_demande: "2026-10-01",
    nb_passagers: 30,
  });
  t("T10 frontière J-14 (prioritaire) — HT", r10.montant_ht, 404.80);

  console.log(`\n${ok}/${total} tests OK`);
  console.log("\n--- Exemple de détail tarifaire généré (T2) ---\n" + r2.lignes_detail);
}

// Export pour n8n / Node, et auto-exécution des tests si lancé directement.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculerDevis, REGLES_DEFAUT };
}
if (typeof require !== "undefined" && require.main === module) {
  _runTests();
}

/* ===========================================================================
 *  BRANCHEMENT DANS n8n
 * ---------------------------------------------------------------------------
 *  Option 1 (recommandée) — Sub-workflow appelé via "Call n8n Workflow Tool" :
 *    - Le workflow-outil reçoit les arguments de l'agent (champs $fromAI).
 *    - Un nœud "Code" contient la fonction ci-dessus + l'adaptateur :
 *
 *        const entree = $input.first().json;        // args fournis par l'agent
 *        const regles = entree.regles || REGLES_DEFAUT; // injectés par Lookup
 *        return [{ json: calculerDevis(entree, regles) }];
 *
 *  Option 2 — "Code Tool" : l'agent envoie un JSON ; on le parse :
 *
 *        const entree = JSON.parse($json.query || "{}");
 *        return [{ json: calculerDevis(entree) }];
 *
 *  Dans les deux cas, l'agent NE fait QUE transmettre des données brutes
 *  (distance, dates, passagers, options) — il ne choisit aucun coefficient
 *  ni ne fait aucun calcul. Toute la logique vit ici.
 * =========================================================================== */
