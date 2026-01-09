"use client";

import React from 'react';
import { Game, Question } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';

interface TotalGoalsCardProps {
  game: Game;
  question: Question;
}

const TotalGoalsCard: React.FC<TotalGoalsCardProps> = ({ game, question }) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const questionText = question.text;
  const questionId = question.id;

  const yesOption = question.options?.find(o => o.label === 'Yes' || o.id.includes('yes'));
  const noOption = question.options?.find(o => o.label === 'No' || o.id.includes('no'));

  const yesOdd = yesOption?.odds || 0;
  const noOdd = noOption?.odds || 0;

  const handleOddsClick = (e: React.MouseEvent, choice: 'yes' | 'no', oddValue: number) => {
    e.stopPropagation();
    const option = choice === 'yes' ? yesOption : noOption;
    if (option) {
      setSelectedMatch(game, `${questionId}_${option.id}_${oddValue.toFixed(2)}`);
    }
  };

  return (
    <div className="bg-vanta-blue-medium/50 backdrop-blur-sm border border-vanta-accent-dark-blue/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-purple-500/10 text-purple-400 text-xs px-3 py-1.5 rounded-full font-semibold border border-purple-400/30">
          Total Goals
        </span>
      </div>

      {/* Question */}
      <h3 className="text-white text-lg font-bold mb-6">{questionText}</h3>

      {/* Options */}
      <div className="flex items-center justify-center gap-4">
        <OddsButton
          value={yesOdd}
          label="Yes"
          onClick={(e) => handleOddsClick(e, 'yes', yesOdd)}
          isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_${yesOption?.id}_${yesOdd.toFixed(2)}`}
          className="rounded-[12px] px-6 py-2 transition-all hover:scale-105 active:scale-95"
        />
        <span className="text-gray-600 font-bold">OR</span>
        <OddsButton
          value={noOdd}
          label="No"
          onClick={(e) => handleOddsClick(e, 'no', noOdd)}
          isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_${noOption?.id}_${noOdd.toFixed(2)}`}
          className="rounded-[12px] px-6 py-2 transition-all hover:scale-105 active:scale-95"
        />
      </div>
    </div>
  );
};

export default TotalGoalsCard;