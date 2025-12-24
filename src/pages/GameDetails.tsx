"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchesContext } from '../context/MatchesContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MatchHeaderImage from '../components/MatchHeaderImage';
import FullTimeCard from '../components/FullTimeCard';
import TotalGoalsCard from '../components/TotalGoalsCard';
import SimpleQuestionCard from '../components/SimpleQuestionCard';

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { games, loading, error } = useMatchesContext();

  const game = games.find(g => g.id === gameId);

  if (loading && !game) {
    return <div className="p-8 text-center text-vanta-text-light">Loading match details...</div>;
  }

  if (error && !game) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Error Loading Games</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-vanta-neon-blue text-vanta-blue-dark">
          Retry
        </Button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
        <p className="mb-4">The game you are looking for does not exist.</p>
        <p className="text-xs text-gray-500">Requested ID: {gameId}</p>
        <Button onClick={() => navigate('/games')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px]">
          Go to Games
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 text-vanta-text-light">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Games
      </Button>

      <div
        className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg mb-6"
        style={{ clipPath: 'polygon(0% 0%, 25% 0%, 30% 50px, 70% 50px, 75% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
      >
        <MatchHeaderImage game={game} />
      </div>

      <div className="space-y-6">
        {game.questions.map((question) => {
          switch (question.type) {
            case 'win_match':
              return (
                <div key={question.id} className="bg-transparent rounded-[27px] p-8 shadow-lg">
                  <FullTimeCard game={game} question={question} />
                </div>
              );
            case 'btts':
            case 'total_goals_even':
            case 'is_draw':
              return (
                <div key={question.id} className="bg-transparent rounded-[27px] p-8 shadow-lg">
                  <SimpleQuestionCard game={game} question={question} />
                </div>
              );
            case 'over_1_5_goals':
            case 'over_2_5_goals':
            case 'over_3_5_goals':
            case 'score_goals':
              return (
                <div key={question.id} className="bg-transparent rounded-[27px] p-8 shadow-lg">
                  <TotalGoalsCard game={game} question={question} />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default GameDetails;