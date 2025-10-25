"use client";

import React from 'react';
import ImageCarousel from '../components/ImageCarousel';
import SectionHeader from '../components/SectionHeader';
import GameCard from '../components/GameCard';
import PointsMultiplierSection from '../components/PointsMultiplierSection';
import { Button } from '../components/ui/button';

const Index: React.FC = () => {
  // Dummy data for games
  const topGames = [
    { id: '1', title: 'Game Title 1', imageUrl: '/images/games/game-1.jpg', category: 'Slots' },
    { id: '2', title: 'Game Title 2', imageUrl: '/images/games/game-2.jpg', category: 'Table Games' },
    { id: '3', title: 'Game Title 3', imageUrl: '/images/games/game-3.jpg', category: 'Live Casino' },
    { id: '4', title: 'Game Title 4', imageUrl: '/images/games/game-4.jpg', category: 'Jackpots' },
    { id: '5', title: 'Game Title 5', imageUrl: '/images/games/game-5.jpg', category: 'Slots' },
    { id: '6', title: 'Game Title 6', imageUrl: '/images/games/game-6.jpg', category: 'Table Games' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Casino App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Games</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Promotions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600">Support</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ImageCarousel />
        </div>

        <SectionHeader title="Top Games" className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {topGames.map(game => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
        <div className="text-center mb-12">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">View All Games</Button>
        </div>

        <PointsMultiplierSection className="mb-12" /> {/* Added mb-12 here */}

        <SectionHeader title="New Games" className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {topGames.map(game => ( // Reusing topGames for demonstration
            <GameCard key={game.id} {...game} />
          ))}
        </div>
        <div className="text-center mb-12">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">View All New Games</Button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Casino App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;