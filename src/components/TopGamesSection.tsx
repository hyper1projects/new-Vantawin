"use client";

import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import Oddscard from './Oddscard';
import { Button } from './ui/button';

const TopGamesSection = () => {
  const [activeFilter, setActiveFilter] = useState('All'); // State to manage the active filter

  const filterButtons = [
    { label: 'All', value: 'All' },
    { label: 'Live', value: 'Live' },
    { label: 'Upcoming', value: 'Upcoming' },
  ];

  return (
    <div className="w-full py-8 px-4">
      <SectionHeader title="Top Games" bgColor="#0D2C60" />
      
      <div className="flex flex-col gap-6 bg-[#011B47] p-6 rounded-b-xl">
        <div className="flex justify-start space-x-4 w-full ml-[-8px] border-b border-gray-700 pb-4">
          {filterButtons.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              className={`
                border-gray-600 h-8 px-3 text-sm rounded-2xl
                ${activeFilter === filter.value
                  ? 'bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE]' // Active state styling
                  : 'bg-[#0B295B] text-white hover:bg-gray-700' // Inactive state styling
                }
              `}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Oddscards, wrapped in a div to maintain flex-wrap behavior */}
        <div className="flex flex-wrap justify-center gap-6 w-full">
          <Oddscard
            team1={{ name: "Team A", logo: "/path/to/teamA-logo.png" }}
            team2={{ name: "Team B", logo: "/path/to/teamB-logo.png" }}
            odds={{ team1: 1.85, draw: 3.20, team2: 4.10 }}
            time="19:00"
            date="Today"
            league="Premier League"
          />
          <Oddscard
            team1={{ name: "Team C", logo: "/path/to/teamC-logo.png" }}
            team2={{ name: "Team D", logo: "/path/to/teamD-logo.png" }}
            odds={{ team1: 2.10, draw: 3.00, team2: 3.50 }}
            time="20:30"
            date="Tomorrow"
            league="La Liga"
          />
          <Oddscard
            team1={{ name: "Team E", logo: "/path/to/teamE-logo.png" }}
            team2={{ name: "Team F", logo: "/path/to/teamF-logo.png" }}
            odds={{ team1: 1.50, draw: 4.00, team2: 6.00 }}
            time="18:00"
            date="Today"
            league="Bundesliga"
          />
          <Oddscard
            team1={{ name: "Team G", logo: "/path/to/teamG-logo.png" }}
            team2={{ name: "Team H", logo: "/path/to/teamH-logo.png" }}
            odds={{ team1: 2.50, draw: 3.10, team2: 2.80 }}
            time="21:00"
            date="Tomorrow"
            league="Serie A"
          />
        </div>
      </div>
    </div>
  );
};

export default TopGamesSection;