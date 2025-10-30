"use client";

import React from 'react';
import { Game } from '../types/game';
import OddsButton from './OddsButton'; // Import the new OddsButton component

interface SimpleQuestionCardProps {
  game: Game;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game }) => {
  const { team1 } = game;

  // Odds for "Yes" (Team 1 wins)
  const yesOdds = game.odds.team1;

  // Calculate odds for "No" (Team 1 does not win, i.e., Draw or Team 2 wins)
  // This is derived from the probabilities of Draw and Team 2 winning.
  const probDraw = 1 / game.odds.draw;
  const probTeam2Win = 1 / game.odds.team2;
  const probTeam1NotWin = probDraw + probTeam2Win;
  const noOdds = 1 / probTeam1NotWin;

  // Placeholder for handling button clicks (can be expanded later)
  const handleYesClick = () => {
    console.log(`User selected Yes for ${team1.name} to win with odds ${yesOdds}`);
    // Implement betting logic here
  };

  const handleNoClick = () => {
    console.log(`User selected No for ${team1.name} to win with odds ${noOdds}`);
    // Implement betting logic here
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-6">
      <h3 className="text-xl font-bold text-white text-center">
        Will {team1.name} win this game?
      </h3>
      <div className="flex space-x-4 w-full max-w-md">
        <OddsButton label="Yes" odds={yesOdds} onClick={handleYesClick} />
        <OddsButton label="No" odds={noOdds} onClick={handleNoClick} />
      </div>
    </div>
  );
};

export default SimpleQuestionCard;