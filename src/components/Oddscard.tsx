"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface OddscardProps {
  date: string;
  time: string;
  isLive: boolean;
  league: string;
  team1: string;
  team2: string;
  odds1: string;
  oddsX: string;
  odds2: string;
}

const Oddscard: React.FC<OddscardProps> = ({
  date,
  time,
  isLive,
  league,
  team1,
  team2,
  odds1,
  oddsX,
  odds2,
}) => {
  return (
    <div className="relative p-[2px] rounded-[27px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE] w-full">
      <div className="bg-[#011B47] rounded-[27px] h-full w-full p-4 flex flex-col justify-between text-vanta-text-light">
        {/* Question */}
        <div className="text-lg font-bold text-white mb-4 text-center">
          Will Aston Villa win this game?
        </div>

        {/* Header: Date, Time, Live/League */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-base font-semibold text-gray-400">{date} - {time}</span>
          {isLive ? (
            <span className="text-red-500 font-bold">LIVE</span>
          ) : (
            <span className="text-gray-400">{league}</span>
          )}
        </div>

        {/* Teams and Odds */}
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{team1}</span>
            <Button className="bg-[#00EEEE] text-[#011B47] font-bold py-2 px-4 rounded-full hover:bg-[#00EEEE]/80">
              {odds1}
            </Button>
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Draw</span>
            <Button className="bg-[#00EEEE] text-[#011B47] font-bold py-2 px-4 rounded-full hover:bg-[#00EEEE]/80">
              {oddsX}
            </Button>
          </div>
          <Separator className="bg-gray-700" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">{team2}</span>
            <Button className="bg-[#00EEEE] text-[#011B47] font-bold py-2 px-4 rounded-full hover:bg-[#00EEEE]/80">
              {odds2}
            </Button>
          </div>
        </div>

        {/* Footer: Bet Now Button */}
        <Button className="w-full bg-gradient-to-r from-[#9A3FFE] to-[#00EEEE] text-white font-bold py-3 px-4 rounded-full text-lg hover:from-[#9A3FFE]/80 hover:to-[#00EEEE]/80">
          Bet Now
        </Button>
      </div>
    </div>
  );
};

export default Oddscard;