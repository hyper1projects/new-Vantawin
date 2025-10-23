"use client";

import React from 'react';
import SectionHeader from './SectionHeader';
import Oddscard from './Oddscard';
import { Button } from './ui/button';

const TopGamesSection = () => {
  return (
    <div className="w-full py-8 px-4">
      <SectionHeader title="Top Games" bgColor="#0D2C60" />
      
      {/* This div now contains both the filter buttons and the Oddscards */}
      <div className="flex flex-col gap-6 bg-[#011B47] p-6 rounded-b-xl">
        {/* Filter buttons moved here, now aligned to the start and adjusted for padding */}
        <div className="flex justify-start space-x-4 mb-4 w-full ml-[-8px]"> {/* Added ml-[-8px] to align with SectionHeader title */}
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 bg-transparent h-8 px-3 text-sm">All</Button>
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 bg-transparent h-8 px-3 text-sm">Live</Button>
          <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 bg-transparent h-8 px-3 text-sm">Upcoming</Button>
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