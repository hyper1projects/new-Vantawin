export interface Team {
    name: string;
    logoIdentifier: string; // This is the key that maps to the logo in logoMap.ts
}

export interface Odds {
    team1: number;
    draw: number;
    team2: number;
}

export interface Game {
    id: string;
    time: string;
    date: string;
    team1: Team;
    team2: Team;
    odds: Odds;
    league: string;
    isLive: boolean;
    gameView: string;
}