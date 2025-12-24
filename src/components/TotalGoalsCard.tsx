"use client";

import React from 'react';
import { Game, Question } from '../types/game'; // Import Question type
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';

interface TotalGoalsCardProps {
  game: Game;
  question: Question; // Now accepts a specific question
}

const TotalGoalsCard: React.FC<TotalGoalsCardProps> = ({ game, question }) => {
  const { team1, team2 } = game;
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
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center justify-center space-x-6 w-full mb-4">
        <div className="flex flex-col items-center">
          <img src={team1.image || '/placeholder.svg'} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
        </div>
        <span className="text-2xl font-bold text-gray-400">VS</span>
        <div className="flex flex-col items-center">
          <img src={team2.image || '/placeholder.svg'} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
        </div>
      </div>

      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">Total Goals</span>
      </div>

      <div className="w-full space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-xl font-bold text-white text-center">{questionText}</h3>
          <div className="flex items-center justify-center space-x-6 w-full">
            <OddsButton
              value={yesOdd}
              label="Yes"
              onClick={(e) => handleOddsClick(e, 'yes', yesOdd)}
              isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_${yesOption?.id}_${yesOdd.toFixed(2)}`}
              className="rounded-[12px] px-6 py-2 mt-2"
            />
            <OddsButton
              value={noOdd}
              label="No"
              onClick={(e) => handleOddsClick(e, 'no', noOdd)}
              isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_${noOption?.id}_${noOdd.toFixed(2)}`}
              className="rounded-[12px] px-6 py-2 mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalGoalsCard;