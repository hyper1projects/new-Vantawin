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
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for FullTime */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      {/* Question text from the question prop */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {questionText}
      </h3>

      {/* Buttons only, team logos/names removed */}
      <div className="flex items-center justify-center space-x-6 w-full">
        {/* Removed team1 logo and name */}
        <OddsButton
          value={yesOdd}
          label="Yes"
          onClick={(e) => handleOddsClick(e, 'yes', yesOdd)}
          isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_yes_${yesOdd.toFixed(2)}`}
          className="rounded-[12px] px-6 py-2 mt-2"
        />
        <span className="text-2xl font-bold text-vanta-neon-blue">VS</span> {/* Keep VS for visual separation */}
        {/* Removed team2 logo and name */}
        <OddsButton
          value={noOdd}
          label="No"
          onClick={(e) => handleOddsClick(e, 'no', noOdd)}
          isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_no_${noOdd.toFixed(2)}`}
          className="rounded-[12px] px-6 py-2 mt-2"
        />
      </div>
    </div>
  );
};

export default SimpleQuestionCard;