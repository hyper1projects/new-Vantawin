"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types/game';

interface MatchSelectionContextType {
  selectedGame: Game | null;
  selectedOutcome: string | null; // Changed type to string | null
  setSelectedMatch: (game: Game | null, outcome?: string | null) => void; // Changed type to string | null
}

const MatchSelectionContext = createContext<MatchSelectionContextType | undefined>(undefined);

export const MatchSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null); // Changed type to string | null

  const setSelectedMatch = (game: Game | null, outcome: string | null = null) => { // Changed type to string | null
    setSelectedGame(game);
    setSelectedOutcome(outcome);
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