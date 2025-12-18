// --- 1. The Core Betting Structures (Keep these, they are perfect) ---

export interface QuestionOption {
    id: string;      // CRITICAL: Used to track exactly what the user bet on
    label: string;   // e.g., "Home", "Over 2.5"
    odds: number;    // e.g., 1.55
}

export interface Question {
    id: string;      // e.g., "q_101"
    type: 'win_match' | 'score_goals' | 'btts' | 'over_1_5_goals' | 'over_2_5_goals' | 'over_3_5_goals' | 'total_goals_even' | 'is_draw';
    text: string;    // e.g., "Who will win?"
    options: QuestionOption[];
}

export interface Team {
    name: string;
    logoIdentifier: string;
    abbreviation: string;
}

// --- 2. The Raw Database Shape (NEW) ---
// This matches exactly what comes out of Supabase 'matches' table
export interface SupabaseMatch {
    id: string;
    start_time: string;      // ISO string from DB (e.g. "2025-12-18T19:00:00Z")
    league: string;
    is_live: boolean;        // DB usually uses snake_case
    home_team: Team;         // Assuming you store this as JSONB in DB
    away_team: Team;         // Assuming you store this as JSONB in DB
    questions: Question[];   // The JSONB column we discussed
}

// --- 3. The Frontend App Shape (Your existing interface) ---
// This is what your React components use.
export interface Game {
    id: string;
    start_time: string;
    time: string;            // Derived for display (e.g. "7:00 PM")
    date: string;            // Derived for display (e.g. "Today")
    team1: Team;             // Mapped from 'home_team'
    team2: Team;             // Mapped from 'away_team'
    league: string;
    isLive: boolean;         // Mapped from 'is_live'
    gameView: string;        // UI state (default to 'main' or similar)
    questions: Question[];
}

// --- 4. The Mapper Function (Crucial) ---
// Use this when fetching data: matches.map(formatMatchFromDB)
export const formatMatchFromDB = (match: SupabaseMatch): Game => {
    const dateObj = new Date(match.start_time);

    return {
        id: match.id,
        start_time: match.start_time,
        // Simple formatting (you can use date-fns if you want)
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: dateObj.toDateString() === new Date().toDateString() ? 'Today' : dateObj.toLocaleDateString(),

        // Map DB snake_case to Frontend camelCase
        team1: { ...match.home_team, logoIdentifier: match.home_team.logoIdentifier || match.home_team.abbreviation || match.home_team.name },
        team2: { ...match.away_team, logoIdentifier: match.away_team.logoIdentifier || match.away_team.abbreviation || match.away_team.name },
        league: match.league,
        isLive: match.is_live,

        questions: match.questions || [], // Safety fallback

        // Default frontend state
        gameView: 'markets',
    };
};