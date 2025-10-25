"use client";

import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Oddscard from './Oddscard'; // Import the new Oddscard component
import { Game } from '../types/game';

interface LiveGamesSectionProps {
  className?: string;
}

const LiveGamesSection: React.FC<LiveGamesSectionProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  // Sample live game data
  const liveGames: Game[] = [
    {
      id: 'live-game-1',
      time: 'LIVE',
      date: 'Now',
      team1: { name: 'Team A', logoIdentifier: 'teamA' },
      team2: { name: 'Team B', logoIdentifier: 'teamB' },
      odds: { team1: 2.1, draw: 3.2, team2: 1.9 },
      league: 'Premier League',
      isLive: true,
      gameView: 'Watch Live',
    },
    {
      id: 'live-game-2',
      time: 'LIVE',
      date: 'Now',
      team1: { name: 'Team B', logoIdentifier: 'teamB' },
      team2: { name: 'Team A', logoIdentifier: 'teamA' },
      odds: { team1: 2.0, draw: 3.1, team2: 2.0 },
      league: 'La Liga',
      isLive: true,
      gameView: 'Watch Live',
    },
    {
      id: 'live-game-3',
      time: 'LIVE',
      date: 'Now',
      team1: { name: 'Team A', logoIdentifier: 'teamA' },
      team2: { name: 'Team B', logoIdentifier: 'teamB' },
      odds: { team1: 2.3, draw: 3.0, team2: 2.8 },
      league: 'Serie A',
      isLive: true,
      gameView: 'Watch Live',
    },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`w-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-vanta-dark-card rounded-t-md border-b border-vanta-border">
        <h2 className="text-lg font-semibold text-vanta-text-light">Live Games</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0 text-vanta-text-light hover:bg-vanta-base">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle Live Games</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="bg-vanta-base p-4 rounded-b-md border border-t-0 border-vanta-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {liveGames.map((game) => (
            <Oddscard key={game.id} {...game} /> {/* Pass game props directly to Oddscard */}
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LiveGamesSection;