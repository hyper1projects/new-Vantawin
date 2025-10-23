"use client";

import React, { useState } from 'react'; // Import useState
import { Button } from './ui/button';
import { Star } from 'lucide-react';

interface OddscardProps {
  team1: { name: string; logo: string };
  team2: { name: string; logo: string };
  odds: { team1: number; draw: number; team2: number };
  time: string;
  date: string;
  league: string;
}

const Oddscard: React.FC<OddscardProps> = ({ team1, team2, odds, time, date, league }) => {
  const [isFavorited, setIsFavorited] = useState(false); // New state for favorite status

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited); // Toggle favorite status
    // In a real app, you would also save this to a backend or local storage
    console.log(`Game ${isFavorited ? 'unfavorited' : 'favorited'}!`);
  };

  return (
    <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full max-w-sm">
      {/* Top section: Favorite, Live, Time, Date, League */}
      <div className="flex justify-between items-center text-gray-400 text-xs mb-4">
        <div className="flex items-center space-x-2"> {/* Left side: Favorite & Live */}
          <button onClick={handleFavoriteClick} className="p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"> {/* Button for accessibility */}
            <Star
              className={`w-4 h-4 ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'} cursor-pointer hover:text-yellow-400`}
            />
          </button>
          <span className="flex items-center text-red-500 font-bold">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            LIVE
          </span>
        </div>
        <div className="flex items-center space-x-2"> {/* Right side: Time, Date, League */}
          <span>{time}</span>
          <span>{date}</span>
          <span>{league}</span>
        </div>
      </div>

      {/* Middle section: Teams and Odds */}
      <div className="flex justify-between items-center mb-4">
        {/* Teams display */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <img src={team1.logo} alt={team1.name} className="w-6 h-6 mr-2" />
            <span className="text-white font-semibold">{team1.name}</span>
          </div>
          <div className="flex items-center mt-2">
            <img src={team2.logo} alt={team2.name} className="w-6 h-6 mr-2" />
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

      {/* Bottom section: Game View link */}
      <div className="flex justify-end">
        <a href="#" className="text-gray-300 text-sm hover:underline">Game View &gt;</a>
      </div>
    </div>
  );
};

export default Oddscard;