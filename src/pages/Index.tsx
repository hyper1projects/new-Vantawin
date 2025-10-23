"use client";

import React from 'react';
import Oddscard from '../components/Oddscard';

const Index: React.FC = () => {
  // Define team information including name and logo identifier
  const teamAInfo = { name: 'Team A', logoIdentifier: 'teamA' };
  const teamBInfo = { name: 'Team B', logoIdentifier: 'teamB' };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Games</h1>
      <Oddscard
        time="7:00 PM"
        data="Today"
        teamA={teamAInfo}
        teamB={teamBInfo}
        gameView="View Game Details"
      />
      {/* You can add more Oddscard components here with different team data */}
      <div className="mt-8">
        <Oddscard
          time="8:30 PM"
          data="Tomorrow"
          teamA={{ name: 'Team C', logoIdentifier: 'teamB' }} {/* Using teamB logo for example */}
          teamB={{ name: 'Team D', logoIdentifier: 'teamA' }} {/* Using teamA logo for example */}
          gameView="View Matchup"
        />
      </div>
    </div>
  );
};

export default Index;