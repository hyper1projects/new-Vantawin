import React from 'react';
import { Game } from '../types/game';
import TeamLogo from './TeamLogo';

interface MatchHeaderImageProps {
  game: Game;
}

const MatchHeaderImage: React.FC<MatchHeaderImageProps> = ({ game }) => {
  const { team1, team2, date, time, league, isLive } = game;

  return (
    <div className="relative bg-gradient-to-br from-vanta-blue-medium via-vanta-accent-dark-blue to-vanta-blue-dark rounded-2xl p-6 sm:p-8 shadow-2xl border border-vanta-accent-dark-blue/30">
      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 border border-red-500 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-400 text-xs font-bold">LIVE</span>
        </div>
      )}

      {/* League & Time Info */}
      <div className="text-center mb-6">
        <p className="text-vanta-neon-blue text-sm font-semibold mb-1">{league}</p>
        <p className="text-gray-400 text-xs">{date} • {time}</p>
      </div>

      {/* Teams Matchup */}
      <div className="flex items-center justify-between gap-4 sm:gap-8">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center group">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-vanta-neon-blue/20 rounded-full blur-xl group-hover:bg-vanta-neon-blue/30 transition-all"></div>
            <TeamLogo
              teamName={team1.name}
              className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain transition-transform group-hover:scale-110"
            />
          </div>
          <h3 className="text-white font-bold text-base sm:text-xl text-center">
            {team1.name.length > 15 ? team1.name.substring(0, 15) + '...' : team1.name}
          </h3>
        </div>

        {/* VS Divider */}
        <div className="flex flex-col items-center px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-vanta-neon-blue/20 blur-md rounded-full"></div>
            <span className="relative text-vanta-neon-blue text-2xl sm:text-3xl font-black">VS</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center group">
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-vanta-neon-blue/20 rounded-full blur-xl group-hover:bg-vanta-neon-blue/30 transition-all"></div>
            <TeamLogo
              teamName={team2.name}
              className="relative w-20 h-20 sm:w-24 sm:h-24 object-contain transition-transform group-hover:scale-110"
            />
          </div>
          <h3 className="text-white font-bold text-base sm:text-xl text-center">
            {team2.name.length > 15 ? team2.name.substring(0, 15) + '...' : team2.name}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MatchHeaderImage;