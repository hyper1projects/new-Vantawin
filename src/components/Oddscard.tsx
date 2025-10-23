import React from 'react';
import { getLogoSrc } from '../utils/logoMap';

interface TeamInfo {
  name: string;
  logoIdentifier: string; // Key to look up in logoMap
}

interface OddscardProps {
  time: string;
  data: string;
  teamA: TeamInfo;
  teamB: TeamInfo;
  gameView: string;
}

const Oddscard: React.FC<OddscardProps> = ({ time, data, teamA, teamB, gameView }) => {
  const teamALogo = getLogoSrc(teamA.logoIdentifier);
  const teamBLogo = getLogoSrc(teamB.logoIdentifier);

  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-sm bg-white w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{time}</span>
        <span>{data}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img src={teamALogo} alt={`${teamA.name} logo`} className="w-6 h-6 rounded-full object-cover" />
          <span className="font-semibold text-lg text-gray-800">{teamA.name}</span>
        </div>
        <span className="text-gray-600 font-medium text-sm">vs</span>
        <div className="flex items-center space-x-2">
          <img src={teamBLogo} alt={`${teamB.name} logo`} className="w-6 h-6 rounded-full object-cover" />
          <span className="font-semibold text-lg text-gray-800">{teamB.name}</span>
        </div>
      </div>
      <div className="text-right text-sm text-blue-600 font-medium">
        {gameView}
      </div>
    </div>
  );
};

export default Oddscard;