import { Game } from '../types/game';

export const allGamesData: Game[] = [
  {
    id: 'game-1', // Note: In DB this would be UUID
    time: '7:00 PM',
    start_time: '2024-12-17T19:00:00Z', // Added compliant field
    date: 'Today',
    team1: { name: 'Crystal Palace', logoIdentifier: 'CRY', abbreviation: 'CRY' },
    team2: { name: 'West Ham United', logoIdentifier: 'WHU', abbreviation: 'WHU' },
    league: 'Premier League',
    isLive: false,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_1_home', label: 'Crystal Palace', odds: 1.5 },
          { id: 'opt_1_draw', label: 'Draw', odds: 3.0 },
          { id: 'opt_1_away', label: 'West Ham United', odds: 2.5 }
        ]
      },
      {
        id: 'over_1_5_goals_q',
        type: 'over_1_5_goals',
        text: 'Will there be 2 or more goals?',
        options: [
          { id: 'opt_2_yes', label: 'Yes', odds: 1.2 },
          { id: 'opt_2_no', label: 'No', odds: 3.5 }
        ]
      },
      {
        id: 'over_2_5_goals_q',
        type: 'over_2_5_goals',
        text: 'Will there be 3 or more goals?',
        options: [
          { id: 'opt_3_yes', label: 'Yes', odds: 1.8 },
          { id: 'opt_3_no', label: 'No', odds: 2.0 }
        ]
      },
      {
        id: 'over_3_5_goals_q',
        type: 'over_3_5_goals',
        text: 'Will there be 4 or more goals?',
        options: [
          { id: 'opt_4_yes', label: 'Yes', odds: 2.5 },
          { id: 'opt_4_no', label: 'No', odds: 1.5 }
        ]
      },
      {
        id: 'btts_q',
        type: 'btts',
        text: 'Will both teams score?',
        options: [
          { id: 'opt_5_yes', label: 'Yes', odds: 1.7 },
          { id: 'opt_5_no', label: 'No', odds: 2.1 }
        ]
      },
      {
        id: 'is_draw_q_1',
        type: 'is_draw',
        text: 'Will the game end as a draw?',
        options: [
          { id: 'opt_6_yes', label: 'Yes', odds: 3.0 },
          { id: 'opt_6_no', label: 'No', odds: 1.3 }
        ]
      },
    ],
  },
  {
    id: 'game-2',
    time: '8:30 PM',
    start_time: '2024-12-18T20:30:00Z',
    date: 'Tomorrow',
    team1: { name: 'Manchester United', logoIdentifier: 'MANU', abbreviation: 'MUN' },
    team2: { name: 'Leicester City', logoIdentifier: 'LEIC', abbreviation: 'LEI' },
    league: 'Premier League',
    isLive: true,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_7_home', label: 'Manchester United', odds: 2.1 },
          { id: 'opt_7_draw', label: 'Draw', odds: 3.2 },
          { id: 'opt_7_away', label: 'Leicester City', odds: 1.9 }
        ]
      },
      {
        id: 'score_goals_man_utd',
        type: 'score_goals',
        text: `Will Manchester United score more than 2 goals?`,
        options: [
          { id: 'opt_8_yes', label: 'Yes', odds: 2.5 },
          { id: 'opt_8_no', label: 'No', odds: 1.5 }
        ]
      },
      {
        id: 'total_goals_even_q',
        type: 'total_goals_even',
        text: 'Will the total number of goals be even?',
        options: [
          { id: 'opt_9_yes', label: 'Yes', odds: 1.9 },
          { id: 'opt_9_no', label: 'No', odds: 1.9 }
        ]
      },
      {
        id: 'is_draw_q_2',
        type: 'is_draw',
        text: 'Will the game end as a draw?',
        options: [
          { id: 'opt_10_yes', label: 'Yes', odds: 3.2 },
          { id: 'opt_10_no', label: 'No', odds: 1.25 }
        ]
      },
    ],
  },
  {
    id: 'game-3',
    time: '9:00 PM',
    start_time: '2024-12-17T21:00:00Z',
    date: 'Today',
    team1: { name: 'Arsenal', logoIdentifier: 'ARS', abbreviation: 'ARS' },
    team2: { name: 'Chelsea', logoIdentifier: 'CHE', abbreviation: 'CHE' },
    league: 'Premier League',
    isLive: false,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_11_home', label: 'Arsenal', odds: 1.8 },
          { id: 'opt_11_draw', label: 'Draw', odds: 3.5 },
          { id: 'opt_11_away', label: 'Chelsea', odds: 2.2 }
        ]
      },
      {
        id: 'over_1_5_goals_q',
        type: 'over_1_5_goals',
        text: 'Will there be 2 or more goals?',
        options: [
          { id: 'opt_12_yes', label: 'Yes', odds: 1.3 },
          { id: 'opt_12_no', label: 'No', odds: 3.0 }
        ]
      },
      {
        id: 'btts_q',
        type: 'btts',
        text: 'Will both teams score?',
        options: [
          { id: 'opt_13_yes', label: 'Yes', odds: 1.6 },
          { id: 'opt_13_no', label: 'No', odds: 2.2 }
        ]
      },
    ],
  },
  {
    id: 'game-4',
    time: '6:00 PM',
    start_time: '2024-12-17T18:00:00Z',
    date: 'Today',
    team1: { name: 'Liverpool', logoIdentifier: 'LIV', abbreviation: 'LIV' },
    team2: { name: 'Everton', logoIdentifier: 'EVE', abbreviation: 'EVE' },
    league: 'Premier League',
    isLive: false,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_14_home', label: 'Liverpool', odds: 1.2 },
          { id: 'opt_14_draw', label: 'Draw', odds: 4.0 },
          { id: 'opt_14_away', label: 'Everton', odds: 6.0 }
        ]
      },
      {
        id: 'over_2_5_goals_q',
        type: 'over_2_5_goals',
        text: 'Will there be 3 or more goals?',
        options: [
          { id: 'opt_15_yes', label: 'Yes', odds: 1.5 },
          { id: 'opt_15_no', label: 'No', odds: 2.5 }
        ]
      },
      {
        id: 'over_3_5_goals_q',
        type: 'over_3_5_goals',
        text: 'Will there be 4 or more goals?',
        options: [
          { id: 'opt_16_yes', label: 'Yes', odds: 2.0 },
          { id: 'opt_16_no', label: 'No', odds: 1.7 }
        ]
      },
      {
        id: 'is_draw_q_3',
        type: 'is_draw',
        text: 'Will the game end as a draw?',
        options: [
          { id: 'opt_17_yes', label: 'Yes', odds: 4.0 },
          { id: 'opt_17_no', label: 'No', odds: 1.2 }
        ]
      },
    ],
  },
  {
    id: 'game-5',
    time: '10:00 PM',
    start_time: '2024-12-18T22:00:00Z',
    date: 'Tomorrow',
    team1: { name: 'Real Madrid', logoIdentifier: 'RMA', abbreviation: 'RMA' },
    team2: { name: 'Barcelona', logoIdentifier: 'BAR', abbreviation: 'BAR' },
    league: 'La Liga',
    isLive: true,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_18_home', label: 'Real Madrid', odds: 2.0 },
          { id: 'opt_18_draw', label: 'Draw', odds: 3.1 },
          { id: 'opt_18_away', label: 'Barcelona', odds: 2.0 }
        ]
      },
      {
        id: 'over_1_5_goals_q',
        type: 'over_1_5_goals',
        text: 'Will there be 2 or more goals?',
        options: [
          { id: 'opt_19_yes', label: 'Yes', odds: 1.1 },
          { id: 'opt_19_no', label: 'No', odds: 4.0 }
        ]
      },
      {
        id: 'over_2_5_goals_q',
        type: 'over_2_5_goals',
        text: 'Will there be 3 or more goals?',
        options: [
          { id: 'opt_20_yes', label: 'Yes', odds: 1.6 },
          { id: 'opt_20_no', label: 'No', odds: 2.2 }
        ]
      },
      {
        id: 'score_goals_real_madrid',
        type: 'score_goals',
        text: `Will Real Madrid score more than 2 goals?`,
        options: [
          { id: 'opt_21_yes', label: 'Yes', odds: 2.2 },
          { id: 'opt_21_no', label: 'No', odds: 1.7 }
        ]
      },
      {
        id: 'btts_q',
        type: 'btts',
        text: 'Will both teams score?',
        options: [
          { id: 'opt_22_yes', label: 'Yes', odds: 1.5 },
          { id: 'opt_22_no', label: 'No', odds: 2.3 }
        ]
      },
      {
        id: 'is_draw_q_4',
        type: 'is_draw',
        text: 'Will the game end as a draw?',
        options: [
          { id: 'opt_23_yes', label: 'Yes', odds: 3.1 },
          { id: 'opt_23_no', label: 'No', odds: 1.3 }
        ]
      },
    ],
  },
  {
    id: 'game-6',
    time: '5:00 PM',
    start_time: '2024-12-16T17:00:00Z',
    date: 'Yesterday',
    team1: { name: 'Bayern Munich', logoIdentifier: 'BAY', abbreviation: 'BAY' },
    team2: { name: 'Borussia Dortmund', logoIdentifier: 'DOR', abbreviation: 'DOR' },
    league: 'Bundesliga',
    isLive: false,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_24_home', label: 'Bayern Munich', odds: 1.6 },
          { id: 'opt_24_draw', label: 'Draw', odds: 3.8 },
          { id: 'opt_24_away', label: 'Borussia Dortmund', odds: 4.5 }
        ]
      },
      {
        id: 'over_2_5_goals_q',
        type: 'over_2_5_goals',
        text: 'Will there be 3 or more goals?',
        options: [
          { id: 'opt_25_yes', label: 'Yes', odds: 1.4 },
          { id: 'opt_25_no', label: 'No', odds: 2.8 }
        ]
      },
      {
        id: 'over_3_5_goals_q',
        type: 'over_3_5_goals',
        text: 'Will there be 4 or more goals?',
        options: [
          { id: 'opt_26_yes', label: 'Yes', odds: 1.8 },
          { id: 'opt_26_no', label: 'No', odds: 2.0 }
        ]
      },
    ],
  },
  {
    id: 'game-7',
    time: '5:00 PM',
    start_time: '2024-12-17T17:00:00Z',
    date: 'Today',
    team1: { name: 'Atletico Madrid', logoIdentifier: 'ATM', abbreviation: 'ATM' },
    team2: { name: 'Sevilla', logoIdentifier: 'SEV', abbreviation: 'SEV' },
    league: 'La Liga',
    isLive: false,
    gameView: 'View Game Details',
    questions: [
      {
        id: 'full_time_result',
        type: 'win_match',
        text: 'What team will win this game?',
        options: [
          { id: 'opt_27_home', label: 'Atletico Madrid', odds: 2.3 },
          { id: 'opt_27_draw', label: 'Draw', odds: 3.0 },
          { id: 'opt_27_away', label: 'Sevilla', odds: 3.1 }
        ]
      },
      {
        id: 'btts_q',
        type: 'btts',
        text: 'Will both teams score?',
        options: [
          { id: 'opt_28_yes', label: 'Yes', odds: 1.8 },
          { id: 'opt_28_no', label: 'No', odds: 2.0 }
        ]
      },
      {
        id: 'is_draw_q_5',
        type: 'is_draw',
        text: 'Will the game end as a draw?',
        options: [
          { id: 'opt_29_yes', label: 'Yes', odds: 3.0 },
          { id: 'opt_29_no', label: 'No', odds: 1.3 }
        ]
      },
    ],
  },
];