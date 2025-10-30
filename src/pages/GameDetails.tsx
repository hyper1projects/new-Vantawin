"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Game } from '../types/game'; // Import Game type
import SimpleQuestionCard from '../components/SimpleQuestionCard'; // Import the SimpleQuestionCard

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [gameDetails, setGameDetails] = useState<Game | null>(null);

  useEffect(() => {
    // In a real application, you would fetch game details from an API here
    // For now, we'll use a dummy game object based on the gameId
    if (gameId) {
      const dummyGame: Game = {
        id: gameId,
        time: '20:00',
        date: '2023-10-27',
        team1: { name: 'Real Madrid', logoIdentifier: 'RMA' },
        team2: { name: 'Barcelona', logoIdentifier: 'BAR' },
        odds: { team1: 2.10, draw: 3.40, team2: 3.20 },
        league: 'La Liga',
        isLive: false,
        gameView: 'Details',
        questionType: 'win_match', // Ensure this is set for the question card
      };
      setGameDetails(dummyGame);
    }
  }, [gameId]);

  if (!gameDetails) {
    return <div className="p-4 text-white">Loading game details...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Game Details for {gameDetails.team1.name} vs {gameDetails.team2.name}</h1>
      
      {/* Render the SimpleQuestionCard here */}
      <div className="mt-8 max-w-md mx-auto"> {/* Added max-w-md and mx-auto for better centering on larger screens */}
        <SimpleQuestionCard game={gameDetails} />
      </div>

      {/* Other game details can go here */}
      <div className="mt-8 bg-vanta-blue-medium rounded-xl p-6 shadow-lg">
        <p className="text-lg font-semibold mb-2">League: {gameDetails.league}</p>
        <p className="text-lg font-semibold mb-2">Time: {gameDetails.time}</p>
        <p className="text-lg font-semibold mb-2">Date: {gameDetails.date}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default GameDetails;