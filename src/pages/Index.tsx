"use client";

import React from 'react';
import Oddscard from '../components/Oddscard';

const Index: React.FC = () => {
  // Define team information including name and logo identifier
  const team1Info = { name: 'Team A', logoIdentifier: 'teamA' }; // Renamed to team1Info
  const team2Info = { name: 'Team B', logoIdentifier: 'teamB' }; // Renamed to team2Info

  // Placeholder odds data
  const defaultOdds = { team1: 1.5, draw: 3.0, team2: 2.5 };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Games</h1>
      <Oddscard
        time="7:00 PM"
        date="Today" // Renamed from 'data' to 'date'
        team1={team1Info} // Passed as team1
        team2={team2Info} // Passed as team2
        odds={defaultOdds} // Added odds prop
        league="Premier League" // Added league prop
        isLive={false} // Added isLive prop
        gameView="View Game Details" // Added gameView prop
      />
      {/* You can add more Oddscard components here with different team data */}
      <div className="mt-8">
        <Oddscard
          time="8:30 PM"
          date="Tomorrow"
          team1={{ name: 'Team C', logoIdentifier: 'teamB' }} // Passed as team1
          team2={{ name: 'Team D', logoIdentifier: 'teamA' }} // Passed as team2
          odds={{ team1: 2.1, draw: 3.2, team2: 1.9 }} // Added odds prop
          league="La Liga" // Added league prop
          isLive={true} // Added isLive prop
          gameView="View Matchup" // Added gameView prop
        />
      </div>
    </div>
  );
};

export default Index;