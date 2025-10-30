"use client";

import React from 'react';
import { Game, Question } from '../types/game'; // Import Question type
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
// Removed getLogoSrc import as it's no longer needed

interface SimpleQuestionCardProps {
  game: Game;
  question: Question; // Now accepts a specific question
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game, question }) => {
  // Removed team1, team2 destructuring as they are no longer displayed
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  // Use question.text and question.odds directly
  const questionText = question.text;
  const yesOdd = question.odds.yes !== undefined ? question.odds.yes : 0;
  const noOdd = question.odds.no !== undefined ? question.odds.no : 0;
  const questionId = question.id;

  const handleOddsClick = (e: React.MouseEvent, choice: 'yes' | 'no', oddValue: number) => {
    e.stopPropagation();
    setSelectedMatch(game, `${questionId}_${choice}_${oddValue.toFixed(2)}`);
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-4 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-3">
      {/* Fixed Header for FullTime */}
      <div className="w-full text-center mb-1">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      {/* Question text from the question prop */}
      <h3 className="text-lg font-bold text-white text-center mb-3">
        {questionText}
      </h3>

      {/* Buttons only, team logos/names removed */}
      <div className="flex items-center justify-center space-x-4 w-full">
        <OddsButton
          value={yesOdd}
          label="Yes"
          onClick={(e) => handleOddsClick(e, 'yes', yesOdd)}
          isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_yes_${yesOdd.toFixed(2)}`}
          className="rounded-[12px] px-4 py-1.5 mt-1"
        />
        <span className="text-xl font-bold text-vanta-neon-blue">VS</span>
        <OddsButton
          value={noOdd}
          label="No"
          onClick={(e) => handleOddsClick(e, 'no', noOdd)}
          isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_no_${noOdd.toFixed(2)}`}
          className="rounded-[12px] px-4 py-1.5 mt-1"
        />
      </div>
    </div>
  );
};

export default SimpleQuestionCard;