import React from 'react';
import { getLogoSrc } from '../utils/logoMap'; // New import for the central map
import { Clock, CalendarDays, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OddscardProps {
  matchTime: string;
  matchDate: string;
  league: string;
  homeTeamName: string;
  awayTeamName: string;
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
  isLive?: boolean;
}

const Oddscard: React.FC<OddscardProps> = ({
  matchTime,
  matchDate,
  league,
  homeTeamName,
  awayTeamName,
  homeOdds,
  drawOdds,
  awayOdds,
  isLive = false,
}) => {
  return (
    <div className="flex flex-col bg-[#0D2C60] rounded-xl p-4 w-full max-w-sm">
      {/* Top section: Time/Live & Date (left), League (right) */}
      <div className="flex justify-between items-center text-gray-400 text-xs mb-4">
        <div className="flex items-center space-x-2">
          {/* Left side: Time/Live, Date & Live indicator */}
          <Clock size={12} />
          <span>{matchTime}</span>
          <CalendarDays size={12} />
          <span>{matchDate}</span>
          {isLive && (
            <span className="bg-red-500 text-white px-1 py-0.5 rounded-sm text-[10px] font-bold">LIVE</span>
          )}
        </div>
        {/* Right side: League */}
        <div className="flex items-center space-x-1">
          <span>{league}</span>
          <ChevronRight size={12} />
        </div>
      </div>

      {/* Middle section: Team names and logos */}
      <div className="flex justify-between items-center text-white text-sm font-semibold mb-4">
        <div className="flex items-center space-x-2">
          <img src={getLogoSrc(homeTeamName)} alt={homeTeamName} className="w-6 h-6" />
          <span>{homeTeamName}</span>
        </div>
        <span className="text-gray-400">vs</span>
        <div className="flex items-center space-x-2">
          <span>{awayTeamName}</span>
          <img src={getLogoSrc(awayTeamName)} alt={awayTeamName} className="w-6 h-6" />
        </div>
      </div>

      {/* Bottom section: Odds buttons */}
      <div className="grid grid-cols-3 gap-2 text-white text-sm font-bold">
        <Button variant="outline" className="bg-[#1A3A6F] hover:bg-[#2A4A7F] text-white border-none">
          {homeOdds}
        </Button>
        <Button variant="outline" className="bg-[#1A3A6F] hover:bg-[#2A4A7F] text-white border-none">
          {drawOdds}
        </Button>
        <Button variant="outline" className="bg-[#1A3A6F] hover:bg-[#2A4A7F] text-white border-none">
          {awayOdds}
        </Button>
      </div>
    </div>
  );
};

export default Oddscard;