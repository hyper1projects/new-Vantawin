"use client";

import React from 'react';
import { getLogoSrc } from '../utils/logoMap';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { Link } from 'react-router-dom';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';

interface OddscardProps {
    game: Game;
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

    const handleSelectOutcome = (outcome: 'team1' | 'team2') => {
        setSelectedMatch(game, outcome);
    };

    const renderTeam = (team: { name: string; logoIdentifier: string }) => (
        <div className="flex items-center">
            <img 
                src={getLogoSrc(team.logoIdentifier)} 
                alt={team.name} 
                className="w-6 h-6 mr-2 rounded-full object-contain bg-white/10 p-0.5 flex-shrink-0" 
            /> 
            <span className="text-white font-semibold truncate">{team.name}</span>
        </div>
    );

    return (
        <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50">
            
            {/* Top section: Question and Time/Date */}
            <div className="flex flex-col justify-start mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-vanta-text-light text-base font-semibold mb-2">Will {game.team1.name} win this game?</span>
                <div className="flex items-center space-x-3 text-gray-400 text-xs font-medium">
                    <span>{game.time}</span>
                    <span className="text-gray-500 text-xs">|</span>
                    <span>{game.date}</span>
                </div>
            </div>

            {/* Middle section: Teams and Odds */}
            <div className="flex justify-between items-center mb-4">
                {/* Teams display */}
                <div className="flex flex-col space-y-3">
                    {renderTeam(game.team1)}
                    {renderTeam(game.team2)}
                </div>

                {/* Odds buttons */}
                <div className="flex flex-col items-end space-y-2">
                    <div className='flex space-x-2'>
                        <Button
                            className={cn(
                                "flex-1 py-1 px-2 rounded-md transition-colors duration-300 text-xs font-semibold",
                                selectedGame?.id === game.id && selectedOutcome === 'team1'
                                    ? "bg-vanta-neon-blue text-vanta-blue-dark"
                                    : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
                            )}
                            onClick={() => handleSelectOutcome('team1')}
                        >
                            Yes
                        </Button>
                        <Button
                            className={cn(
                                "flex-1 py-1 px-2 rounded-md transition-colors duration-300 text-xs font-semibold",
                                selectedGame?.id === game.id && selectedOutcome === 'team2'
                                    ? "bg-vanta-neon-blue text-vanta-blue-dark"
                                    : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
                            )}
                            onClick={() => handleSelectOutcome('team2')}
                        >
                            No
                        </Button>
                    </div>
                </div>
            </div>

            {/* Removed bottom section for time/date */}
        </div>
    );
};

export default Oddscard;