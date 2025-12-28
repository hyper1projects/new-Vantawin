"use client";

import React, { useState } from 'react';
import Oddscard from './Oddscard';
import { Game } from '../types/game';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMatchesContext } from '../context/MatchesContext';
import CollapsibleSection from './CollapsibleSection';
import { useNavigate } from 'react-router-dom';
import { GameCardSkeleton } from './skeletons/GameCardSkeleton';

type GameFilter = 'All' | 'Live' | 'Upcoming';

const TopGamesSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('All');
  const navigate = useNavigate();
  const { games, loading } = useMatchesContext();

  const filteredGames = games.filter(game => {
    if (selectedFilter === 'All') {
      return true;
    }
    if (selectedFilter === 'Live') {
      return game.isLive;
    }
    if (selectedFilter === 'Upcoming') {
      return !game.isLive;
    }
    return false;
  }).slice(0, 10);

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
    navigate('/games/top-games');
  };

  return (
    <div className="flex flex-col items-center space-y-2 bg-vanta-blue-medium rounded-[18px] shadow-sm pb-2">
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

      <div className="w-full flex flex-col space-y-1 px-1">
        {loading ? (
          [...Array(3)].map((_, i) => <div className="w-full" key={i}><GameCardSkeleton /></div>)
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div className="w-full" key={game.id}>
              <Oddscard
                key={game.id}
                game={game}
              />
            </div>
          ))
        ) : (
          <p className="text-vanta-text-light text-center py-4">No games found for this filter.</p>
        )}
      </div>

      <div className="w-full flex justify-end px-2 pt-2 pb-1">
        <Button
          className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[8px] px-4 py-1.5 text-sm"
          onClick={handleShowMoreClick}
        >
          Show More
        </Button>
      </div>
    </div>
  );
};

export default TopGamesSection;