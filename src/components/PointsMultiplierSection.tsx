"use client";

import React from 'react';
import MatchCard from './MatchCard';

const PointsMultiplierSection = () => {
  return (
    <div className="w-full py-8 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-left tracking-tight">Points Multiplier</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
        <MatchCard
          date="Today"
          team1={{ name: "Team A", logo: "/path/to/teamA-logo.png" }}
          team2={{ name: "Team B", logo: "/path/to/teamB-logo.png" }}
          time="7:00 PM"
          multiplier="2.5x"
        />
        <MatchCard
          date="Tomorrow"
          team1={{ name: "Team C", logo: "/path/to/teamC-logo.png" }}
          team2={{ name: "Team D", logo: "/path/to/teamD-logo.png" }}
          time="8:30 PM"
          multiplier="3.0x"
        />
        <MatchCard
          date="Upcoming"
          team1={{ name: "Team E", logo: "/path/to/teamE-logo.png" }}
          team2={{ name: "Team F", logo: "/path/to/teamF-logo.png" }}
          time="6:00 PM"
          multiplier="2.0x"
        />
      </div>
    </div>
  );
};

export default PointsMultiplierSection;