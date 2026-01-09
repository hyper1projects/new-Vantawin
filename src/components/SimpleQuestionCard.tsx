"use client";

import React from 'react';
import { Game, Question } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';

interface SimpleQuestionCardProps {
  game: Game;
  question: Question;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game, question }) => {
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

  // Determine badge color based on question type
  const getBadgeStyle = () => {
    if (question.type === 'btts') {
      return {
        bg: 'bg-green-500/10',
        text: 'text-green-400',
        border: 'border-green-400/30',
        hoverBorder: 'hover:border-green-400/50',
        label: 'Both Teams to Score'
      };
    } else if (question.type === 'is_draw') {
      return {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-400/30',
        hoverBorder: 'hover:border-yellow-400/50',
        label: 'Match Result'
      };
    }
    // Default
    return {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-400/30',
      hoverBorder: 'hover:border-blue-400/50',
      label: 'Match Question'
    };
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className={`bg-vanta-blue-medium/50 backdrop-blur-sm border border-vanta-accent-dark-blue/30 rounded-xl p-6 ${badgeStyle.hoverBorder} transition-all duration-300`}>
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`${badgeStyle.bg} ${badgeStyle.text} text-xs px-3 py-1.5 rounded-full font-semibold border ${badgeStyle.border}`}>
          {badgeStyle.label}
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

export default SimpleQuestionCard;