"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getLogoSrc } from '../utils/logoMap'; // Correct path
import { Team, Odds, Game, Question } from '../types/game'; // Import necessary types, including Question
import OddsButton from './OddsButton'; // Import the new OddsButton component
import NewOddsButton from './NewOddsButton'; // Import NewOddsButton
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface OddscardProps {
    game: Game; // Now only accepting the full game object
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    // Destructure all necessary properties directly from the game object
    const { team1, team2, league, isLive, gameView, questions } = game;

    const [isFavorited, setIsFavorited] = useState(false);
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection(); // Use the context
    const navigate = useNavigate(); // Initialize useNavigate

    // Determine the primary question to display on the Oddscard
    const primaryQuestion: Question | undefined = questions.find(q => q.type === 'win_match') || questions[0];

    if (!primaryQuestion) {
        // Handle case where there are no questions for the game (shouldn't happen with current data)
        return null;
    }

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from triggering
        setIsFavorited(!isFavorited);
        console.log(Game ${isFavorited ? 'unfavorited' : 'favorited'}!);
    };

    // Handler for 'win_match' type questions (using NewOddsButton)
    const handleWinMatchOddsClick = (e: React.MouseEvent, outcome: 'team1' | 'draw' | 'team2') => {
        e.stopPropagation(); // Prevent card click from triggering
        let oddValue;
        if (outcome === 'team1') oddValue = primaryQuestion.odds.team1;
        else if (outcome === 'draw') oddValue = primaryQuestion.odds.draw;
        else oddValue = primaryQuestion.odds.team2;

        if (oddValue !== undefined) {
            setSelectedMatch(game, ${primaryQuestion.id}_${outcome}_${oddValue.toFixed(2)});
        }
    };

    // Handler for other question types (using OddsButton for Yes/No)
    const handleQuestionOddsClick = (e: React.MouseEvent, choice: 'yes' | 'no', oddValue: number) => {
        e.stopPropagation(); // Prevent card click from triggering
        setSelectedMatch(game, ${primaryQuestion.id}_${choice}_${oddValue.toFixed(2)});
    };

    const handleCardClick = () => {
        navigate(/games/${game.id}); // Navigate to game details when the card is clicked
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

    // Defensive checks for odds values for the primary question
    const team1Odd = primaryQuestion.odds?.team1 !== undefined ? primaryQuestion.odds.team1.toFixed(2) : '-';
    const drawOdd = primaryQuestion.odds?.draw !== undefined ? primaryQuestion.odds.draw.toFixed(2) : '-';
    const team2Odd = primaryQuestion.odds?.team2 !== undefined ? primaryQuestion.odds.team2.toFixed(2) : '-';
    const yesOdd = primaryQuestion.odds?.yes !== undefined ? primaryQuestion.odds.yes.toFixed(2) : '-';
    const noOdd = primaryQuestion.odds?.no !== undefined ? primaryQuestion.odds.no.toFixed(2) : '-';

    return (
        <div 
            className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50 cursor-pointer"
            onClick={handleCardClick} // Add onClick to the entire card
        >
            
            {/* Top section: Question (left), Favorite & Game View (right) */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-white text-base font-medium"> {/* Increased question font size and set color to white */}
                    {primaryQuestion.text}
                </span>
                <div className="flex items-center space-x-2"> {/* Container for star and link */}
                    <button 
                        onClick={handleFavoriteClick} 
                        className="p-1 rounded-full hover:bg-[#1a4280] transition-colors"
                    >
                        <Star
                            className={w-4 h-4 transition-colors ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}}
                            fill={isFavorited ? 'currentColor' : 'none'}
                        />
                    </button>
                    <a href={/games/${game.id}} className="text-gray-300 text-sm hover:underline font-medium" onClick={(e) => e.stopPropagation()}>{gameView} &gt;</a>
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
                        {primaryQuestion.type === 'win_match' ? (
                            <>
                                <NewOddsButton 
                                    value={primaryQuestion.odds.team1 || 0} 
                                    label={team1.abbreviation} // Display team1 abbreviation
                                    onClick={(e) => handleWinMatchOddsClick(e, 'team1')} 
                                    isSelected={selectedGame?.id === game.id && selectedOutcome === ${primaryQuestion.id}_team1_${team1Odd}} 
                                /> 
                                {/* Removed the draw button */}
                                <NewOddsButton 
                                    value={primaryQuestion.odds.team2 || 0} 
                                    label={team2.abbreviation} // Display team2 abbreviation
                                    onClick={(e) => handleWinMatchOddsClick(e, 'team2')} 
                                    isSelected={selectedGame?.id === game.id && selectedOutcome === ${primaryQuestion.id}_team2_${team2Odd}} 
                                />
                            </>
                        ) : (
                            <>
                                <OddsButton 
                                    value={primaryQuestion.odds.yes || 0} 
                                    label="Yes"
                                    onClick={(e) => handleQuestionOddsClick(e, 'yes', primaryQuestion.odds.yes || 0)} 
                                    isSelected={selectedGame?.id === game.id && selectedOutcome === ${primaryQuestion.id}_yes_${yesOdd}} 
                                /> 
                                <OddsButton 
                                    value={primaryQuestion.odds.no || 0} 
                                    label="No"
                                    onClick={(e) => handleQuestionOddsClick(e, 'no', primaryQuestion.odds.no || 0)} 
                                    isSelected={selectedGame?.id === game.id && selectedOutcome === ${primaryQuestion.id}_no_${noOdd}} 
                                />
                            </>
                        )}
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
                        <span>{game.time}</span> 
                    )}
                    <span className="text-gray-500 text-xs">|</span>
                    <span>{game.date}</span>
                </div>
                <div className="text-gray-300 font-medium text-xs"> {/* Right side: League - Reduced font size to text-xs */}
                    <span>{league}</span>
                </div>
            </div>
        </div>
    );
};

export default Oddscard;