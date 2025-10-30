export interface Team {
  name: string;
  logoIdentifier: string; // e.g., 'man_utd', 'liverpool'
  abbreviation: string; // Added abbreviation for team names
}

export interface Odds {
  team1: number;
  draw?: number; // Draw odds are optional
  team2: number;
}

export interface Game {
  id: string;
  team1: Team;
  team2: Team;
  date: string; // e.g., "2024-07-20T15:00:00Z"
  odds: Odds;
  questionType: 'win_match' | 'btts' | 'score_goals' | 'over_2_5_goals'; // Added questionType
}