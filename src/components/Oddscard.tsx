"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getLogoSrc } from '../utils/logoMap'; // Correct path
import { Team, Odds, Game } from '../types/game'; // Import necessary types
import OddsButton from './OddsButton'; // Import the new OddsButton component
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface OddscardProps {
    game: Game; // Now only accepting the full game object
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    // Destructure all necessary properties directly from the game object
    const { team1, team2, odds, time, date, league, isLive, gameView, questionType } = game;

    const [isFavorited, setIsFavorited] = useState(false);
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection(); // Use the context
    const navigate = useNavigate(); // Initialize useNavigate

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from triggering
        setIsFavorited(!isFavorited);
        console.log(`Game ${isFavorited ? 'unfavorited' : 'favorited'}!`);
    };

    const handleOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
        e.stopPropagation(); // Prevent card click from triggering
        setSelectedMatch(game, outcome);
    };

    const handleCardClick = () => {
        navigate(`/games/${game.id}`); // Navigate to game details when the card is clicked
    };

    const renderTeam = (team: Team) => (
        <div className="flex items-center">
            <img 
                src={getLogoSrc(team.logoIdentifier)} 
                alt={team.name} 
                className="w-6 h-6 mr-2 rounded-full object-contain bg-white/10 p-0.5 flex-shrink-0" 
            /> 
            <span className="text-white font-semibold truncate text-sm"> {/* Reduced team name font size */}
                {team.name}
            </span>
        </div>
    );

    const getQuestionText = (game: Game) => {
        switch (game.questionType) {
            case 'score_goals':
                return `Will ${game.team1.name} score more than 2 goals?`;
            case 'btts':
                return `Will both teams score?`;
            case 'over_2_5_goals':
                return `Will there be over 2.5 goals?`;
            case 'win_match':
            default:
                return `Will ${game.team1.name} win this match?`;
        }
    };

    return (
        <div 
            className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50 cursor-pointer"
            onClick={handleCardClick} // Add onClick to the entire card
        >
            
            {/* Top section: Question (left), Favorite & Game View (right) */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-white text-base font-medium"> {/* Increased question font size and set color to white */}
                    {getQuestionText(game)}
                </span>
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
                    <a href={`/games/${game.id}`} className="text-gray-300 text-sm hover:underline font-medium" onClick={(e) => e.stopPropagation()}>{gameView} &gt;</a>
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
                            label="Yes" // Display "Yes"
                            onClick={(e) => handleOddsClick(e, 'team1')} 
                            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'} 
                        /> 
                        {/* Removed the draw button */}
                        <OddsButton 
                            value={odds.team2} 
                            label="No" // Display "No"
                            onClick={(e) => handleOddsClick(e, 'team2')} 
                            isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'} 
                        />
                    </div>
                    {/* Removed "+ More Markets" span */}
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
                <div className="text-gray-300 font-medium text-xs"> {/* Right side: League - Reduced font size to text-xs */}
                    <span>{league}</span>
                </div>
            </div>
        </div>
    );
};

export default Oddscard;