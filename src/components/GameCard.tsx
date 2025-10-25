"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Game } from '../types/game';
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const team1Logo = getLogoSrc(game.team1.logoIdentifier);
  const team2Logo = getLogoSrc(game.team2.logoIdentifier);

  return (
    <Card className="bg-vanta-base text-vanta-text-light border-vanta-border flex flex-col h-full">
      <CardHeader className="pb-2">
        <p className="text-xs text-vanta-text-medium mb-1">{game.date} - {game.time}</p>
        <CardTitle className="text-base font-semibold flex items-center justify-center space-x-2">
          <img src={team1Logo} alt={game.team1.name} className="h-6 w-6 object-contain" />
          <span>{game.team1.name}</span>
          <span className="text-vanta-text-medium">vs</span>
          <span>{game.team2.name}</span>
          <img src={team2Logo} alt={game.team2.name} className="h-6 w-6 object-contain" />
        </CardTitle>
        <p className="text-xs text-vanta-text-medium text-center mt-1">{game.league}</p>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center py-2">
        <div className="grid grid-cols-3 gap-2 w-full text-center">
          <Button variant="outline" className="bg-vanta-dark-card text-vanta-text-light border-vanta-border hover:bg-vanta-accent hover:text-vanta-base">
            {game.odds.team1}
          </Button>
          <Button variant="outline" className="bg-vanta-dark-card text-vanta-text-light border-vanta-border hover:bg-vanta-accent hover:text-vanta-base">
            {game.odds.draw}
          </Button>
          <Button variant="outline" className="bg-vanta-dark-card text-vanta-text-light border-vanta-border hover:bg-vanta-accent hover:text-vanta-base">
            {game.odds.team2}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full bg-vanta-accent text-vanta-base hover:bg-vanta-accent/90">
          {game.gameView}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;