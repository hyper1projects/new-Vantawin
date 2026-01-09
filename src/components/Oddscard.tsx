"use client";

import React from 'react';
import { Team, Game, Question } from '../types/game';
import NewOddsButton from './NewOddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { useNavigate } from 'react-router-dom';
import TeamLogo from './TeamLogo';

interface OddscardProps {
    game: Game;
}

const Oddscard: React.FC<OddscardProps> = ({ game }) => {
    if (!game) return null;

    const { team1, team2, league, isLive, gameView, questions } = game;

    if (!team1 || !team2) return null;

    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
    const navigate = useNavigate();

    const primaryQuestion: Question | undefined = questions.find(q => q.type === 'win_match');

    if (!primaryQuestion) return null;

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
        console.log("Oddscard: Card clicked. Navigating to Game Details.");
        navigate(`/games/${game.id}`);
    };

    const renderTeam = (team: Team) => {
        // Abbreviate team names longer than 15 characters
        const displayName = team.name.length > 15
            ? team.name.substring(0, 15) + '...'
            : team.name;

        return (
            <div className="flex items-center min-w-0 max-w-full">
                <TeamLogo
                    teamName={team.name}
                    className="w-6 h-6 mr-2 rounded-full object-contain bg-white/10 p-0.5 flex-shrink-0"
                />
                <span className="text-white font-semibold text-sm overflow-hidden" title={team.name}>
                    {displayName}
                </span>
            </div>
        );
    };

    const homeSelId = `${primaryQuestion.id}_${homeOption?.id}_${homeOption?.odds.toFixed(2)}`;
    const awaySelId = `${primaryQuestion.id}_${awayOption?.id}_${awayOption?.odds.toFixed(2)}`;

    return (
        <div
            className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full shadow-xl font-sans transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border border-transparent hover:border-indigo-600/50 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex justify-between items-center text-gray-400 text-xs mb-4 border-b border-gray-700/50 pb-2">
                <span className="text-white text-base font-medium">
                    {primaryQuestion.text}
                </span>
                <div className="flex items-center space-x-2">
                    <a
                        href={`/games/${game.id}`}
                        className="text-gray-300 text-sm hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {gameView} &gt;
                    </a>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col space-y-3 min-w-0 flex-1">
                    {renderTeam(team1)}
                    {renderTeam(team2)}
                </div>

                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
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