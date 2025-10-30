"use client";

import React from 'react';
import { Game } from '../types/game';
// Button is no longer needed if the component is empty
// import { Button } from '@/components/ui/button';

interface MatchDetailsInfoProps {
  game: Game;
}

const MatchDetailsInfo: React.FC<MatchDetailsInfoProps> = ({ game }) => {
  // The component is now empty as all content has been removed.
  // It can be removed from GameDetails.tsx if it's no longer needed.
  return null;
};

export default MatchDetailsInfo;