"use client";

import React from 'react';
import { Game } from '../types/game'; // Assuming Game type is defined here or in a shared type file
import OddsButton from './OddsButton'; // Import the OddsButton component
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc for image routing

interface SimpleQuestionCardProps {
  game: Game;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
    e.stopPropagation(); // Prevent any parent click handlers from triggering
    setSelectedMatch(game, outcome);
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Team Logos/Names */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
        </div>
        <span className="text-2xl font-bold text-vanta-neon-blue">VS</span>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-4">
        <OddsButton
          value={game.odds.team1}
          label="Yes"
          onClick={(e) => handleOddsClick(e, 'team1')}
          isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
          className="rounded-[12px] px-6 py-2" // Apply custom styling
        />
        <OddsButton
          value={game.odds.team2}
          label="No"
          onClick={(e) => handleOddsClick(e, 'team2')}
          isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
          className="rounded-[12px] px-6 py-2" // Apply custom styling
        />
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold text-white text-center">
        Will {team1.name} win this game?
      </h3>
    </div>
  );
};

export default SimpleQuestionCard;