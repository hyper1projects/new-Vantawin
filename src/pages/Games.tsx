"use client";

import React from 'react';
import MatchCard from '../components/MatchCard';
import LiveGamesSection from '../components/LiveGamesSection'; // Import the new LiveGamesSection

const Games = () => {
  // Dummy data for demonstration. In a real app, this would come from an API.
  const topGames = [
    { id: '1', team1: 'Team A', team2: 'Team B', time: '19:00', date: '2023-10-27', odds1: 1.5, oddsX: 3.2, odds2: 5.0 },
    { id: '2', team1: 'Team C', team2: 'Team D', time: '20:30', date: '2023-10-27', odds1: 2.1, oddsX: 3.0, odds2: 3.5 },
  ];

  const liveGames = [
    { id: 'live1', team1: 'Team X', team2: 'Team Y', time: 'LIVE', date: '2023-10-27', odds1: 1.8, oddsX: 3.0, odds2: 4.0 },
    { id: 'live2', team1: 'Team P', team2: 'Team Q', time: 'LIVE', date: '2023-10-27', odds1: 2.5, oddsX: 3.1, odds2: 2.8 },
  ];

  const premierLeagueGames = [
    { id: '3', team1: 'Arsenal', team2: 'Chelsea', time: '15:00', date: '2023-10-28', odds1: 2.0, oddsX: 3.4, odds2: 3.6 },
    { id: '4', team1: 'Man Utd', team2: 'Liverpool', time: '17:30', date: '2023-10-28', odds1: 2.8, oddsX: 3.3, odds2: 2.5 },
  ];

  return (
    <div className="p-4">
      {/* Top Games Section */}
      <h2 className="text-2xl font-bold mb-4">Top Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {topGames.map(game => (
          <MatchCard key={game.id} {...game} />
        ))}
      </div>

      {/* Live Section Header */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Live Section</h2>
      {/* Live Games Section - now using the new component */}
      <LiveGamesSection games={liveGames} />

      {/* Premier League Games Header */}
      <h2 className="text-2xl font-bold mb-4 mt-8">Premier League Games</h2>
      {/* Premier League Games Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {premierLeagueGames.map(game => (
          <MatchCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
};

export default Games;