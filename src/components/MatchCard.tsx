"use client";

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { cn } from '../lib/utils'; // Assuming cn utility for tailwind-merge
import { Game } from '../types/game'; // Import Game type
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc

interface MatchCardProps {
  game: Game; // Pass the full game object
}

const MatchCard: React.FC<MatchCardProps> = ({ game }) => {
  // Defensive checks for odds values
  const team1Odd = game.questions[0]?.odds?.team1 !== undefined ? game.questions[0].odds.team1.toFixed(2) : '-';
  const drawOdd = game.questions[0]?.odds?.draw !== undefined ? game.questions[0].odds.draw.toFixed(2) : '-';
  const team2Odd = game.questions[0]?.odds?.team2 !== undefined ? game.questions[0].odds.team2.toFixed(2) : '-';

  return (
    <Link to={`/games/${game.id}`} className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[230px] flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-white">
        
        {/* Date/Time Row */}
        <p className="text-base font-semibold text-center mt-2">{game.date} - {game.time}</p> 
        
        {/* Team Logos and Names Row */}
        <div className="flex items-center justify-between w-full px-2"> 
          <div className="flex flex-col items-center w-1/3"> 
            <img src={getLogoSrc(game.team1.logoIdentifier)} alt={game.team1.name} className="w-12 h-12 object-contain mb-1" /> 
            <span className="text-[10px] font-medium text-center">{game.team1.name}</span>
          </div>
          <span className="text-lg font-bold text-gray-400">VS</span>
          <div className="flex flex-col items-center w-1/3"> 
            <img src={getLogoSrc(game.team2.logoIdentifier)} alt={game.team2.name} className="w-12 h-12 object-contain mb-1" /> 
            <span className="text-[10px] font-medium text-center">{game.team2.name}</span>
          </div>
        </div>
        
        {/* Odds Display (without buttons) */}
        <div className="flex justify-center space-x-2 w-full mb-2">
          <div className="flex-1 py-1.5 px-3 rounded-md bg-[#01112D] text-gray-300 text-xs font-semibold text-center">
            {team1Odd}
          </div>
          <div className="flex-1 py-1.5 px-3 rounded-md bg-[#01112D] text-gray-300 text-xs font-semibold text-center">
            {drawOdd}
          </div>
          <div className="flex-1 py-1.5 px-3 rounded-md bg-[#01112D] text-gray-300 text-xs font-semibold text-center">
            {team2Odd}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;