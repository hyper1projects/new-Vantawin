"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OddsCard from './OddsCard'; // Assuming OddsCard is in the same components directory

interface Game {
  id: string;
  title: string;
  provider: string; // For sports, this can be the league name
  thumbnail: string;
  sport: string;
  league: string;
  isLive?: boolean; // To distinguish live games
}

// Dummy live game data for this component
const dummyLiveGames: Game[] = [
  { id: 'fpl1', title: 'Man Utd vs Liverpool', provider: 'Premier League', thumbnail: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=MU+vs+LIV', sport: 'Football', league: 'Premier League', isLive: true },
  { id: 'fol1', title: 'Real Madrid vs Barca', provider: 'La Liga', thumbnail: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=RM+vs+BAR', sport: 'Football', league: 'La Liga', isLive: true },
  { id: 'fol3', title: 'PSG vs Marseille', provider: 'Ligue 1', thumbnail: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=PSG+vs+MAR', sport: 'Football', league: 'Ligue 1', isLive: true },
  { id: 'bna1', title: 'Lakers vs Celtics', provider: 'NBA', thumbnail: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=LAL+vs+BOS', sport: 'Basketball', league: 'NBA', isLive: true },
  { id: 'bol1', title: 'EuroLeague Game 1', provider: 'EuroLeague', thumbnail: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=EuroLeague', sport: 'Basketball', league: 'EuroLeague', isLive: true },
  { id: 'tat1', title: 'Djokovic vs Nadal', provider: 'ATP Tour', thumbnail: 'https://via.placeholder.com/150/FFFF33/000000?text=Djokovic+vs+Nadal', sport: 'Tennis', league: 'ATP Tour', isLive: true },
  { id: 'ell1', title: 'Fnatic vs G2 (LoL)', provider: 'LEC', thumbnail: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Fnatic+vs+G2', sport: 'Esports', league: 'LEC', isLive: true },
];

interface LiveGamesSectionProps {
  className?: string;
}

const LiveGamesSection: React.FC<LiveGamesSectionProps> = ({ className }) => {
  const [liveGamesOpen, setLiveGamesOpen] = useState(true);

  if (dummyLiveGames.length === 0) return null;

  return (
    <Collapsible open={liveGamesOpen} onOpenChange={setLiveGamesOpen} className={`w-full ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-vanta-dark-card rounded-t-md border-b border-vanta-border mt-4">
        <h2 className="text-lg font-semibold text-vanta-text-light">Live Games</h2>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <span className="sr-only">Toggle</span>
            {liveGamesOpen ? (
              <ChevronUp className="h-4 w-4 text-vanta-text-medium" />
            ) : (
              <ChevronDown className="h-4 w-4 text-vanta-text-medium" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="bg-vanta-dark-card rounded-b-md p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dummyLiveGames.map((game) => (
            <OddsCard key={game.id} game={game} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LiveGamesSection;