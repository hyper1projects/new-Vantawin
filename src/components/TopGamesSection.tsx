"use client";

import React, { useState } from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game'; // Ensure Game type is imported
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { allGamesData } from '../data/games'; // Import centralized game data
import CollapsibleSection from './CollapsibleSection'; // Import the new CollapsibleSection
import { useNavigate } from 'react-router-dom'; // Import useNavigate

type GameFilter = 'All' | 'Live' | 'Upcoming';

const TopGamesSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('All');
  const navigate = useNavigate(); // Initialize useNavigate

  // Filter games based on the selectedFilter from allGamesData
  const filteredGames = allGamesData.filter(game => {
    if (selectedFilter === 'All') {
      return true;
    }
    if (selectedFilter === 'Live') {
      return game.isLive;
    }
    if (selectedFilter === 'Upcoming') {
      return !game.isLive; // Assuming 'Upcoming' means not live
    }
    return false;
  }).slice(0, 10); // Display the first 10 filtered games for "Top Games"

  const getButtonClasses = (filter: GameFilter) => {
    const isSelected = selectedFilter === filter;
    return cn(
      "size-sm rounded-[12px]",
      isSelected
        ? "bg-[#00EEEE] text-[#081028]"
        : "bg-[#0B295B] text-white hover:text-[#00EEEE] hover:bg-[#0B295B]"
    );
  };

  const handleShowMoreClick = () => {
    navigate('/games/top-games'); // Navigate to the new AllTopGames page
  };

  return (
    <div className="flex flex-col items-center space-y-2 bg-vanta-blue-medium rounded-[18px] shadow-sm pb-2">
      {/* Header wrapper div now extends full width */}
      <div className="w-full bg-[#0D2C60] rounded-t-[18px]">
        <SectionHeader title="Top Games" className="w-full" textColor="text-white" />
      </div>
      
      <div className="flex space-x-1 w-full justify-start px-1 -mt-2 mb-1 border-b border-gray-700 pb-1">
        <Button 
          onClick={() => setSelectedFilter('All')}
          className={getButtonClasses('All')}
        >
          All
        </Button>
        <Button 
          onClick={() => setSelectedFilter('Live')}
          className={getButtonClasses('Live')}
        >
          Live
        </Button>
        <Button 
          onClick={() => setSelectedFilter('Upcoming')}
          className={getButtonClasses('Upcoming')}
        >
          Upcoming
        </Button>
      </div>

      {/* Wrapper div for Oddscards - now stacking vertically */}
      <div className="w-full flex flex-col space-y-1 px-1">
        {filteredGames.map((game) => (
          <div className="w-full" key={game.id}>
            <Oddscard
              key={game.id}
              game={game} // Pass the full game object
            />
          </div>
        ))}
      </div>

      {/* Show More Button positioned to bottom right */}
      <div className="w-full flex justify-end px-1 pt-1">
        <Button 
          className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[8px] px-2 py-0.5 text-xs"
          onClick={handleShowMoreClick} // Updated onClick handler
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default TopGamesSection;