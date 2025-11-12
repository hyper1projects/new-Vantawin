"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import Oddscard from '../components/Oddscard';
import { allGamesData } from '../data/games';
import { cn } from '@/lib/utils';
import { Game } from '../types/game';

const AllLiveGames: React.FC = () => {
  const navigate = useNavigate();

  // Filter games to show only live games, as this page is dedicated to them
  const filteredGames = allGamesData.filter(game => game.isLive);

  return (
    <div className="p-4">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back
      </Button>

      <SectionHeader title="All Live Games" className="mb-6" textColor="text-vanta-text-light" />

      <div className="w-full flex flex-col space-y-4 px-1">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <Oddscard key={game.id} game={game} />
          ))
        ) : (
          <p className="text-vanta-text-light text-center py-8">No live games available.</p>
        )}
      </div>
    </div>
  );
};

export default AllLiveGames;