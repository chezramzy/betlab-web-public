/**
 * Match Narrator — Dynamic Expert Analysis Generator v2
 *
 * Transforms raw analytics data into a rich, human-readable narrative
 * for the "Analyse de l'expert IA" section.
 *
 * v2 axes:
 *   1. Outcome & Probabilities
 *   2. xG Analysis (base + recent trend)
 *   3. Form Index
 *   4. Defensive Factors
 *   5. ELO Ratings
 *   6. Fatigue, Rest & Travel
 *   7. Head-to-Head (H2H)
 *   8. Injury Impact
 *   9. BTTS & Over/Under Markets
 *  10. Most Likely Score
 *  11. Best Market
 *
 * Bold keywords via **text** — parsed by the presentation layer.
 */

import type { MatchDetailVM } from "@/application/view-models/match-detail/match-detail.vm";
import type { ProbabilitiesResponse } from "@/core/entities/match-detail/probabilities.entity";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NarrationResult {
    /** One-liner headline (e.g. "Domination attendue des Reds") */
    headline: string;
    /** Multi-paragraph expert analysis (supports **bold** markdown) */
    paragraphs: string[];
    /** Key takeaway tags for visual badges */
    tags: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pct(v: number): string {
    return `${(v).toFixed(1)}%`;
}

function outcomeLabel(probs: { home: number; draw: number; away: number }): {
    label: string;
    side: "home" | "draw" | "away";
    value: number;
} {
    const { home, draw, away } = probs;
    if (home >= draw && home >= away) return { label: "Victoire domicile", side: "home", value: home };
    if (away >= draw && away >= home) return { label: "Victoire extérieur", side: "away", value: away };
    return { label: "Match nul", side: "draw", value: draw };
}

function b(text: string): string {
    return `**${text}**`;
}

// ─── Main Narrator ──────────────────────────────────────────────────────────

export function generateNarration(
    vm: MatchDetailVM,
    probabilities?: ProbabilitiesResponse | null,
): NarrationResult {
    const { match, analysis, overview, bestMarket } = vm;
    const homeName = match.homeTeam.name;
    const awayName = match.awayTeam.name;

    const paragraphs: string[] = [];
    const tags: string[] = [];

    // Access markets from probabilities (BTTS, O/U, correct score)
    const markets = probabilities?.markets;
    const inputs = probabilities?.inputs;

    // ── 1. Outcome & Probabilities ─────────────────────────────────────────
    if (overview.probs) {
        const outcome = outcomeLabel(overview.probs);
        const dominant = outcome.side === "home" ? homeName : outcome.side === "away" ? awayName : null;

        if (outcome.value >= 55) {
            paragraphs.push(
                `Notre modèle identifie une ${b("tendance nette")} en faveur ${dominant ? `de ${b(dominant)}` : `du ${b("nul")}`} avec une probabilité de ${b(pct(outcome.value))}. ` +
                `C'est un signal fort que les données historiques et contextuelles convergent dans cette direction.`
            );
            tags.push(outcome.value >= 65 ? "Signal fort" : "Tendance claire");
        } else if (outcome.value >= 40) {
            paragraphs.push(
                `La confrontation s'annonce ${b("serrée")}. Le scénario le plus probable est « ${outcome.label} » à ${b(pct(outcome.value))}, ` +
                `mais avec des écarts faibles entre les issues possibles — ${b("prudence de mise")}.`
            );
            tags.push("Match ouvert");
        } else {
            paragraphs.push(
                `Aucune issue ne se dégage franchement : le modèle attribue ${b(pct(overview.probs.home))} pour ${homeName}, ` +
                `${b(pct(overview.probs.draw))} pour le nul et ${b(pct(overview.probs.away))} pour ${awayName}. Un match ${b("hautement imprévisible")}.`
            );
            tags.push("Incertitude");
        }
    }

    // ── 2. xG Analysis (base + recent trend) ──────────────────────────────
    const xg = analysis.xg;
    if (xg.home > 0 || xg.away > 0) {
        const totalXg = xg.home + xg.away;
        const xgDiff = Math.abs(xg.home - xg.away);
        const dominant = xg.home > xg.away ? homeName : awayName;
        const dominated = xg.home > xg.away ? awayName : homeName;

        if (xgDiff >= 0.8) {
            paragraphs.push(
                `Les ${b("xG attendus")} (${b(xg.home.toFixed(2))} – ${b(xg.away.toFixed(2))}) révèlent un ${b("déséquilibre offensif significatif")} en faveur de ${b(dominant)}. ` +
                `${dominated} pourrait souffrir dans la construction du jeu.`
            );
            tags.push("Domination xG");
        } else if (totalXg >= 3.0) {
            paragraphs.push(
                `Avec un total de ${b("xG attendus")} de ${b(totalXg.toFixed(2))} (${xg.home.toFixed(2)} – ${xg.away.toFixed(2)}), ` +
                `la rencontre promet d'être ${b("animée")}. Les deux équipes possèdent un potentiel offensif non négligeable.`
            );
            tags.push("Match offensif");
        } else if (totalXg <= 1.8) {
            paragraphs.push(
                `Les xG prévus sont ${b("contenus")} (${xg.home.toFixed(2)} – ${xg.away.toFixed(2)}). ` +
                `Les données suggèrent un ${b("match tactique")}, potentiellement verrouillé, avec peu d'occasions franches.`
            );
            tags.push("Match fermé");
        }

        // xG recent trend (mu_home_recent vs mu_home)
        if (inputs?.mu_home_recent && inputs?.mu_away_recent) {
            const trendHome = inputs.mu_home_recent - inputs.mu_home;
            const trendAway = inputs.mu_away_recent - inputs.mu_away;

            if (Math.abs(trendHome) >= 0.3 || Math.abs(trendAway) >= 0.3) {
                const rising = trendHome > trendAway ? homeName : awayName;
                const falling = trendHome > trendAway ? awayName : homeName;
                const risingDelta = trendHome > trendAway ? trendHome : trendAway;

                if (risingDelta > 0) {
                    paragraphs.push(
                        `${b("Tendance récente")} : ${b(rising)} affiche une ${b("montée en puissance offensive")} ` +
                        `(xG récents en hausse de ${b(`+${risingDelta.toFixed(2)}`)}) tandis que ${falling} montre des signes de baisse.`
                    );
                    tags.push("Dynamique offensive");
                }
            }
        }
    }

    // ── 3. Form Index ─────────────────────────────────────────────────────
    const form = analysis.formIndex;
    if (form) {
        const formDiff = Math.abs(form.home - form.away);
        const betterForm = form.home > form.away ? homeName : awayName;
        const worseForm = form.home > form.away ? awayName : homeName;

        if (formDiff >= 0.4) {
            paragraphs.push(
                `L'${b("indice de forme")} récente donne un avantage marqué à ${b(betterForm)}. ` +
                `${worseForm} affiche un ${b("passage délicat")} qui pourrait peser dans la balance.`
            );
            tags.push("Écart de forme");
        } else if (formDiff >= 0.15) {
            paragraphs.push(
                `Légère ${b("dynamique")} en faveur de ${b(betterForm)} sur les dernières rencontres, mais l'écart reste modéré.`
            );
        }
    }

    // ── 4. Defensive Factors ──────────────────────────────────────────────
    const defense = analysis.defense;
    if (defense) {
        const homeDef = defense.home;
        const awayDef = defense.away;

        // defenseFactor > 0 means poor defense (more goals conceded)
        if (homeDef > 0.15 && awayDef > 0.15) {
            paragraphs.push(
                `Les deux arrière-gardes présentent des ${b("faiblesses structurelles")} (indices de vulnérabilité élevés). ` +
                `Un match avec des ${b("buts")} semble probable.`
            );
            tags.push("Défenses fragiles");
        } else if (homeDef > 0.2 || awayDef > 0.2) {
            const weak = homeDef > awayDef ? homeName : awayName;
            paragraphs.push(
                `Notre analyse défensive pointe une ${b("faiblesse")} chez ${b(weak)}. ` +
                `L'adversaire pourrait en profiter pour se créer des situations dangereuses.`
            );
        }
    }

    // ── 5. ELO Ratings ────────────────────────────────────────────────────
    const ratings = analysis.ratings;
    if (ratings) {
        const eloDiff = Math.abs(ratings.home - ratings.away);
        const stronger = ratings.home > ratings.away ? homeName : awayName;

        if (eloDiff >= 150) {
            paragraphs.push(
                `Le ${b("classement ELO")} confirme une supériorité globale de ${b(stronger)} (${b(String(Math.round(ratings.home > ratings.away ? ratings.home : ratings.away)))} pts). ` +
                `Un différentiel de ${b(String(Math.round(eloDiff)))} points qui traduit un vrai ${b("écart de standing")}.`
            );
            tags.push("Écart ELO");
        } else if (eloDiff >= 60) {
            paragraphs.push(
                `Le ${b("rating ELO")} penche légèrement en faveur de ${b(stronger)} (+${Math.round(eloDiff)} pts), ` +
                `mais cet écart reste insuffisant pour constituer une certitude.`
            );
        }
    }

    // ── 6. Fatigue, Rest & Travel ─────────────────────────────────────────
    const rest = analysis.rest;
    if (rest) {
        const restDiff = Math.abs(rest.home - rest.away);
        if (restDiff >= 24) {
            const moreFresh = rest.home > rest.away ? homeName : awayName;
            paragraphs.push(
                `${b("Avantage physique")} pour ${b(moreFresh)} qui dispose de ${b(String(Math.round(restDiff)) + "h")} de repos supplémentaires — ` +
                `un facteur qui peut faire la différence en fin de match.`
            );
            tags.push("Avantage repos");
        }
    }

    // Travel distance (from inputs)
    const travelKm = inputs?.travel_distance_km;
    if (travelKm && travelKm > 500) {
        paragraphs.push(
            `${b(awayName)} effectue un ${b("déplacement de " + Math.round(travelKm) + " km")} — ` +
            `un facteur de fatigue supplémentaire qui pourrait impacter les performances en seconde mi-temps.`
        );
        if (travelKm > 1500) {
            tags.push("Long déplacement");
        }
    }

    // ── 7. Head-to-Head (H2H) ─────────────────────────────────────────────
    const h2hBias = inputs?.head_to_head_bias;
    const h2hGoalDelta = inputs?.head_to_head_goal_delta;
    if (h2hBias !== undefined && h2hBias !== null && Math.abs(h2hBias) > 0.05) {
        const h2hFavor = h2hBias > 0 ? homeName : awayName;
        const h2hSuffix = h2hGoalDelta && Math.abs(h2hGoalDelta) >= 0.5
            ? ` avec un ${b("différentiel de buts moyen de " + Math.abs(h2hGoalDelta).toFixed(1))}`
            : "";

        paragraphs.push(
            `L'${b("historique des confrontations directes")} penche en faveur de ${b(h2hFavor)}${h2hSuffix}. ` +
            `Ce paramètre psychologique peut influencer la dynamique du match.`
        );
        tags.push("H2H favorable");
    }

    // ── 8. Injury Impact ──────────────────────────────────────────────────
    const injury = analysis.injury;
    if (injury) {
        const homeInjury = injury.home;
        const awayInjury = injury.away;
        // injuryFactor < 1 means squad weakened
        if (homeInjury < 0.85 || awayInjury < 0.85) {
            const weakenedTeam = homeInjury < awayInjury ? homeName : awayName;
            const factor = homeInjury < awayInjury ? homeInjury : awayInjury;
            const impactPct = Math.round((1 - factor) * 100);

            paragraphs.push(
                `${b("Alerte effectif")} : ${b(weakenedTeam)} est privé de joueurs clés, ` +
                `avec un ${b("impact estimé à " + impactPct + "%")} sur le potentiel de l'équipe. ` +
                `Un handicap non négligeable pour cette rencontre.`
            );
            tags.push("Absences clés");
        }
    }

    // ── 9. BTTS & Over/Under ──────────────────────────────────────────────
    if (markets) {
        const bttsYes = markets.btts?.yes;
        const over25 = markets.over_under?.over_2_5;
        const under25 = markets.over_under?.under_2_5;

        if (bttsYes !== undefined && bttsYes > 0.6) {
            paragraphs.push(
                `Le modèle attribue une probabilité de ${b(pct(bttsYes * 100))} au scénario ${b("les deux équipes marquent")}. ` +
                `Les profils offensifs des deux formations convergent vers un match ouvert avec des buts de part et d'autre.`
            );
            tags.push("BTTS probable");
        } else if (bttsYes !== undefined && bttsYes < 0.35) {
            const likelyCsTeam = xg.home > xg.away ? homeName : awayName;
            paragraphs.push(
                `Avec seulement ${b(pct(bttsYes * 100))} de chances que les deux équipes marquent, ` +
                `un ${b("clean sheet")} est un scénario sérieusement envisageable, notamment pour ${b(likelyCsTeam)}.`
            );
        }

        if (over25 !== undefined && over25 > 0.65) {
            paragraphs.push(
                `La probabilité de ${b("plus de 2.5 buts")} s'élève à ${b(pct(over25 * 100))}. ` +
                `Les conditions sont réunies pour un match spectaculaire.`
            );
            tags.push("Over 2.5 probable");
        } else if (under25 !== undefined && under25 > 0.65) {
            paragraphs.push(
                `La probabilité de ${b("moins de 2.5 buts")} atteint ${b(pct(under25 * 100))}. ` +
                `Un match ${b("peu prolifique")} est le scénario privilégié.`
            );
            tags.push("Under 2.5 probable");
        }
    }

    // ── 10. Most Likely Score ──────────────────────────────────────────────
    const topScores = markets?.correct_score_top;
    if (topScores && topScores.length >= 2) {
        const top1 = topScores[0];
        const top2 = topScores[1];

        if (top1.probability >= 0.08) {
            paragraphs.push(
                `Le ${b("score le plus probable")} selon notre modèle est ${b(top1.score)} ` +
                `(${pct(top1.probability * 100)}), suivi de ${b(top2.score)} (${pct(top2.probability * 100)}). ` +
                `Ces projections s'appuient sur les xG et les matrices de Poisson ajustées.`
            );
        }
    }

    // ── 11. Best Market ───────────────────────────────────────────────────
    if (bestMarket) {
        const edgeStr = bestMarket.edge ? ` avec un ${b("edge de " + (bestMarket.edge * 100).toFixed(1) + "%")}` : "";
        paragraphs.push(
            `Le marché que notre algorithme identifie comme le ${b("plus prometteur")} est « ${b(bestMarket.label)} » ` +
            `à ${b(pct(bestMarket.prob))}${edgeStr}. ` +
            (bestMarket.odds ? `Cote relevée : ${b(bestMarket.odds.toFixed(2))}.` : "")
        );
    }

    // ── Headline ──────────────────────────────────────────────────────────
    let headline = "Analyse en cours...";
    if (overview.probs) {
        const outcome = outcomeLabel(overview.probs);
        if (outcome.value >= 55) {
            const dominant = outcome.side === "home" ? homeName : outcome.side === "away" ? awayName : "nul";
            headline = `Avantage ${dominant}`;
        } else {
            headline = "Équilibre des forces";
        }
    }

    // ── Fallback ──────────────────────────────────────────────────────────
    if (paragraphs.length === 0) {
        paragraphs.push(
            `Données insuffisantes pour une analyse approfondie. ` +
            `Le modèle se base sur les probabilités brutes pour ce match.`
        );
    }

    return { headline, paragraphs, tags };
}
