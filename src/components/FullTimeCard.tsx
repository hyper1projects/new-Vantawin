"use client";

import React from 'react';
import { Game, Question } from '../types/game'; // Import Question type
import OddsButton from './OddsButton'; // Changed from NewOddsButton to OddsButton
import { useMatchSelection } from '../context/MatchSelectionContext';
import { useNavigate } from 'react-router-dom';
import TeamLogo from './TeamLogo';

interface FullTimeCardProps {
  game: Game;
  question: Question; // Now accepts a specific question
}

const FullTimeCard: React.FC<FullTimeCardProps> = ({ game, question }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const homeOption = question.options?.find(o => o.label === team1.name || o.id.includes('home') || o.label === 'Home');
  const awayOption = question.options?.find(o => o.label === team2.name || o.id.includes('away') || o.label === 'Away');

  const navigate = useNavigate();

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'team2') => {
    e.stopPropagation();
    let option;
    if (outcome === 'team1') option = homeOption;
    else if (outcome === 'team2') option = awayOption;

    if (option) {
      setSelectedMatch(game, `${question.id}_${outcome}_${option.odds.toFixed(2)}`);
      navigate('/pools');
    }
  };

  const team1Odd = homeOption?.odds !== undefined ? homeOption.odds.toFixed(2) : '-';
  const team2Odd = awayOption?.odds !== undefined ? awayOption.odds.toFixed(2) : '-';

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      <h3 className="text-xl font-bold text-white text-center mb-4">
        {question.text}
      </h3>

      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <TeamLogo teamName={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          <OddsButton
            value={homeOption?.odds || 0}
            label={team1.abbreviation}
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_team1_${team1Odd}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
        <span className="text-2xl font-bold text-vanta-neon-blue mb-2">VS</span>
        <div className="flex flex-col items-center">
          <TeamLogo teamName={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
          <OddsButton
            value={awayOption?.odds || 0}
            label={team2.abbreviation}
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