export interface Team {
    name: string;
    logoIdentifier: string; // This is the key that maps to the logo in logoMap.ts
    abbreviation: string; // Added abbreviation property
}

export interface Odds {
    team1?: number; // Optional for 'win_match'
    draw?: number;  // Optional for 'win_match'
    team2?: number; // Optional for 'win_match'
    yes?: number;   // Optional for 'yes/no' questions
    no?: number;    // Optional for 'yes/no' questions
}

export interface Question {
    id: string; // Unique ID for the question within the game (e.g., 'full_time_result', 'over_2_5_goals_q')
    type: 'win_match' | 'score_goals' | 'btts' | 'over_1_5_goals' | 'over_2_5_goals' | 'over_3_5_goals' | 'total_goals_even' | 'is_draw'; // Added 'is_draw' type
    text: string; // The actual question text
    odds: Odds; // Odds specific to this question
}

export interface Game {
    id: string;
    time: string;
    date: string;
    team1: Team;
    team2: Team;
    league: string;
    isLive: boolean;
    gameView: string;
    questions: Question[]; // Array of questions for this game
}