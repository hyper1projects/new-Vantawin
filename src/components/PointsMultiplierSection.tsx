"use client";

import React from 'react';
import MatchCard from './MatchCard'; // Assuming MatchCard is in the same directory or correctly imported
import { TeamLogos } from '@/assets/logos'; // Import the centralized TeamLogos map

const PointsMultiplierSection: React.FC = () => {
  return (
    <div className="w-full py-8 px-4">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-left tracking-tight">Points Multiplier</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
        <MatchCard
          date="Today"
          time="09:00 PM"
          team1Logo={TeamLogos.MANU}
          team1Name="Man. United"
          team2Logo={TeamLogos.LEIC}
          team2Name="Leicester City"
          multiplier="2.5x"
        />
        <MatchCard
          date="Tomorrow"
          time="09:00 PM"
          team1Logo={TeamLogos.MANU}
          team1Name="Man. United"
          team2Logo={TeamLogos.LEIC}
          team2Name="Leicester City"
          multiplier="2.5x"
        />
        <MatchCard
          date="Tomorrow"
          time="09:00 PM"
          team1Logo={TeamLogos.MANU}
          team1Name="Man. United"
          team2Logo={TeamLogos.LEIC}
          team2Name="Leicester City"
          multiplier="2.5x"
        />
      </div>
    </div>
  );
};

export default PointsMultiplierSection;