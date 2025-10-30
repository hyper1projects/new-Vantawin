"use client";

import { Game } from '../types/game';

export const allGamesData: Game[] = [
  {
    id: 'game1',
    date: '2023-10-27T18:00:00Z',
    team1: { name: 'Manchester Utd', logoIdentifier: 'man_utd' },
    team2: { name: 'Liverpool', logoIdentifier: 'liverpool' },
    odds: { team1: 2.10, draw: 3.40, team2: 3.20 },
    questionType: 'win_match',
  },
  {
    id: 'game2_over2_5', // Unique ID for over 2.5 goals
    date: '2023-10-27T18:00:00Z',
    team1: { name: 'Manchester Utd', logoIdentifier: 'man_utd' },
    team2: { name: 'Liverpool', logoIdentifier: 'liverpool' },
    odds: { team1: 1.80, team2: 2.00 }, // Yes/No odds
    questionType: 'over_2_5_goals',
  },
  {
    id: 'game3_btts', // Unique ID for both teams to score
    date: '2023-10-27T18:00:00Z',
    team1: { name: 'Manchester Utd', logoIdentifier: 'man_utd' },
    team2: { name: 'Liverpool', logoIdentifier: 'liverpool' },
    odds: { team1: 1.70, team2: 2.10 }, // Yes/No odds
    questionType: 'btts',
  },
  {
    id: 'game4_over3_5', // NEW: Unique ID for over 3.5 goals
    date: '2023-10-27T18:00:00Z',
    team1: { name: 'Manchester Utd', logoIdentifier: 'man_utd' },
    team2: { name: 'Liverpool', logoIdentifier: 'liverpool' },
    odds: { team1: 2.80, team2: 1.40 }, // Yes/No odds
    questionType: 'over_3_5_goals',
  },
  // You can add more games here if needed
];