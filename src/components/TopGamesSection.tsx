"use client";

import React from 'react';
import MatchCard from '@/components/MatchCard';
import SectionHeader from './SectionHeader'; // Ensuring the relative import path is correct
import { TeamLogos } from '@/assets/logos';

const TopGamesSection: React.FC = () => {
  return (
    <div className="w-full py-8 px-4">
      <SectionHeader title="Top Games" bgColor="#0D2C60" className="mb-6" />
      <div className="flex flex-wrap justify-center gap-6 bg-[#0B295B] p-6 rounded-b-xl">
        <MatchCard
          date="Today"
          team1Logo={TeamLogos.CRY}
          team1Name="Crystal Palace"
          team2Logo={TeamLogos.ASTON}
          team2Name="Aston Villa"
          option1="1.50"
          option2="3.20"
          option3="2.80"
        />
        <MatchCard
          date="Tomorrow"
          team1Logo={TeamLogos.MANU}
          team1Name="Man. United"
          team2Logo={TeamLogos.LEIC}
          team2Name="Leicester City"
          option1="1.80"
          option2="3.00"
          option3="2.50"
        />
        <MatchCard
          date="Upcoming"
          team1Logo={TeamLogos.WHU}
          team1Name="West Ham United"
          team2Logo={TeamLogos.CRY}
          team2Name="Crystal Palace"
          option1="2.10"
          option2="3.10"
          option3="2.20"
        />
      </div>
    </div>
  );
};

export default TopGamesSection;