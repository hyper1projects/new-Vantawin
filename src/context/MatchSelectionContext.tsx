import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Game } from '../types/game';
import { useGatekeeper } from '../hooks/useGatekeeper';
import TierSelectionModal from '../components/TierSelectionModal';
import BetSlip from '../components/BetSlip';
import { useAuth } from './AuthContext';

interface MatchSelectionContextType {
  selectedGame: Game | null;
  selectedOutcome: string | null;
  setSelectedMatch: (game: Game | null, outcome?: string | null) => void;
}

const MatchSelectionContext = createContext<MatchSelectionContextType | undefined>(undefined);

export const MatchSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useAuth();
  const { hasEntry, isLoading, checkEntryStatus } = useGatekeeper();

  const setSelectedMatch = async (game: Game | null, outcome: string | null = null) => {
    // If clearing selection (game is null), allow it
    if (!game) {
      setSelectedGame(null);
      setSelectedOutcome(null);
      return;
    }

    // If selecting a bet, check gatekeeper
    // Verify status freshness if needed, or rely on hook state
    if (!hasEntry && !isLoading) {
      setIsModalOpen(true);
      return;
    }

    setSelectedGame(game);
    setSelectedOutcome(outcome);
  };

  return (
    <MatchSelectionContext.Provider value={{ selectedGame, selectedOutcome, setSelectedMatch }}>
      {children}
      <TierSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user?.id}
      />
      <BetSlip
        isOpen={!!selectedGame && !!selectedOutcome}
        onClose={() => { setSelectedGame(null); setSelectedOutcome(null); }}
        match={selectedGame}
        selectedOutcomeId={selectedOutcome}
        activePoolId="demo-pool-id" // TODO: Connect to real pool context
      />
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