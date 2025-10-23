import React from 'react';
import MatchCard from '@/components/MatchCard';

const PointsMultiplierSection: React.FC = () => {
  return (
    <div className="w-full py-8 px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8 text-left">Points Multiplier</h2>
      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-6">
        <MatchCard
          date="Today"
          team1Logo="https://via.placeholder.com/40"
          team1Name="Team Alpha"
          team2Logo="https://via.placeholder.com/40"
          team2Name="Team Beta"
          option1="Option 1"
          option2="Option 2"
          option3="Option 3"
        />
        <MatchCard
          date="Tomorrow"
          team1Logo="https://via.placeholder.com/40"
          team1Name="Team Gamma"
          team2Logo="https://via.placeholder.com/40"
          team2Name="Team Delta"
          option1="Option A"
          option2="Option B"
          option3="Option C"
        />
        <MatchCard
          date="Upcoming"
          team1Logo="https://via.placeholder.com/40"
          team1Name="Team Epsilon"
          team2Logo="https://via.placeholder.com/40"
          team2Name="Team Zeta"
          option1="Option X"
          option2="Option Y"
          option3="Option Z"
        />
      </div>
    </div>
  );
};

export default PointsMultiplierSection;