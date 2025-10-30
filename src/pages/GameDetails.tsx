"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Game } from '../types/game'; // Assuming Game type is defined
import SimpleQuestionCard from '../components/SimpleQuestionCard'; // Import the SimpleQuestionCard
import { gamesData } from '../data/gamesData'; // Import your mock data

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    // In a real application, you would fetch game details from an API
    const foundGame = gamesData.find(g => g.id === id);
    setGame(foundGame || null);
  }, [id]);

  if (!game) {
    return <div className="text-white text-center p-8">Loading game details...</div>;
  }

  return (
    <div className="min-h-screen bg-vanta-blue-dark text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8 text-vanta-neon-blue">Game Details</h1>
      
      {/* Container for SimpleQuestionCard */}
      <div className="bg-transparent rounded-[27px] p-8 shadow-lg"> {/* Changed background to transparent */}
        <SimpleQuestionCard game={game} />
      </div>
    </div>
  );
};

export default GameDetails;