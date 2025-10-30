"use client";

import React from 'react';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap';

interface TotalGoalsCardProps {
  game: Game;
}

const TotalGoalsCard: React.FC<TotalGoalsCardProps> = ({ game }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
    e.stopPropagation();
    setSelectedMatch(game, outcome);
  };

  // Function to get the dynamic question text based on game.questionType for total goals
  const getQuestionText = (game: Game) => {
    switch (game.questionType) {
      case 'score_goals':
        return `Will ${game.team1.name} score more than 2 goals?`;
      case 'over_2_5_goals':
        return `Will there be 2 or more goals?`; // Changed text here
      default:
        return `Total Goals question for ${game.team1.name} vs ${game.team2.name}`;
    }
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for Total Goals */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">Total Goals</span>
      </div>

      {/* Dynamic Question */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {getQuestionText(game)}
      </h3>

      {/* Team Logos/Names and Buttons */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          <OddsButton
            value={game.odds.team1}
            label="Yes"
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
        <span className="text-2xl font-bold text-vanta-neon-blue">VS</span>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
          <OddsButton
            value={game.odds.team2}
            label="No"
            onClick={(e) => handleOddsClick(e, 'team2')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default TotalGoalsCard;