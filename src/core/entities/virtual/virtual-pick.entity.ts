export interface VirtualPick {
    home_team: string;
    away_team: string;
    home_league: string;
    away_league: string;
    market: string;
    market_display: string;
    outcome: string;
    confidence: number;
    all_predictions: Record<string, Record<string, number>>;
}
