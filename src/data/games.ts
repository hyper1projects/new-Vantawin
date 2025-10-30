import { Game } from '../types/game';

export const allGamesData: Game[] = [
  {
    id: 'game-1',
    team1: { name: 'Manchester United', logoIdentifier: 'man_utd', abbreviation: 'MUN' },
    team2: { name: 'Liverpool', logoIdentifier: 'liverpool', abbreviation: 'LIV' },
    date: '2024-07-20T15:00:00Z',
    odds: { team1: 2.10, draw: 3.40, team2: 3.20 },
    questionType: 'win_match',
  },
  {
    id: 'game-2',
    team1: { name: 'Arsenal', logoIdentifier: 'arsenal', abbreviation: 'ARS' },
    team2: { name: 'Chelsea', logoIdentifier: 'chelsea', abbreviation: 'CHE' },
    date: '2024-07-21T17:30:00Z',
    odds: { team1: 1.90, draw: 3.60, team2: 3.80 },
    questionType: 'btts', // Both teams to score
  },
  {
    id: 'game-3',
    team1: { name: 'Tottenham Hotspur', logoIdentifier: 'tottenham', abbreviation: 'TOT' },
    team2: { name: 'Manchester City', logoIdentifier: 'man_city', abbreviation: 'MCI' },
    date: '2024-07-22T20:00:00Z',
    odds: { team1: 4.50, draw: 4.00, team2: 1.70 },
    questionType: 'win_match',
  },
  {
    id: 'game-4',
    team1: { name: 'Real Madrid', logoIdentifier: 'real_madrid', abbreviation: 'RMA' },
    team2: { name: 'Barcelona', logoIdentifier: 'barcelona', abbreviation: 'BAR' },
    date: '2024-07-23T19:00:00Z',
    odds: { team1: 2.30, draw: 3.30, team2: 2.90 },
    questionType: 'over_2_5_goals', // Over 2.5 goals
  },
  {
    id: 'game-5',
    team1: { name: 'Bayern Munich', logoIdentifier: 'bayern_munich', abbreviation: 'BAY' },
    team2: { name: 'Borussia Dortmund', logoIdentifier: 'dortmund', abbreviation: 'BVB' },
    date: '2024-07-24T18:00:00Z',
    odds: { team1: 1.60, draw: 4.20, team2: 5.00 },
    questionType: 'score_goals', // Specific team to score goals
  },
  {
    id: 'game-6',
    team1: { name: 'Paris Saint-Germain', logoIdentifier: 'psg', abbreviation: 'PSG' },
    team2: { name: 'Olympique Marseille', logoIdentifier: 'marseille', abbreviation: 'MAR' },
    date: '2024-07-25T21:00:00Z',
    odds: { team1: 1.80, draw: 3.70, team2: 4.20 },
    questionType: 'btts',
  },
];