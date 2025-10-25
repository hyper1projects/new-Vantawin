"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getLogoSrc } from '../utils/logoMap';
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook

// NOTE: Assuming these types are correctly defined in '../types/game'
interface Team {
    name: string;
    logoIdentifier: string; // Used by getLogoSrc
}
interface Odds {
    team1: number;
    team2: number;
    draw: number;
}
export interface Game { // Export Game interface for use in context
    id: string;
    time: string;
    date: string;
    team1: Team;
    team2: Team;
    odds: Odds;
    league: string;
    isLive: boolean;
    gameView: string;
}
interface OddscardProps {
    team1: Team;
    team2: Team;
    odds: Odds;
    time: string;
    date: string;
    league: string;
    isLive: boolean;
    gameView: string;
    // Add the full game object to props so it can be passed to context
    game: Game; 
}

// Minimal Odds Button
const OddsButton: React.FC<{ value: number; onClick: () => void; isSelected: boolean }> = ({ value, onClick, isSelected }) => (
    <button 
        onClick={onClick}
        className={`h-8 px-3 text-sm rounded-md transition-colors shadow-inner font-semibold 
            ${isSelected ? 'bg-[#015071] text-white' : 'bg-[#0B295B] text-white border border-gray-600 hover:bg-gray-700'}
        `}
    >
        {value.toFixed(2)}
    </button>
);

const Oddscard: React.FC<OddscardProps> = ({ team1, team2, odds, time, date, league, isLive, gameView, game }) => {
    const [isFavorited, setIsFavorited] = useState(false);
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

    const handleFavoriteClick = () => {
        setIsFavorited(!isFavorited);
        console.log(`Game ${isFavorited ? 'unfavorited' : 'favorited'}!`);
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

    const isSelected = selectedGame?.id === game.id;

    return (
        <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50">
            
            {/* Top section: Time/Live & Date (left), League (right) */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <div className="flex items-center space-x-3 font-medium"> 
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
                            onClick={() => setSelectedMatch(game, 'team1')} 
                            isSelected={isSelected && selectedOutcome === 'team1'} 
                        /> 
                        <OddsButton 
                            value={odds.draw} 
                            onClick={() => setSelectedMatch(game, 'draw')} 
                            isSelected={isSelected && selectedOutcome === 'draw'} 
                        />
                        <OddsButton 
                            value={odds.team2} 
                            onClick={() => setSelectedMatch(game, 'team2')} 
                            isSelected={isSelected && selectedOutcome === 'team2'} 
                        />
                    </div>
                    <span className='text-xs text-indigo-400 font-medium cursor-pointer hover:underline'>+ More Markets</span>
                </div>
            </div>

            {/* Bottom section: Favorite icon and Game View link */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <button 
                    onClick={handleFavoriteClick} 
                    className="p-1 rounded-full hover:bg-[#1a4280] transition-colors"
                >
                    <Star
                        className={`w-4 h-4 transition-colors ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                        fill={isFavorited ? 'currentColor' : 'none'}
                    />
                </button>
                <a href="#" className="text-gray-300 text-sm hover:underline font-medium">{gameView} &gt;</a>
            </div>
        </div>
    );
};

export default Oddscard;