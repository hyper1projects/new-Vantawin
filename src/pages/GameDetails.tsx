"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatchesContext } from '../context/MatchesContext'; // Import centralized game data
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MatchHeaderImage from '../components/MatchHeaderImage'; // Import the MatchHeaderImage component
import FullTimeCard from '../components/FullTimeCard'; // Import FullTimeCard
import TotalGoalsCard from '../components/TotalGoalsCard'; // Import the new TotalGoalsCard
import SimpleQuestionCard from '../components/SimpleQuestionCard'; // Import SimpleQuestionCard
import { allGamesData } from '../data/games'; // Import fallback data

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { games, loading, error } = useMatchesContext();

  console.log("GameDetails: Mounted. Params ID:", gameId);
  console.log("GameDetails: Context Loading:", loading);
  console.log("GameDetails: Total Games in Context:", games.length);

  // Fallback Logic: Try to find game in Context, otherwise look in Mock Data
  const contextGame = games.find(g => g.id === gameId);
  const mockGame = allGamesData.find(g => g.id === gameId);
  const game = contextGame || mockGame;

  // Handle loading state only if we don't have a game found yet (and we rely on context)
  if (loading && !game) {
    console.log("GameDetails: Loading state active.");
    return <div className="p-8 text-center text-vanta-text-light">Loading match details...</div>;
  }

  if (error && !game) {
    console.error("GameDetails: Error detected:", error);
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
    console.warn("GameDetails: Game NOT found for ID:", gameId);
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

  console.log("GameDetails: Game found:", game.team1.name, "vs", game.team2.name);


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
        className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg mb-6" // Changed bg-transparent back to bg-vanta-blue-medium
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