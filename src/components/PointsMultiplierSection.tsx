"use client";

import React from 'react';
import MatchCard from './MatchCard';
import { TeamLogos } from '@/assets/logos';

const PointsMultiplierSection = () => {
  const handlePredict = (matchId: string) => {
    console.log(`Predicting for match ${matchId}`);
    // In a real app, this would open the RightSidebar or navigate to a prediction page
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-vanta-blue-dark text-vanta-text-light font-outfit">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-left tracking-tight">Points Multiplier</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
        <MatchCard
          date="Today"
          time="09:00 PM"
          homeTeamName="Manchester United"
          awayTeamName="Leicester City"
          homeTeamLogo={TeamLogos.MANU}
          awayTeamLogo={TeamLogos.LEIC}
          multiplier={2.5}
          onPredict={() => handlePredict('match1')}
        />
        <MatchCard
          date="Tomorrow"
          time="03:00 PM"
          homeTeamName="Crystal Palace"
          awayTeamName="West Ham United"
          homeTeamLogo={TeamLogos.CRY}
          awayTeamLogo={TeamLogos.WHU}
          multiplier={1.8}
          onPredict={() => handlePredict('match2')}
        />
        <MatchCard
          date="Sunday"
          time="06:00 PM"
          homeTeamName="Aston Villa"
          awayTeamName="Manchester United"
          homeTeamLogo={TeamLogos.ASTON}
          awayTeamLogo={TeamLogos.MANU}
          multiplier={2.0}
          onPredict={() => handlePredict('match3')}
        />
      </div>
    </section>
  );
};

export default PointsMultiplierSection;