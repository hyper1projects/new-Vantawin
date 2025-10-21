"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import GameCard from './GameCard'; // Import the new GameCard component

// Placeholder images for sports icons
import FootballIcon from '/public/images/icons/football.svg';
import BasketballIcon from '/public/images/icons/basketball.svg';
import TennisIcon from '/public/images/icons/tennis.svg';
import AmericanFootballIcon from '/public/images/icons/american-football.svg';

// Team logos
import ManUnitedLogo from '/public/images/man_united_logo.png';
import LeicesterCityLogo from '/public/images/leicester_city_logo.png';

const TopGamesSection = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSport, setActiveSport] = useState('Football'); // Default active sport

  const filters = ['All', 'Live', 'Up Next'];
  const sports = [
    { name: 'Football', icon: FootballIcon },
    { name: 'Basketball', icon: BasketballIcon },
    { name: 'Tennis', icon: TennisIcon },
    { name: 'A.Football', icon: AmericanFootballIcon },
  ];

  // Dummy game data
  const games = [
    {
      status: 'Live',
      team1Logo: ManUnitedLogo,
      team1Name: 'Crystal Palace',
      team2Logo: LeicesterCityLogo,
      team2Name: 'West Ham United',
      option1: 'CRY',
      option2: 'DRAW',
      option3: 'WHU',
    },
    {
      status: 'Live',
      team1Logo: ManUnitedLogo,
      team1Name: 'Crystal Palace',
      team2Logo: LeicesterCityLogo,
      team2Name: 'West Ham United',
      option1: 'CRY',
      option2: 'DRAW',
      option3: 'WHU',
    },
    {
      status: '9:00 AM AUG 8',
      team1Logo: ManUnitedLogo,
      team1Name: 'Crystal Palace',
      team2Logo: LeicesterCityLogo,
      team2Name: 'West Ham United',
      option1: 'CRY',
      option2: 'DRAW',
      option3: 'WHU',
    },
  ];

  return (
    <div className="w-full py-8 bg-[#011B47] rounded-[27px] mt-8">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-left tracking-tight px-4">Top Games</h2>

      {/* Filter Buttons and Sport Icons */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 px-4">
        <div className="flex space-x-2 mb-4 sm:mb-0">
          {filters.map((filter) => (
            <Button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-6 py-2 text-base font-semibold transition-colors duration-200
                ${activeFilter === filter ? 'bg-vanta-neon-blue text-vanta-blue-dark' : 'bg-vanta-blue-medium text-vanta-text-light hover:bg-vanta-accent-dark-blue'}
              `}
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="flex space-x-4">
          {sports.map((sport) => (
            <div
              key={sport.name}
              onClick={() => setActiveSport(sport.name)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200
                ${activeSport === sport.name ? 'bg-vanta-neon-blue p-0.5' : 'bg-vanta-blue-medium hover:bg-vanta-accent-dark-blue'}
              `}
            >
              <img src={sport.icon} alt={sport.name} className="w-full h-full object-contain rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-vanta-blue-medium my-6"></div> {/* Separator line */}

      {/* Game Cards */}
      <div className="flex flex-col gap-6 px-4">
        {games.map((game, index) => (
          <GameCard
            key={index}
            status={game.status}
            team1Logo={game.team1Logo}
            team1Name={game.team1Name}
            team2Logo={game.team2Logo}
            team2Name={game.team2Name}
            option1={game.option1}
            option2={game.option2}
            option3={game.option3}
          />
        ))}
      </div>

      {/* Show More Button */}
      <div className="text-center mt-8">
        <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90 px-8 py-3 rounded-[14px] text-base font-semibold">
          Show More
        </Button>
      </div>
    </div>
  );
};

export default TopGamesSection;