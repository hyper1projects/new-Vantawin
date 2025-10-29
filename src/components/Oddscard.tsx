"use client";

import React from 'react'; // Removed useState as favoriting is removed
import { getLogoSrc } from '../utils/logoMap'; // Correct path
import { Game } from '../types/game'; // Import necessary types
import OddsButton from './OddsButton'; // Import the new OddsButton component
import { Link } from 'react-router-dom'; // Import Link for navigation

interface OddscardProps {
    game: Game; // Only accept the full game object
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    // Removed isFavorited state and handleFavoriteClick function

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
            
            {/* Top section: Live indicator (left), Game View (right) */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <div className="flex items-center space-x-3 font-medium"> 
                    {game.isLive && ( // Only render LIVE indicator if game is live
                        <span className="flex items-center text-red-400 font-bold tracking-wider">
                            <span className="relative flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            LIVE
                        </span>
                    )}
                </div>
                <div className="text-gray-300 font-medium"> {/* Right side: Game View (clickable) */}
                    <Link to={`/games/${game.id}`} className="hover:underline">
                        <span>{game.gameView}</span>
                    </Link>
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
                        <OddsButton value={game.odds.team1} /> 
                        <OddsButton value={game.odds.draw} />
                        <OddsButton value={game.odds.team2} />
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