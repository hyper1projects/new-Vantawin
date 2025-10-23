"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { getLogoSrc } from '../utils/logoMap'; // Import the logo utility

interface OddscardProps {
  team1: { name: string; logo: string }; // 'logo' is now an identifier string (e.g., "teamA")
  team2: { name: string; logo: string }; // 'logo' is now an identifier string (e.g., "teamB")
  odds: { team1: number; draw: number; team2: number };
  time: string;
  date: string;
  league: string;
  isLive: boolean;
}

const Oddscard: React.FC<OddscardProps> = ({ team1, team2, odds, time, date, league, isLive }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    console.log(`Game ${isFavorited ? 'unfavorited' : 'favorited'}!`);
  };

  return (
    <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full max-w-sm">
      {/* Top section: Time/Live & Date (left), League (right) */}
      <div className="flex justify-between items-center text-gray-400 text-xs mb-4">
        <div className="flex items-center space-x-2"> {/* Left side: Time/Live, Date & Live indicator */}
          <span>{isLive ? 'LIVE' : time}</span> {/* Display 'LIVE' or actual time */}
          <span>{date}</span> {/* Moved date here */}
          {isLive && ( // Conditionally render LIVE indicator
            <span className="flex items-center text-red-500 font-bold">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2"> {/* Right side: League */}
          <span>{league}</span>
        </div>
      </div>

      {/* Middle section: Teams and Odds */}
      <div className="flex justify-between items-center mb-4">
        {/* Teams display */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <img src={getLogoSrc(team1.logo)} alt={team1.name} className="w-6 h-6 mr-2 rounded-full" /> {/* Using local logo */}
            <span className="text-white font-semibold">{team1.name}</span>
          </div>
          <div className="flex items-center mt-2">
            <img src={getLogoSrc(team2.logo)} alt={team2.name} className="w-6 h-6 mr-2 rounded-full" /> {/* Using local logo */}
            <span className="text-white font-semibold">{team2.name}</span>
          </div>
        </div>

        {/* Odds buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-[#0B295B] text-white border-gray-600 hover:bg-gray-700 h-8 px-3 text-sm">{odds.team1}</Button>
          <Button variant="outline" className="bg-[#0B295B] text-white border-gray-600 hover:bg-gray-700 h-8 px-3 text-sm">{odds.draw}</Button>
          <Button variant="outline" className="bg-[#0B295B] text-white border-gray-600 hover:bg-gray-700 h-8 px-3 text-sm">{odds.team2}</Button>
        </div>
      </div>

      {/* Bottom section: Favorite icon and Game View link */}
      <div className="flex justify-between items-center">
        <button onClick={handleFavoriteClick} className="p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400">
          <Star
            className={`w-4 h-4 ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'} cursor-pointer hover:text-yellow-400`}
          />
        </button>
        <a href="#" className="text-gray-300 text-sm hover:underline">Game View &gt;</a>
      </div>
    </div>
  );
};

export default Oddscard;