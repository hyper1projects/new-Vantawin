import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types/game';
import { useGatekeeper } from '../hooks/useGatekeeper';
import TierSelectionModal from '../components/TierSelectionModal';
// BetSlip import removed

interface MatchSelectionContextType {
  selectedGame: Game | null;
  selectedOutcome: string | null;
  setSelectedMatch: (game: Game | null, outcome?: string | null) => void;
}

const MatchSelectionContext = createContext<MatchSelectionContextType | undefined>(undefined);

export const MatchSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  // No longer needed here if Sidebar handles it, but keeping for compatibility if referenced elsewhere
  const { user } = useGatekeeper(); // Just ensuring hook usage is valid if needed, or remove.

  const setSelectedMatch = async (game: Game | null, outcome: string | null = null) => {
    // If clearing selection (game is null), allow it
    if (!game) {
      setSelectedGame(null);
      setSelectedOutcome(null);
      return;
    }

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