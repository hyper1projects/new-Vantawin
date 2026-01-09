"use client";

import React from 'react';
import { Game, Question } from '../types/game';
import NewOddsButton from './NewOddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';

interface FullTimeCardProps {
  game: Game;
  question: Question;
}

const FullTimeCard: React.FC<FullTimeCardProps> = ({ game, question }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const homeOption = question.options?.find(o => o.label === team1.name || o.id.includes('home') || o.label === 'Home');
  const awayOption = question.options?.find(o => o.label === team2.name || o.id.includes('away') || o.label === 'Away');

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'team2') => {
    e.stopPropagation();
    let option;
    if (outcome === 'team1') option = homeOption;
    else if (outcome === 'team2') option = awayOption;

    if (option) {
      setSelectedMatch(game, `${question.id}_${option.id}_${option.odds.toFixed(2)}`);
    }
  };

  const team1Odd = homeOption?.odds !== undefined ? homeOption.odds.toFixed(2) : '-';
  const team2Odd = awayOption?.odds !== undefined ? awayOption.odds.toFixed(2) : '-';

  return (
    <div className="bg-vanta-blue-medium/50 backdrop-blur-sm border border-vanta-accent-dark-blue/30 rounded-xl p-6 hover:border-vanta-neon-blue/50 transition-all duration-300 group">
      {/* Question Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-vanta-neon-blue/10 text-vanta-neon-blue text-xs px-3 py-1.5 rounded-full font-semibold border border-vanta-neon-blue/30">
          Full Time Result
        </span>
      </div>

      {/* Question Text */}
      <h3 className="text-white text-lg font-bold mb-6">{question.text}</h3>

      {/* Betting Options */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-3 p-4 bg-vanta-blue-dark/30 rounded-lg hover:bg-vanta-blue-dark/50 transition-all">
          <span className="text-gray-400 text-sm font-medium">{team1.abbreviation}</span>
          <NewOddsButton
            value={homeOption?.odds || 0}
            label={team1.abbreviation}
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_${homeOption?.id}_${team1Odd}`}
          />
        </div>
        <div className="flex flex-col items-center gap-3 p-4 bg-vanta-blue-dark/30 rounded-lg hover:bg-vanta-blue-dark/50 transition-all">
          <span className="text-gray-400 text-sm font-medium">{team2.abbreviation}</span>
          <NewOddsButton
            value={awayOption?.odds || 0}
            label={team2.abbreviation}
            onClick={(e) => handleOddsClick(e, 'team2')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_${awayOption?.id}_${team2Odd}`}
          />
        </div>
      </div>
    </div>
  );
};

export default FullTimeCard;