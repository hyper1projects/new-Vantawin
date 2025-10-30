"use client";

import React from 'react';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
// Removed getLogoSrc import as logos are no longer used

interface TotalGoalsCardProps {
  game: Game;
}

const TotalGoalsCard: React.FC<TotalGoalsCardProps> = ({ game }) => {
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
        return `Will there be 2 or more goals?`;
      default:
        return `Total Goals question for ${game.team1.name} vs ${game.team2.name}`;
    }
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for Total Goals */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">Will both teams score..</span>
      </div>

      {/* Dynamic Question */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {getQuestionText(game)}
      </h3>

      {/* Buttons only, centered */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <OddsButton
          value={game.odds.team1}
          label="Yes"
          onClick={(e) => handleOddsClick(e, 'team1')}
          isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
          className="rounded-[12px] px-6 py-2 mt-2"
        />
        <OddsButton
          value={game.odds.team2}
          label="No"
          onClick={(e) => handleOddsClick(e, 'team2')}
          isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
          className="rounded-[12px] px-6 py-2 mt-2"
        />
      </div>
    </div>
  );
};

export default TotalGoalsCard;