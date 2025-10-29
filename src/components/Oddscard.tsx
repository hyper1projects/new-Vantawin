"use client";

import React from 'react';
import { format } from 'date-fns';

const Oddscard = ({ game }) => {
    const gameView = game.status === 'live' ? 'Live' : 'Game View';

    return (
        <div className="relative p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col justify-between h-full">
            {/* Game time moved to the top-left */}
            <div className="absolute top-2 left-2 text-gray-400 text-xs">
                {format(game.time, 'p')}
            </div>

            <div className="flex flex-col items-center text-white text-lg font-semibold mt-6 mb-4">
                <div className="flex items-center w-full justify-between">
                    <span>{game.homeTeam}</span>
                    <span className="text-sm text-gray-400 ml-2">{game.homeOdds}</span>
                </div>
                <div className="text-gray-500 text-sm my-1">vs</div>
                <div className="flex items-center w-full justify-between">
                    <span>{game.awayTeam}</span>
                    <span className="text-sm text-gray-400 ml-2">{game.awayOdds}</span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-md">
                    Bet Now
                </button>
                <a href={`/games/${game.id}`} className="text-gray-300 text-sm hover:underline font-medium">{gameView} &gt;</a>
            </div>

            {/* Game league moved to the bottom-right */}
            <div className="absolute bottom-2 right-2 text-gray-400 text-xs">
                {game.league}
            </div>
        </div>
    );
};

export default Oddscard;