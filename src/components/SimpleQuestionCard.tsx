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

  // Function to get the dynamic question text based on game.questionType for match outcomes
  const getQuestionText = (game: Game) => {
    switch (game.questionType) {
      case 'btts':
        return `Will both teams score?`;
      case 'win_match':
      default:
        return `Will ${game.team1.name} win this match?`;
    }
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for FullTime */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      {/* Question moved to the top, now dynamic */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {getQuestionText(game)}
      </h3>

      {/* Team Logos/Names and Buttons */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          {/* Yes Button moved under team1 */}
          <OddsButton
            value={game.odds.team1}
            label="Yes"
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
            className="rounded-[12px] px-6 py-2 mt-2" // Added mt-2 for spacing
          />
        </div>
        <span className="text-2xl font-bold text-vanta-neon-blue">VS</span>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
          {/* No Button moved under team2 */}
          <OddsButton
            value={game.odds.team2}
            label="No"
            onClick={(e) => handleOddsClick(e, 'team2')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
            className="rounded-[12px] px-6 py-2 mt-2" // Added mt-2 for spacing
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleQuestionCard;