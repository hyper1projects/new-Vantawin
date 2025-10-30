"use client";

import React from 'react';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc

interface TotalGoalsCardProps {
  game: Game;
}

interface GoalQuestion {
  id: string; // Unique ID for the question type (e.g., 'over_2_5', 'btts_yes')
  questionText: string; // Display text for the question
  yesOdd: number;
  noOdd: number;
}

const TotalGoalsCard: React.FC<TotalGoalsCardProps> = ({ game }) => {
  const { team1, team2 } = game; // Destructure team1 and team2
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

  // Define multiple goal-related questions
  const goalQuestions: GoalQuestion[] = [
    {
      id: 'btts_2_goals',
      questionText: 'Both teams to score 2 goals or more?',
      yesOdd: 1.85,
      noOdd: 1.95,
    },
    {
      id: 'btts_3_goals',
      questionText: 'Both teams to score 3 goals or more?',
      yesOdd: 1.70,
      noOdd: 2.10,
    },
    {
      id: 'btts_4_goals',
      questionText: 'Both teams to score 4 goals or more?',
      yesOdd: 1.90,
      noOdd: 1.80,
    },
  ];

  const handleOddsClick = (e: React.MouseEvent, questionId: string, choice: 'yes' | 'no', oddValue: number) => {
    e.stopPropagation();
    // Create a unique outcome string for the context
    setSelectedMatch(game, `${questionId}_${choice}_${oddValue.toFixed(2)}`);
  };

  return (
    <div className="bg-vanta-blue-medium rounded-[27px] p-6 shadow-lg text-vanta-text-light w-full flex flex-col items-center justify-center space-y-4">
      {/* Team Logos and Names at the top */}
      <div className="flex items-center justify-center space-x-6 w-full mb-4">
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team1.logoIdentifier)} alt={team1.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team1.name}</span>
        </div>
        <span className="text-2xl font-bold text-gray-400">VS</span>
        <div className="flex flex-col items-center">
          <img src={getLogoSrc(team2.logoIdentifier)} alt={team2.name} className="w-16 h-16 object-contain mb-2" />
          <span className="text-lg font-semibold">{team2.name}</span>
        </div>
      </div>

      {/* Fixed Header for Total Goals */}
      <div className="w-full text-center mb-2">
        <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md font-semibold">Total Goals</span>
      </div>

      {/* Dynamic Questions and Buttons */}
      <div className="w-full space-y-4">
        {goalQuestions.map((question) => (
          <div key={question.id} className="flex flex-col items-center space-y-2">
            <h3 className="text-xl font-bold text-white text-center">{question.questionText}</h3>
            <div className="flex items-center justify-center space-x-6 w-full">
              <OddsButton
                value={question.yesOdd} // Value is still passed for logic
                label="Yes" // Only "Yes" is displayed
                onClick={(e) => handleOddsClick(e, question.id, 'yes', question.yesOdd)}
                isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_yes_${question.yesOdd.toFixed(2)}`}
                className="rounded-[12px] px-6 py-2 mt-2"
              />
              <OddsButton
                value={question.noOdd} // Value is still passed for logic
                label="No" // Only "No" is displayed
                onClick={(e) => handleOddsClick(e, question.id, 'no', question.noOdd)}
                isSelected={selectedGame?.id === game.id && selectedOutcome === `${question.id}_no_${question.noOdd.toFixed(2)}`}
                className="rounded-[12px] px-6 py-2 mt-2"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalGoalsCard;