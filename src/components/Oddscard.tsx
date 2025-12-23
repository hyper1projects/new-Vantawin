"use client";

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { getLogoSrc } from '../utils/logoMap';
import { Team, Game, Question } from '../types/game';
import NewOddsButton from './NewOddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { useNavigate } from 'react-router-dom';

interface OddscardProps {
    game: Game;
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    if (!game) return null;

    const { team1, team2, league, isLive, gameView, questions } = game;

    if (!team1 || !team2) return null;

    const [isFavorited, setIsFavorited] = useState(false);
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
    const navigate = useNavigate();

    // STRICT: Only find the 'win_match' question (Who will win?)
    const primaryQuestion: Question | undefined = questions.find(q => q.type === 'win_match');

    if (!primaryQuestion) return null;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        console.log(`Game ${isFavorited ? 'unfavorited' : 'favorited'}!`);
    };

    // Specific getters for H2H outcomes
    const homeOption = primaryQuestion.options?.find(o => o.label === team1.name || o.id.includes('home') || o.label === 'Home');
    const awayOption = primaryQuestion.options?.find(o => o.label === team2.name || o.id.includes('away') || o.label === 'Away');

    const handleWinMatchOddsClick = (e: React.MouseEvent, outcome: 'home' | 'away') => {
        e.stopPropagation();
        console.log("Oddscard: Button clicked", outcome, game.id);
        let option;
        if (outcome === 'home') option = homeOption;
        else option = awayOption;

        if (option) {
            console.log("Oddscard: Selecting match", option);
            setSelectedMatch(game, `${primaryQuestion.id}_${option.id}_${option.odds.toFixed(2)}`);
        } else {
            console.warn("Oddscard: Option not found for", outcome);
        }
    };

    const handleCardClick = () => {
        navigate(`/games/${game.id}`);
    };

    const renderTeam = (team: Team) => (
        <div className="flex items-center">
            <img
                src={getLogoSrc(team.logoIdentifier)}
                alt={team.name}
                className="w-6 h-6 mr-2 rounded-full object-contain bg-white/10 p-0.5 flex-shrink-0"
            />
            <span className="text-white font-semibold truncate text-sm">
                {team.name}
            </span>
        </div>
    );

    // Helper strings for selection matching
    const homeSelId = `${primaryQuestion.id}_${homeOption?.id}_${homeOption?.odds.toFixed(2)}`;
    const awaySelId = `${primaryQuestion.id}_${awayOption?.id}_${awayOption?.odds.toFixed(2)}`;

    return (
        <div
            className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50 cursor-pointer"
            onClick={handleCardClick}
        >
            {/* Top section */}
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-white text-base font-medium">
                    {primaryQuestion.text}
                </span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleFavoriteClick}
                        className="p-1 rounded-full hover:bg-[#1a4280] transition-colors"
                    >
                        <Star
                            className={`w-4 h-4 transition-colors ${isFavorited ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                            fill={isFavorited ? 'currentColor' : 'none'}
                        />
                    </button>
                    <a
                        href={`/games/${game.id}`}
                        className="text-gray-300 text-sm hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {gameView} &gt;
                    </a>
                </div>
            </div>

            {/* Middle section */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col space-y-3">
                    {renderTeam(team1)}
                    {renderTeam(team2)}
                </div>

                <div className="flex flex-col items-end space-y-2">
                    <div className='flex space-x-2'>
                        <NewOddsButton
                            value={homeOption?.odds || 0}
                            label={team1.abbreviation}
                            onClick={(e) => handleWinMatchOddsClick(e, 'home')}
                            isSelected={selectedGame?.id === game.id && selectedOutcome === homeSelId}
                        />
                        <NewOddsButton
                            value={awayOption?.odds || 0}
                            label={team2.abbreviation}
                            onClick={(e) => handleWinMatchOddsClick(e, 'away')}
                            isSelected={selectedGame?.id === game.id && selectedOutcome === awaySelId}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom section */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <div className="flex items-center space-x-3 font-medium text-gray-400 text-xs">
                    {isLive ? (
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
                <div className="text-gray-300 font-medium text-xs">
                    <span>{league}</span>
                </div>
            </div>
        </div>
    );
};

export default Oddscard;