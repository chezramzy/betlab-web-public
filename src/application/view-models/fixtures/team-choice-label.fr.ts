import { formatMarketLabel } from "./market-label.fr";

type TeamChoiceLabelContext = {
  homeName: string;
  awayName: string;
  teamName?: string;
};

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.\s,()]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function translateKnownSelection(raw: string, context: TeamChoiceLabelContext): string | null {
  const normalized = normalizeKey(raw);
  if (!normalized) return null;

  if (normalized === "home_win" || normalized === "home") return `Victoire ${context.homeName}`;
  if (normalized === "away_win" || normalized === "away") return `Victoire ${context.awayName}`;
  if (normalized === "draw" || normalized === "match_nul") return "Match nul";
  if (normalized === "no_draw") return "Sans match nul";
  if (normalized === "none") return "Sans choix d'equipe";

  if (normalized === "team_totals_home") return `Total equipe ${context.homeName}`;
  if (normalized === "team_totals_away") return `Total equipe ${context.awayName}`;
  if (normalized === "double_chance_dc" || normalized === "double_chance") return "Double chance";
  if (normalized === "halves_ht_dc" || normalized === "ht_dc") return "Double chance 1re mi-temps";
  if (normalized === "1x2") return "1X2";

  return null;
}

function translateFreeTextSelection(raw: string, context: TeamChoiceLabelContext): string {
  const trimmed = raw.trim();
  const winnerMatch = trimmed.match(/^(.+?)\s+to\s+win\s*\((home|away)\)\s*$/i);
  if (winnerMatch) {
    const side = winnerMatch[2].toLowerCase();
    return side === "home" ? `Victoire ${context.homeName}` : `Victoire ${context.awayName}`;
  }

  const noDrawMatch = trimmed.match(/^dc_?12.*$/i);
  if (noDrawMatch) return "Double chance 12";

  const direct = formatMarketLabel(trimmed, {
    homeName: context.homeName,
    awayName: context.awayName,
  });
  if (direct !== trimmed) return direct;

  return trimmed
    .replace(/\bDouble Chance\b/gi, "Double chance")
    .replace(/\bNo Draw\b/gi, "sans match nul")
    .replace(/\bDraw\b/gi, "Nul")
    .replace(/\bHome\b/gi, "Domicile")
    .replace(/\bAway\b/gi, "Exterieur")
    .replace(/\bto win\b/gi, "vainqueur");
}

function translatePiece(value: string | undefined, context: TeamChoiceLabelContext): string {
  if (!value || !value.trim()) return "";

  const known = translateKnownSelection(value, context);
  if (known) return known;

  return translateFreeTextSelection(value, context);
}

export function formatTeamChoiceLabel(params: {
  recommendedMarket?: string;
  selection?: string;
  homeName: string;
  awayName: string;
  teamName?: string;
}): string {
  const context: TeamChoiceLabelContext = {
    homeName: params.homeName,
    awayName: params.awayName,
    teamName: params.teamName,
  };
  const marketLabel = translatePiece(params.recommendedMarket, context);
  const selectionLabel = translatePiece(params.selection, context);

  if (!selectionLabel) return marketLabel || "1X2";
  if (!marketLabel) return selectionLabel;

  const marketLower = marketLabel.toLowerCase();
  const selectionLower = selectionLabel.toLowerCase();
  if (selectionLower.includes(marketLower)) return selectionLabel;

  return `${marketLabel} - ${selectionLabel}`;
}
