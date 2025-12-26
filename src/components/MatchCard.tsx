"use client";

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { cn } from '../lib/utils'; // Assuming cn utility for tailwind-merge
import { Game } from '../types/game'; // Import Game type
import TeamLogo from './TeamLogo'; // Import the new TeamLogo component

interface MatchCardProps {
  game: Game; // Pass the full game object
  useAbbreviations?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ game, useAbbreviations }) => {
  const team1Name = useAbbreviations ? game.team1.name.substring(0, 3).toUpperCase() : game.team1.name;
  const team2Name = useAbbreviations ? game.team2.name.substring(0, 3).toUpperCase() : game.team2.name;

  return (
    <div className="relative p-[2px] rounded-[20px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[180px] h-[180px] flex-shrink-0">
      {/* Wrap the inner content with Link to navigate to game details */}
      <Link to={`/games/${game.id}`} className="bg-[#011B47] rounded-[20px] h-full w-full p-3 flex flex-col justify-between text-white">

        {/* Date/Time Row */}
        {/* Date/Time Row */}
        <p className="text-xs font-medium text-center mt-2 text-white">{game.date} - {game.time}</p>

        {/* Main Content Area: Use flex-grow to push it down and center the team section */}
        <div className="flex flex-col items-center justify-center flex-grow">
          {/* Team Logos and Names Row */}
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex flex-col items-center w-1/3">
              <TeamLogo teamName={game.team1.name} alt={game.team1.name} className="w-12 h-12 object-contain mb-1" />
              <span className="text-xs font-medium text-center">{team1Name}</span>
            </div>
            <span className="text-lg font-bold text-gray-400">VS</span>
            <div className="flex flex-col items-center w-1/3">
              <TeamLogo teamName={game.team2.name} alt={game.team2.name} className="w-12 h-12 object-contain mb-1" />
              <span className="text-xs font-medium text-center">{team2Name}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MatchCard;