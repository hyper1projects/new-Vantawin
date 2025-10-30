"use client";

import React from 'react';
import { Game, Question } from '../types/game'; // Import Question type
import NewOddsButton from './NewOddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap';

interface FullTimeCardProps {
  game: Game;
  question: Question; // Now accepts a specific question
}

const FullTimeCard: React.FC<FullTimeCardProps> = ({ game, question }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
    e.stopPropagation();
    let oddValue;
    if (outcome === 'team1') oddValue = question.odds.team1;
    else if (outcome === 'draw') oddValue = question.odds.draw;
    else oddValue = question.odds.team2;

    if (oddValue !== undefined) {
      setSelectedMatch(game, `${question.id}_${outcome}_${oddValue.toFixed(2)}`);
    }
  };

  // Defensive checks for odds values
  const team1Odd = question.odds?.team1 !== undefined ? question.odds.team1.toFixed(2) : '-';
  const drawOdd = question.odds?.draw !== undefined ? question.odds.draw.toFixed(2) : '-'; // Still needed for selectedOutcome comparison
  const team2Odd = question.odds?.team2 !== undefined ? question.odds.team2.toFixed(2) : '-';

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for FullTime */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      {/* Question text from the question prop */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {question.text}
      </h3>

      {/* Team Logos/Names and Buttons */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          <NewOddsButton
            value={question.odds.team1 || 0}
            label={team1.abbreviation} // Display team1 abbreviation
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_team1_${team1Odd}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-vanta-neon-blue mb-2">VS</span>
          {/* The Draw button is removed as requested */}
          {/* The space for the draw button is intentionally left to maintain layout, or could be filled with a different element if needed */}
          <NewOddsButton
            value={question.odds.draw || 0} // Still pass draw value for consistency in type, though button is removed
            label="Draw" // Placeholder label, this button is effectively hidden
            onClick={(e) => handleOddsClick(e, 'draw')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_draw_${drawOdd}`}
            className="rounded-[12px] px-6 py-2 mt-2 opacity-0 pointer-events-none" // Hide and disable interaction
          />
        </div>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
          <NewOddsButton
            value={question.odds.team2 || 0}
            label={team2.abbreviation} // Display team2 abbreviation
            onClick={(e) => handleOddsClick(e, 'team2')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_team2_${team2Odd}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default FullTimeCard;