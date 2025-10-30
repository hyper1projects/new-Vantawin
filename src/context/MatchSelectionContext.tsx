"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom'; // Keep useNavigate for potential future use, but remove from setSelectedMatch
import { Game } from '../types/game'; // Assuming Game type is defined here

interface MatchSelectionContextType {
  selectedGame: Game | null;
  selectedOutcome: 'team1' | 'draw' | 'team2' | null;
  setSelectedMatch: (game: Game | null, outcome?: 'team1' | 'draw' | 'team2' | null) => void;
}

const MatchSelectionContext = createContext<MatchSelectionContextType | undefined>(undefined);

export const MatchSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<'team1' | 'draw' | 'team2' | null>(null);
  // const navigate = useNavigate(); // Initialize useNavigate - no longer used directly in setSelectedMatch

  const setSelectedMatch = (game: Game | null, outcome: 'team1' | 'draw' | 'team2' | null = null) => {
    setSelectedGame(game);
    setSelectedOutcome(outcome);
    // Removed automatic navigation here. Navigation will now be handled by the Oddscard itself.
    // if (game) {
    //   navigate(`/games/${game.id}`);
    // }
  };

  return (
    <MatchSelectionContext.Provider value={{ selectedGame, selectedOutcome, setSelectedMatch }}>
      {children}
    </MatchSelectionContext.Provider>
  );
};

export const useMatchSelection = () => {
  const context = useContext(MatchSelectionContext);
  if (context === undefined) {
    throw new Error('useMatchSelection must be used within a MatchSelectionProvider');
  }
  return context;
};