"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allGamesData } from '../data/games'; // Import centralized game data
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MatchHeaderImage from '../components/MatchHeaderImage'; // Import the MatchHeaderImage component
import FullTimeCard from '../components/FullTimeCard'; // Import FullTimeCard
import TotalGoalsCard from '../components/TotalGoalsCard'; // Import the new TotalGoalsCard
import SimpleQuestionCard from '../components/SimpleQuestionCard'; // Import SimpleQuestionCard

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const game = allGamesData.find(g => g.id === gameId);

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
        className="bg-transparent rounded-[27px] p-8 shadow-lg mb-6" // Changed bg-vanta-blue-medium to bg-transparent
        style={{ clipPath: 'polygon(0% 0%, 25% 0%, 30% 50px, 70% 50px, 75% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      >
        <MatchHeaderImage game={game} />
      </div>

      {/* Render all question cards */}
      <div className="space-y-6">
        {game.questions.map((question) => {
          switch (question.type) {
            case 'win_match':
              return (
                <div key={question.id} className="bg-transparent rounded-[27px] p-8 shadow-lg"> {/* Changed bg-vanta-blue-medium to bg-transparent */}
                  <FullTimeCard game={game} question={question} />
                </div>
              );
            case 'btts':
            case 'total_goals_even':
            case 'is_draw': // Added 'is_draw' here
              return (
                <div key={question.id} className="bg-transparent rounded-[27px] p-8 shadow-lg"> {/* Changed bg-vanta-blue-medium to bg-transparent */}
                  <SimpleQuestionCard game={game} question={question} />
                </div>
              );
            case 'over_1_5_goals':
            case 'over_2_5_goals':
            case 'over_3_5_goals':
            case 'score_goals':
              return (
                <div key={question.id} className="bg-transparent rounded-[27px] p-8 shadow-lg"> {/* Changed bg-vanta-blue-medium to bg-transparent */}
                  <TotalGoalsCard game={game} question={question} />
                </div>
              );
            default:
              return null; // Don't render if question type is unknown
          }
        })}
      </div>
    </div>
  );
};

export default GameDetails;