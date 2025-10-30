"use client";

import React from 'react';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';

interface TotalGoalsCardProps {
  bttsGame?: Game; // Optional prop for BTTS question
  over2_5GoalsGame?: Game; // Optional prop for Over 2.5 Goals question
  over3_5GoalsGame?: Game; // Optional prop for Over 3.5 Goals question
}

const TotalGoalsCard: React.FC<TotalGoalsCardProps> = ({
  bttsGame,
  over2_5GoalsGame,
  over3_5GoalsGame,
}) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleOddsClick = (e: React.MouseEvent, game: Game, outcome: 'team1' | 'team2') => {
    e.stopPropagation();
    setSelectedMatch(game, outcome);
  };

  // Helper component for a single question row
  const QuestionRow: React.FC<{ game: Game; question: string }> = ({ game, question }) => (
    <div className="flex items-center justify-between w-full py-2 border-b border-vanta-blue-dark last:border-b-0">
      <h4 className="text-lg font-medium text-white">{question}</h4>
      <div className="flex space-x-4">
        <OddsButton
          value={game.odds.team1}
          label="Yes"
          onClick={(e) => handleOddsClick(e, game, 'team1')}
          isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
          className="rounded-[12px] px-4 py-1 text-sm"
        />
        <OddsButton
          value={game.odds.team2}
          label="No"
          onClick={(e) => handleOddsClick(e, game, 'team2')}
          isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
          className="rounded-[12px] px-4 py-1 text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for Match Questions */}
      <div className="w-full text-center mb-4">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">Match Questions</span>
      </div>

      <div className="w-full space-y-2">
        {bttsGame && (
          <QuestionRow game={bttsGame} question={`Will both teams score?`} />
        )}
        {over2_5GoalsGame && (
          <QuestionRow game={over2_5GoalsGame} question={`Will there be 2 or more goals?`} />
        )}
        {over3_5GoalsGame && (
          <QuestionRow game={over3_5GoalsGame} question={`Will there be 3 or more goals?`} />
        )}
      </div>
    </div>
  );
};

export default TotalGoalsCard;