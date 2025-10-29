"use client";

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import LeaderboardTable from '../components/LeaderboardTable';
import LeaderboardPodium from '../components/LeaderboardPodium';

const Leaderboard = () => {
  // Dummy data for the leaderboard with new fields
  const leaderboardEntries = [
    { rank: 1, playerName: 'VantaMaster', xp: 150000, winRate: 75.2, prizeNaira: 500000, isCurrentUser: false },
    { rank: 2, playerName: 'ProPredictor', xp: 120000, winRate: 70.5, prizeNaira: 250000, isCurrentUser: false },
    { rank: 3, playerName: 'GoalGetter', xp: 105000, winRate: 68.1, prizeNaira: 100000, isCurrentUser: false },
    { rank: 4, playerName: 'SportySpice', xp: 98000, winRate: 65.0, prizeNaira: 50000, isCurrentUser: false },
    { rank: 5, playerName: 'BetKing', xp: 92000, winRate: 62.8, prizeNaira: 25000, isCurrentUser: true }, // Example current user
    { rank: 6, playerName: 'AcePlayer', xp: 85000, winRate: 60.1, prizeNaira: 10000, isCurrentUser: false },
    { rank: 7, playerName: 'TopScorer', xp: 78000, winRate: 58.7, prizeNaira: 5000, isCurrentUser: false },
    { rank: 8, playerName: 'GameChanger', xp: 70000, winRate: 55.3, prizeNaira: 2500, isCurrentUser: false },
    { rank: 9, playerName: 'LuckyCharm', xp: 65000, winRate: 53.9, prizeNaira: 1000, isCurrentUser: false },
    { rank: 10, playerName: 'Fanatic', xp: 60000, winRate: 51.0, prizeNaira: 500, isCurrentUser: false },
  ];

  const top3Players = leaderboardEntries.filter(entry => entry.rank <= 3);
  const remainingPlayers = leaderboardEntries.filter(entry => entry.rank > 3);

  return (
    <div className="p-4">
      <SectionHeader title="Global Leaderboard" className="mb-6" textColor="text-vanta-text-light" />
      <LeaderboardPodium topPlayers={top3Players} className="mb-8" />
      <LeaderboardTable entries={remainingPlayers} />
    </div>
  );
};

export default Leaderboard;