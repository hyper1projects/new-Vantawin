"use client";

import React from 'react';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap';

interface SimpleQuestionCardProps {
  game: Game;
}

const SimpleQuestionCard: React.FC<SimpleQuestionCardProps> = ({ game }) => {
  const { team1, team2, odds, questionType } = game;
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  let questionId = '';
  let yesOdd = 0;
  let noOdd = 0;

  // Determine question text and odds based on questionType
  const getQuestionDetails = () => {
    switch (questionType) {
      case 'btts':
        questionId = 'btts';
        yesOdd = odds.team1; // Assuming team1 odd is for 'Yes' for BTTS
        noOdd = odds.team2;  // Assuming team2 odd is for 'No' for BTTS
        return `Will both teams score?`;
      case 'win_match':
        questionId = 'win_match';
        yesOdd = odds.team1; // Odd for team1 to win
        noOdd = odds.team2;  // Odd for team2 to win (as a proxy for 'No' to team1 winning)
        return `Will ${team1.name} win this match?`;
      case 'over_2_5_goals':
        questionId = 'over_2_5_goals';
        yesOdd = odds.team1;
        noOdd = odds.team2;
        return `Will there be over 2.5 goals?`;
      case 'score_goals':
        questionId = 'score_goals';
        yesOdd = odds.team1;
        noOdd = odds.team2;
        return `Will ${team1.name} score more than 2 goals?`;
      default:
        questionId = 'unknown';
        return `Make a prediction for this match.`;
    }
  };

  const dynamicQuestionText = getQuestionDetails();

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

      {/* Question moved to the top, now dynamic */}
      <h3 className="text-xl font-bold text-white text-center mb-4">
        {dynamicQuestionText}
      </h3>

      {/* Team Logos/Names and Buttons */}
      <div className="flex items-center justify-center space-x-6 w-full">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
          {/* Yes Button moved under team1 */}
          <OddsButton
            value={yesOdd}
            label="Yes"
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
            label="No"
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