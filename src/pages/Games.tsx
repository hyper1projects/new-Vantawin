"use client";

import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import SportCategoryButtons from '../components/SportCategoryButtons';
import LiveGamesSection from '../components/LiveGamesSection';
import PremierLeagueSection from '../components/PremierLeagueSection';
import LaLigaSection from '../components/LaLigaSection';
import SimpleQuestionCard from '../components/SimpleQuestionCard'; // Import the new component
import { useLocation, useNavigate } from 'react-router-dom';
import { Game } from '../types/game'; // Import Game type for the dummy data

const Games = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get category from URL query parameter, default to 'football'
  const queryParams = new URLSearchParams(location.search);
  const urlCategory = queryParams.get('category') || 'football';
  
  const [selectedSport, setSelectedSport] = useState<string>(urlCategory);

  useEffect(() => {
    // Update selectedSport state if URL category changes
    setSelectedSport(urlCategory);
  }, [urlCategory]);

  const handleSelectCategory = (category: string) => {
    // Update URL with the new category query parameter
    navigate(`/games?category=${category.toLowerCase()}`);
  };

  const formattedSelectedSport = selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1);

  // Dummy game data for the new SimpleQuestionCard
  const dummyQuestionGame: Game = {
    id: 'question-game-1',
    time: 'N/A',
    date: 'N/A',
    team1: { name: 'Manchester City', logoIdentifier: 'MCI' }, // Using existing logo identifiers
    team2: { name: 'Arsenal', logoIdentifier: 'ARS' },
    odds: { team1: 1.0, draw: 1.0, team2: 1.0 }, // Placeholder odds, not displayed by SimpleQuestionCard
    league: 'Premier League',
    isLive: false,
    gameView: 'N/A',
    questionType: 'win_match', // Ensures the question is "Will team1 win this game?"
  };

  return (
    <div className="p-4">
      {/* Sport Category Buttons Section */}
      <SportCategoryButtons 
        onSelectCategory={handleSelectCategory} 
        selectedCategory={formattedSelectedSport} 
      />

      {/* Conditionally render content based on selectedSport */}
      {selectedSport === 'football' ? (
        <>
          <div className="mt-8">
            <LiveGamesSection />
          </div>

          {/* Premier League Section */}
          <div className="mt-8">
            <PremierLeagueSection />
          </div>

          {/* New La Liga Section */}
          <div className="mt-8">
            <LaLigaSection />
          </div>

          {/* New Simple Question Card */}
          <div className="mt-8">
            <SimpleQuestionCard game={dummyQuestionGame} />
          </div>
        </>
      ) : (
        <div className="mt-8">
          <SectionHeader title={`${formattedSelectedSport} Games`} className="mb-4" textColor="text-vanta-text-light" />
          <p className="text-vanta-text-medium mt-4">
            Content for the {formattedSelectedSport} category will go here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Games;