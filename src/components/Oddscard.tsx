"use client";

import React from 'react';
import { Game } from '../types/game';
import NewOddsButton from './NewOddsButton'; // Using NewOddsButton
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap';
import { Star } from 'lucide-react';

interface OddsCardProps {
  game: Game;
}

const OddsCard: React.FC<OddsCardProps> = ({ game }) => {
  const { team1, team2 } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  const getQuestionText = (game: Game) => {
    if (game.questionType === 'win_match') {
      return `Who will win this Game?`; // Updated question text
    }
    // Add other question types if OddsCard is used for more than just win_match
    return `Make a prediction for this match.`;
  };

  const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
    e.stopPropagation();
    let oddValue;
    if (outcome === 'team1') oddValue = game.odds.team1;
    else if (outcome === 'draw') oddValue = game.odds.draw;
    else oddValue = game.odds.team2;
    setSelectedMatch(game, `${outcome}_${oddValue.toFixed(2)}`);
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col">
      <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
        <span className="text-white text-base font-medium">
          {getQuestionText(game)}
        </span>
        <div className="flex items-center space-x-2">
          <Star size={16} className="text-vanta-neon-blue" />
          <a href="#" className="text-vanta-neon-blue hover:underline">
            View All
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        {/* Team 1 */}
        <div className="flex flex-col items-center flex-1">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-12 h-12 object-contain mb-2" />
          <span className="text-sm font-semibold text-center">{team1.name}</span>
          <NewOddsButton
            value={game.odds.team1}
            label={game.odds.team1.toFixed(2)} // Display odd value as label
            onClick={(e) => handleOddsClick(e, 'team1')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `team1_${game.odds.team1.toFixed(2)}`}
            className="rounded-[12px] px-4 py-2 mt-2"
          />
        </div>

        {/* Draw */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-xl font-bold text-vanta-neon-blue mb-2">X</span>
          <NewOddsButton
            value={game.odds.draw}
            label={game.odds.draw.toFixed(2)} // Display odd value as label
            onClick={(e) => handleOddsClick(e, 'draw')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `draw_${game.odds.draw.toFixed(2)}`}
            className="rounded-[12px] px-4 py-2 mt-2"
          />
        </div>

        {/* Team 2 */}
        <div className="flex flex-col items-center flex-1">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-12 h-12 object-contain mb-2" />
          <span className="text-sm font-semibold text-center">{team2.name}</span>
          <NewOddsButton
            value={game.odds.team2}
            label={game.odds.team2.toFixed(2)} // Display odd value as label
            onClick={(e) => handleOddsClick(e, 'team2')}
            isSelected={selectedGame?.id === game.id && selectedOutcome === `team2_${game.odds.team2.toFixed(2)}`}
            className="rounded-[12px] px-4 py-2 mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default OddsCard;