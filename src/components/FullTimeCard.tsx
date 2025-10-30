"use client";

import React from 'react';
import { Game } from '../types/game';
import NewOddsButton from './NewOddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap';

interface FullTimeCardProps {
  game: Game;
}

const FullTimeCard: React.FC<FullTimeCardProps> = ({ game }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
    e.stopPropagation();
    // For FullTimeCard, the outcome is directly 'team1', 'draw', or 'team2'
    let oddValue;
    if (outcome === 'team1') oddValue = game.odds.team1;
    else if (outcome === 'draw') oddValue = game.odds.draw;
    else oddValue = game.odds.team2;
    setSelectedMatch(game, `${outcome}_${oddValue.toFixed(2)}`);
  };

  // This card is now specifically for 'win_match' type questions
  const questionText = `What team will win this match?`;

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Fixed Header for FullTime */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">FullTime</span>
      </div>

      {/* Question moved to the top */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {questionText}
      </h3>

      {/* Team Logos/Names and Buttons */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          <NewOddsButton
            value={game.odds.team1}
            label={game.odds.team1.toFixed(2)} // Display the odd value
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `team1_${game.odds.team1.toFixed(2)}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-vanta-neon-blue mb-2">VS</span>
          <NewOddsButton
            value={game.odds.draw}
            label={game.odds.draw.toFixed(2)} // Display the odd value
            onClick={(e) => handleOddsClick(e, 'draw')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `draw_${game.odds.draw.toFixed(2)}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
          <NewOddsButton
            value={game.odds.team2}
            label={game.odds.team2.toFixed(2)} // Display the odd value
            onClick={(e) => handleOddsClick(e, 'team2')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `team2_${game.odds.team2.toFixed(2)}`}
            className="rounded-[12px] px-6 py-2 mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default FullTimeCard;