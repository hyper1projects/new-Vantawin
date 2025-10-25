"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import MatchCard from '../components/MatchCard';
import LiveGamesSection from '../components/LiveGamesSection';
import SportCategoryButtons from '../components/SportCategoryButtons'; // Import the new component

const Games = () => {
  const [selectedSport, setSelectedSport] = useState<string>('Football'); // State to manage selected sport
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle category selection and navigation
  const handleSelectCategory = (category: string) => {
    setSelectedSport(category);
    // Navigate to a dynamic route based on the selected category
    navigate(`/sports/${category.toLowerCase()}`);
  };

  // Dummy data for demonstration. In a real app, this would come from an API.
  const premierLeagueGames = [
    { id: '3', team1: 'Arsenal', team2: 'Chelsea', time: '15:00', date: '2023-10-28', odds1: 2.0, oddsX: 3.4, odds2: 3.6 },
    { id: '4', team1: 'Man Utd', team2: 'Liverpool', time: '17:30', date: '2023-10-28', odds1: 2.8, oddsX: 3.3, odds2: 2.5 },
  ];

  return (
    <div className="p-4">
      {/* Sport Category Buttons Section */}
      <SportCategoryButtons 
        onSelectCategory={handleSelectCategory} // Pass the new handler
        selectedCategory={selectedSport} 
      />

      {/* Live Games Section */}
      <div className="mt-8">
        <LiveGamesSection />
      </div>

      {/* Premier League Games Header */}
      <h2 className="text-2xl font-bold mb-4 mt-8 text-vanta-text-light">Premier League Games</h2>
      {/* Premier League Games Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {premierLeagueGames.map(game => (
          <MatchCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
};

export default Games;