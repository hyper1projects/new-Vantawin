"use client";

import React from 'react';
import { getLogoSrc } from '../utils/logoMap';
import { Game } from '../types/game';
import OddsButton from './OddsButton';
import { Link } from 'react-router-dom'; // Keep Link for potential future use or if other components rely on it, though not directly used in this card's text anymore.
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import { cn } from '../lib/utils'; // For conditional class merging
import { Button } from '@/components/ui/button'; // Import shadcn Button

interface OddscardProps {
    game: Game; // Only accept the full game object
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

    const handleSelectOutcome = (outcome: 'team1' | 'draw' | 'team2') => {
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

    // Defensive checks for odds values
    const team1Odd = game.odds?.team1 !== undefined ? game.odds.team1.toFixed(2) : '-';
    const drawOdd = game.odds?.draw !== undefined ? game.odds.draw.toFixed(2) : '-';
    const team2Odd = game.odds?.team2 !== undefined ? game.odds.team2.toFixed(2) : '-';

    return (
        <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50">
            
            {/* Top section: Question */}
            <div className="flex justify-center items-center text-vanta-text-light text-base font-semibold mb-4 border-b border-gray-700/50 pb-2">
                <span>Will {game.team1.name} win this game?</span>
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
                            {team1Odd}
                        </Button>
                        <Button
                            className={cn(
                                "flex-1 py-1 px-2 rounded-md transition-colors duration-300 text-xs font-semibold",
                                selectedGame?.id === game.id && selectedOutcome === 'draw'
                                    ? "bg-vanta-neon-blue text-vanta-blue-dark"
                                    : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E]"
                            )}
                            onClick={() => handleSelectOutcome('draw')}
                        >
                            {drawOdd}
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
                            {team2Odd}
                        </Button>
                    </div>
                    <span className='text-xs text-indigo-400 font-medium cursor-pointer hover:underline'>+ More Markets</span>
                </div>
            </div>

            {/* Bottom section: Time/Date (if not live) */}
            <div className="flex justify-start items-center pt-2 border-t border-gray-700/50 text-gray-400 text-xs font-medium">
                {!game.isLive && ( // Only show time/date if the game is not live
                    <div className="flex items-center space-x-3">
                        <span>{game.time}</span>
                        <span className="text-gray-500 text-xs">|</span>
                        <span>{game.date}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Oddscard;