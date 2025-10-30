"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Game } from '../types/game';
import { getLogoSrc } from '../utils/logoMap';
import OddsButton from '../components/OddsButton';
import { useMatchSelection } from '../context/MatchSelectionContext';
import SimpleQuestionCard from '../components/SimpleQuestionCard'; // Import the new component

// Dummy game data (same as in Index.tsx for consistency)
const dummyGames: Game[] = [
    {
        id: 'game1',
        team1: { name: 'Cloud9', logoIdentifier: 'cloud9' },
        team2: { name: 'Fnatic', logoIdentifier: 'fnatic' },
        odds: { team1: 1.5, draw: 3.0, team2: 2.5 },
        time: '19:00',
        date: '2024-03-10',
        league: 'LEC',
        isLive: false,
        gameView: 'Match Details',
        questionType: 'win_match',
    },
    {
        id: 'game2',
        team1: { name: 'G2 Esports', logoIdentifier: 'g2esports' },
        team2: { name: 'Team Liquid', logoIdentifier: 'teamliquid' },
        odds: { team1: 2.1, draw: 3.2, team2: 1.9 },
        time: '20:30',
        date: '2024-03-10',
        league: 'LCS',
        isLive: true,
        gameView: 'Live Stream',
        questionType: 'btts',
    },
    {
        id: 'game3',
        team1: { name: 'T1', logoIdentifier: 't1' },
        team2: { name: 'Gen.G', logoIdentifier: 'geng' },
        odds: { team1: 1.7, draw: 3.5, team2: 2.2 },
        time: '18:00',
        date: '2024-03-11',
        league: 'LCK',
        isLive: false,
        gameView: 'Highlights',
        questionType: 'over_2_5_goals',
    },
    {
        id: 'game4',
        team1: { name: 'Evil Geniuses', logoIdentifier: 'evilgeniuses' },
        team2: { name: '100 Thieves', logoIdentifier: '100thieves' },
        odds: { team1: 2.3, draw: 3.1, team2: 1.8 },
        time: '21:00',
        date: '2024-03-11',
        league: 'LCS',
        isLive: false,
        gameView: 'Match Details',
        questionType: 'score_goals',
    },
    // Add the dummy game for the new card here as well, so it can be found by ID
    {
        id: 'new-card-game',
        team1: { name: 'Team A', logoIdentifier: 'default' },
        team2: { name: 'Team B', logoIdentifier: 'default' },
        odds: { team1: 1.9, draw: 3.3, team2: 2.0 },
        time: '12:00',
        date: '2024-03-15',
        league: 'Special League',
        isLive: false,
        gameView: 'Details',
        questionType: 'win_match',
    },
    {
        id: 'question-game-1', // The dummy game used for SimpleQuestionCard
        time: 'N/A',
        date: 'N/A',
        team1: { name: 'Manchester City', logoIdentifier: 'MCI' },
        team2: { name: 'Arsenal', logoIdentifier: 'ARS' },
        odds: { team1: 1.0, draw: 1.0, team2: 1.0 },
        league: 'Premier League',
        isLive: false,
        gameView: 'N/A',
        questionType: 'win_match',
    },
];

const GameDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();

    const game = dummyGames.find(g => g.id === id);

    if (!game) {
        return (
            <div className="p-4 text-white">
                <button onClick={() => navigate(-1)} className="text-vanta-neon-blue flex items-center mb-4">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <h1 className="text-2xl font-bold">Game Not Found</h1>
                <p>The game you are looking for does not exist.</p>
            </div>
        );
    }

    const handleOddsClick = (outcome: 'team1' | 'draw' | 'team2') => {
        setSelectedMatch(game, outcome);
    };

    const renderTeam = (team: { name: string; logoIdentifier: string }) => (
        <div className="flex flex-col items-center">
            <img
                src={getLogoSrc(team.logoIdentifier)}
                alt={team.name}
                className="w-16 h-16 md:w-20 md:h-20 object-contain mb-2 rounded-full bg-white/10 p-1"
            />
            <span className="text-white font-semibold text-lg md:text-xl">{team.name}</span>
        </div>
    );

    return (
        <div className="p-4 text-white">
            <button onClick={() => navigate(-1)} className="text-vanta-neon-blue flex items-center mb-6 hover:underline">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">{game.league}</h1>

            <div className="flex justify-around items-center mb-8">
                {renderTeam(game.team1)}
                <span className="text-2xl font-bold text-gray-400 mx-4">VS</span>
                {renderTeam(game.team2)}
            </div>

            <div className="text-center text-gray-400 mb-8">
                <p className="text-lg">{game.date} at {game.time}</p>
                {game.isLive && (
                    <span className="flex items-center justify-center text-red-400 font-bold tracking-wider mt-2">
                        <span className="relative flex h-3 w-3 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        LIVE
                    </span>
                )}
            </div>

            {/* Main Odds Section */}
            <div className="bg-[#0D2C60] rounded-xl p-6 shadow-xl mb-8">
                <h2 className="text-xl font-bold mb-4">Match Odds</h2>
                <div className="grid grid-cols-3 gap-4">
                    <OddsButton
                        value={game.odds?.team1 ?? 0}
                        label={game.team1.name}
                        onClick={() => handleOddsClick('team1')}
                        isSelected={selectedGame?.id === game.id && selectedOutcome === 'team1'}
                    />
                    <OddsButton
                        value={game.odds?.draw ?? 0}
                        label="Draw"
                        onClick={() => handleOddsClick('draw')}
                        isSelected={selectedGame?.id === game.id && selectedOutcome === 'draw'}
                    />
                    <OddsButton
                        value={game.odds?.team2 ?? 0}
                        label={game.team2.name}
                        onClick={() => handleOddsClick('team2')}
                        isSelected={selectedGame?.id === game.id && selectedOutcome === 'team2'}
                    />
                </div>
            </div>

            {/* New Simple Question Card */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Special Question</h2>
                <SimpleQuestionCard game={game} /> {/* Pass the current game object */}
            </div>

            {/* Additional details or sections can go here */}
            <div className="mt-8 text-gray-300">
                <h2 className="text-xl font-bold mb-4">Game Information</h2>
                <p>Game ID: {game.id}</p>
                <p>View: {game.gameView}</p>
                <p>Question Type: {game.questionType}</p>
                {/* More details as needed */}
            </div>
        </div>
    );
};

export default GameDetails;