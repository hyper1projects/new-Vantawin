"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Oddscard from '../components/Oddscard';
import { useMatchesContext } from '../context/MatchesContext';
import { cn } from '@/lib/utils';
import { Game } from '../types/game';

type GameFilter = 'All' | 'Live' | 'Upcoming';

const AllLaLigaGames: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<GameFilter>('All');
  const { games } = useMatchesContext();

  const filteredGames = games.filter(game => {
    if (game.league !== 'La Liga') return false; // Filter specifically for La Liga

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
  });

  const getButtonClasses = (filter: GameFilter) => {
    const isSelected = selectedFilter === filter;
    return cn(
      "size-sm rounded-[12px]",
      isSelected
        ? "bg-[#00EEEE] text-[#081028]"
        : "bg-[#0B295B] text-white hover:text-[#00EEEE] hover:bg-[#0B295B]"
    );
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back
      </Button>

      <SectionHeader title="All La Liga Games" className="mb-6" textColor="text-vanta-text-light" />

      <div className="flex space-x-1 w-full justify-start px-1 -mt-2 mb-4 border-b border-gray-700 pb-1">
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

      <div className="w-full flex flex-col space-y-4 px-1">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Oddscard key={game.id} game={game} />
          ))
        ) : (
          <p className="text-vanta-text-light text-center py-8">No La Liga games available for this filter.</p>
        )}
      </div>
    </div>
  );
};

export default AllLaLigaGames;