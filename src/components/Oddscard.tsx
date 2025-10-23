"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface OddscardProps {
  time: string;
  date: string;
  teamA: string;
  teamB: string;
  teamALogo: string; // Expecting a string path directly
  teamBLogo: string; // Expecting a string path directly
  oddsA: number;
  oddsB: number;
  gameView: 'Live' | 'Upcoming' | 'Finished';
}

const Oddscard: React.FC<OddscardProps> = ({
  time,
  date,
  teamA,
  teamB,
  teamALogo,
  teamBLogo,
  oddsA,
  oddsB,
  gameView,
}) => {
  const getOddsDisplay = (odds: number) => {
    if (odds > 0) {
      return `+${odds}`;
    }
    return odds.toString();
  };

  const getGameViewColor = (view: 'Live' | 'Upcoming' | 'Finished') => {
    switch (view) {
      case 'Live':
        return 'text-red-500';
      case 'Upcoming':
        return 'text-blue-500';
      case 'Finished':
        return 'text-gray-500';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{date}</span>
          <span>{time}</span>
        </div>
        <CardTitle className="text-center text-xl font-semibold mt-2">
          <span className={getGameViewColor(gameView)}>{gameView}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center flex-1">
            <img src={teamALogo} alt={`${teamA} logo`} className="w-12 h-12 object-contain mb-2" />
            <span className="font-medium text-lg text-center">{teamA}</span>
          </div>
          <span className="text-2xl font-bold mx-4">vs</span>
          <div className="flex flex-col items-center flex-1">
            <img src={teamBLogo} alt={`${teamB} logo`} className="w-12 h-12 object-contain mb-2" />
            <span className="font-medium text-lg text-center">{teamB}</span>
          </div>
        </div>

        <div className="flex justify-around w-full mt-4">
          <div className="flex flex-col items-center">
            <span className="text-gray-600 text-sm">Odds</span>
            <span className="text-xl font-bold text-green-600">{getOddsDisplay(oddsA)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600 text-sm">Odds</span>
            <span className="text-xl font-bold text-green-600">{getOddsDisplay(oddsB)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button className="w-full">
          Place Bet <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Oddscard;