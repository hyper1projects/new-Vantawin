"use client";

import React from 'react';
import Oddscard from './Oddscard'; // Importing the new Oddscard component
import SectionHeader from './SectionHeader';
import { TeamLogos } from '@/assets/logos';

const TopGamesSection: React.FC = () => {
  return (
    <div className="w-full py-8 px-4">
      <SectionHeader title="Top Games" bgColor="#0D2C60" className="mb-6" />
      <div className="flex flex-wrap justify-center gap-6 bg-[#0B295B] p-6 rounded-b-xl">
        <Oddscard
          matchDate="Today"
          matchTime="18:00"
          isLive={false}
          team1Logo={TeamLogos.CRY}
          team1Name="Crystal Palace"
          team2Logo={TeamLogos.ASTON}
          team2Name="Aston Villa"
          option1Label="1"
          option1Value="1.50"
          option2Label="X"
          option2Value="3.20"
          option3Label="2"
          option3Value="2.80"
        />
        <Oddscard
          matchDate="Tomorrow"
          matchTime="20:30"
          isLive={true} {/* Example of a live match */}
          team1Logo={TeamLogos.MANU}
          team1Name="Man. United"
          team2Logo={TeamLogos.LEIC}
          team2Name="Leicester City"
          option1Label="1"
          option1Value="1.80"
          option2Label="X"
          option2Value="3.00"
          option3Label="2"
          option3Value="2.50"
        />
        <Oddscard
          matchDate="Upcoming"
          matchTime="15:00"
          isLive={false}
          team1Logo={TeamLogos.WHU}
          team1Name="West Ham United"
          team2Logo={TeamLogos.CRY}
          team2Name="Crystal Palace"
          option1Label="1"
          option1Value="2.10"
          option2Label="X"
          option2Value="3.10"
          option3Label="2"
          option3Value="2.20"
        />
      </div>
    </div>
  );
};

export default TopGamesSection;