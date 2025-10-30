"use client";

import React from 'react';
import { Game, Question } from '../types/game'; // Import Question type
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap';

interface SimpleQuestionCardProps {
  game: Game;
  question: Question; // Now accepts a specific question
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game, question }) => {
  const { team1, team2 } = game;
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

      {/* Team Logos/Names and Buttons */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          {/* Yes Button moved under team1 */}
          <OddsButton
            value={yesOdd}
            label="Yes" // Removed odds from label
            onClick={(e) => handleOddsClick(e, 'yes', yesOdd)}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_yes_${yesOdd.toFixed(2)}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
        <span className="text-2xl font-bold text-vanta-neon-blue">VS</span>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
          {/* No Button moved under team2 */}
          <OddsButton
            value={noOdd}
            label="No" // Removed odds from label
            onClick={(e) => handleOddsClick(e, 'no', noOdd)}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${questionId}_no_${noOdd.toFixed(2)}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleQuestionCard;