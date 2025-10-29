"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allGamesData } from '../data/games'; // Import centralized game data
import { getLogoSrc } from '../utils/logoMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const game = allGamesData.find(g => g.id === gameId);

  if (!game) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
        <p className="mb-4">The game you are looking for does not exist.</p>
        <Button onClick={() => navigate('/games')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px]">
          Go to Games
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 text-vanta-text-light">
      <Button
        onClick={() => navigate(-1)} // Go back to the previous page
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Games
      </Button>

      <div className="bg-vanta-blue-medium rounded-[27px] p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-vanta-text-light mb-6 text-center">Game Overview</h1>

        {/* Match Header */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <img src={getLogoSrc(game.team1.logoIdentifier)} alt={game.team1.name} className="w-24 h-24 object-contain mb-2" />
            <span className="text-2xl font-bold text-vanta-text-light">{game.team1.name}</span>
          </div>
          <span className="text-4xl font-extrabold text-gray-400 mx-8">VS</span>
          <div className="flex flex-col items-center text-center">
            <img src={getLogoSrc(game.team2.logoIdentifier)} alt={game.team2.name} className="w-24 h-24 object-contain mb-2" />
            <span className="text-2xl font-bold text-vanta-text-light">{game.team2.name}</span>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg mb-8">
          <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
            <span className="text-gray-400">Date:</span>
            <span className="font-semibold">{game.date}</span>
          </div>
          <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
            <span className="text-gray-400">Time:</span>
            <span className="font-semibold">{game.time}</span>
          </div>
          <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
            <span className="text-gray-400">League:</span>
            <span className="font-semibold">{game.league}</span>
          </div>
          <div className="flex justify-between items-center bg-[#012A5E] p-4 rounded-lg">
            <span className="text-gray-400">Status:</span>
            <span className={`font-semibold ${game.isLive ? 'text-red-500' : 'text-green-500'}`}>
              {game.isLive ? 'LIVE' : 'Upcoming'}
            </span>
          </div>
        </div>

        {/* Odds Section */}
        <h2 className="text-2xl font-bold text-vanta-text-light mb-4 text-center">Current Odds</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <div className="bg-[#012A5E] p-4 rounded-lg flex-1 text-center">
            <p className="text-gray-400 text-sm">{game.team1.name} Win</p>
            <p className="text-3xl font-bold text-vanta-neon-blue">{(game.odds?.team1 ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-[#012A5E] p-4 rounded-lg flex-1 text-center">
            <p className="text-gray-400 text-sm">Draw</p>
            <p className="text-3xl font-bold text-vanta-neon-blue">{(game.odds?.draw ?? 0).toFixed(2)}</p>
          </div>
          <div className="bg-[#012A5E] p-4 rounded-lg flex-1 text-center">
            <p className="text-gray-400 text-sm">{game.team2.name} Win</p>
            <p className="text-3xl font-bold text-vanta-neon-blue">{(game.odds?.team2 ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Call to Action (e.g., Predict Now) */}
        <div className="text-center">
          <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] py-3 px-8 text-lg font-bold">
            Predict Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;