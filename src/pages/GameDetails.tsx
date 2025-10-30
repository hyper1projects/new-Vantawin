"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allGamesData } from '../data/games'; // Import centralized game data
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MatchHeaderImage from '../components/MatchHeaderImage'; // Import the MatchHeaderImage component
import FullTimeCard from '../components/FullTimeCard'; // Import FullTimeCard
import TotalGoalsCard from '../components/TotalGoalsCard'; // Import the new TotalGoalsCard

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const game = allGamesData.find(g => g.id === gameId);
  // Find a game specifically for the 'btts' question type
  const bttsGame = allGamesData.find(g => g.questionType === 'btts');
  // Find a game specifically for 'over_2_5_goals' question type for TotalGoalsCard
  const totalGoalsGame = allGamesData.find(g => g.questionType === 'over_2_5_goals');


  if (!game) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
        <p className="mb-4">The game you are looking for does not exist.</p>
        <Button onClick={() => navigate('/games')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px]">
          Go to Games
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 text-vanta-text-light">
      <Button
        onClick={() => navigate(-1)} // Go back to the previous page
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Games
      </Button>

      {/* Container for MatchHeaderImage with clipPath */}
      <div
        className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg mb-6"
        style={{ clipPath: 'polygon(0% 0%, 25% 0%, 30% 50px, 70% 50px, 75% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      >
        <MatchHeaderImage game={game} />
      </div>

      {/* First FullTimeCard (for win_match or other non-goal questions) */}
      <div className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg mb-6">
        <FullTimeCard game={game} />
      </div>

      {/* TotalGoalsCard for 'Will there be over 2.5 goals?' */}
      {totalGoalsGame && (
        <div className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg mb-6">
          <TotalGoalsCard game={totalGoalsGame} />
        </div>
      )}

      {/* FullTimeCard for 'Will both teams score?' */}
      {bttsGame && (
        <div className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg">
          <FullTimeCard game={bttsGame} />
        </div>
      )}
    </div>
  );
};

export default GameDetails;