"use client";

import React from 'react';
import Oddscard from './Oddscard'; // Changed from MatchCard to Oddscard
import SectionHeader from './SectionHeader';
import { TeamLogos } from '@/assets/logos'; // Import the centralized TeamLogos map

const PointsMultiplierSection: React.FC = () => {
  return (
    <div className="w-full py-8 px-4">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-left tracking-tight">Points Multiplier</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
        <Oddscard
          matchDate="Today"
          matchTime="19:00"
          isLive={false}
          team1Logo={TeamLogos.MANU}
          team1Name="Man. United"
          team2Logo={TeamLogos.LEIC}
          team2Name="Leicester City"
          option1Label="1"
          option1Value="1.90"
          option2Label="X"
          option2Value="3.10"
          option3Label="2"
          option3Value="2.40"
        />
        <Oddscard
          matchDate="Tomorrow"
          matchTime="21:00"
          isLive={true}
          team1Logo={TeamLogos.CRY}
          team1Name="Crystal Palace"
          team2Logo={TeamLogos.ASTON}
          team2Name="Aston Villa"
          option1Label="1"
          option1Value="2.20"
          option2Label="X"
          option2Value="3.00"
          option3Label="2"
          option3Value="2.10"
        />
        <Oddscard
          matchDate="Upcoming"
          matchTime="16:30"
          isLive={false}
          team1Logo={TeamLogos.WHU}
          team1Name="West Ham United"
          team2Logo={TeamLogos.MANU}
          team2Name="Man. United"
          option1Label="1"
          option1Value="2.00"
          option2Label="X"
          option2Value="3.25"
          option3Label="2"
          option3Value="2.30"
        />
      </div>
    </div>
  );
};

export default PointsMultiplierSection;