"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getLogoSrc } from '../utils/logoMap'; // Correct path
import { Team, Odds, Game } from '../types/game'; // Import necessary types
import OddsButton from './OddsButton'; // Import the new OddsButton component
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook

interface OddscardProps {
    team1: Team;
    team2: Team;
    odds: Odds;
    time: string;
    date: string;
    league: string;
    isLive: boolean;
    gameView: string;
    game: Game; // Keep the full game object for context usage
}

const Oddscard: React.FC<OddscardProps> = ({ team1, team2, odds, time, date, league, isLive, gameView, game }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection(); // Use the context

    const handleFavoriteClick = () => {
        setIsFavorited(!isFavorited);
        console.log(`Game ${isFavorited ? 'unfavorited' : 'favorited'}!`);
    };

    const handleOddsClick = (outcome: 'team1' | 'draw' | 'team2') => {
        setSelectedMatch(game, outcome);
    };

    const renderTeam = (team: Team) => (
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
            
            {/* Top section: Question (left), Favorite & Game View (right) */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-gray-300 text-sm font-medium">Will {team1.name} win this match?</span> {/* Question content */}
                <div className="flex items-center space-x-2"> {/* Container for star and link */}
                    <button 
                        onClick={handleFavoriteClick} 
                        className="p-1 rounded-full hover:bg-[#1a4280] transition-colors"
                    >
                        <Star
                            className={`w-4 h-4 transition-colors ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                            fill={isFavorited ? 'currentColor' : 'none'}
                        />
                    </button>
                    <a href={`/games/${game.id}`} className="text-gray-300 text-sm hover:underline font-medium">{gameView} &gt;</a>
                </div>
            </div>

            {/* Middle section: Teams and Odds */}
            <div className="flex justify-between items-center mb-4">
                {/* Teams display */}
                <div className="flex flex-col space-y-3">
                    {renderTeam(team1)}
                    {renderTeam(team2)}
                </div>

                {/* Odds buttons */}
                <div className="flex flex-col items-end space-y-2">
                    <div className='flex space-x-2'>
                        <OddsButton 
                            value={odds.team1} 
                            onClick={() => handleOddsClick('team1')} 
                            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'} 
                        /> 
                        <OddsButton 
                            value={odds.draw} 
                            onClick={() => handleOddsClick('draw')} 
                            isSelected={selectedGame?.id === game.id && selectedOutcome === 'draw'} 
                        />
                        <OddsButton 
                            value={odds.team2} 
                            onClick={() => handleOddsClick('team2')} 
                            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'} 
                        />
                    </div>
                    <span className='text-xs text-indigo-400 font-medium cursor-pointer hover:underline'>+ More Markets</span>
                </div>
            </div>

            {/* Bottom section: Time/Live & Date (left), League (right) */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <div className="flex items-center space-x-3 font-medium text-gray-400 text-xs"> 
                    {isLive ? ( // Conditionally render LIVE indicator
                        <span className="flex items-center text-red-400 font-bold tracking-wider">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            LIVE
                        </span>
                    ) : (
                        <span>{time}</span> 
                    )}
                    <span className="text-gray-500 text-xs">|</span>
                    <span>{date}</span>
                </div>
                <div className="text-gray-300 font-medium"> {/* Right side: League */}
                    <span>{league}</span>
                </div>
            </div>
        </div>
    );
};

export default Oddscard;