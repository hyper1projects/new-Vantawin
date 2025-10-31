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
  return (
    // Outer Link: Gradient Background, Border Padding, and Corner Radius (27px)
    <Link 
      to={`/games/${game.id}`} 
      className="relative p-[3px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-[230px] h-[280px] flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
    >
      
      {/* Inner Div: Solid Background, Slightly Smaller Corner Radius (25px) */}
      <div className="bg-[#011B47] rounded-[25px] h-full w-full p-4 flex flex-col justify-between text-white">
        
        {/* Date/Time Row (Using 'Today' as a prefix and game.time for the time) */}
        <p className="text-base font-semibold text-center mt-0 pt-0">
            {/* You can use game.date here, or hardcode "Today" to match the design's style. 
               We'll use "Today" for a closer visual match, then the actual time. */}
            Today - {game.time}
        </p> 
        
        {/* Main Content Area: Use flex-grow to push it down and center the team section */}
        <div className="flex flex-col items-center justify-center flex-grow">
          {/* Team Logos and Names Row */}
          <div className="flex items-center justify-between w-full px-2"> 
            
            {/* Team 1 Logo/Name */}
            <div className="flex flex-col items-center w-1/3"> 
              <img 
                src={getLogoSrc(game.team1.logoIdentifier)} 
                alt={game.team1.name} 
                className="w-16 h-16 object-contain mb-1 rounded-full bg-gray-600" 
              /> 
              <span className="text-xs font-medium text-center mt-2">{game.team1.name}</span>
            </div>
            
            {/* Team 2 Logo/Name */}
            <div className="flex flex-col items-center w-1/3"> 
              <img 
                src={getLogoSrc(game.team2.logoIdentifier)} 
                alt={game.team2.name} 
                className="w-16 h-16 object-contain mb-1 rounded-full bg-gray-600" 
              /> 
              <span className="text-xs font-medium text-center mt-2">{game.team2.name}</span>
            </div>

          </div>
        </div>
        
        {/* Optional: Add a little space at the very bottom */}
        <div className="h-4"></div>
        
      </div>
    </Link>
  );
};

export default MatchCard;