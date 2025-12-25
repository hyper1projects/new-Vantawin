"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { useIsMobile } from '../hooks/use-mobile'; // Import the useIsMobile hook
import { useGatekeeper } from '../hooks/useGatekeeper';
import { placeBet } from '@/services/bettingService';
import TeamLogo from './TeamLogo'; // Import the new TeamLogo component
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'; // Using shadcn/ui drawer

import { Loader2 } from 'lucide-react';

interface PredictionBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PredictionBottomSheet: React.FC<PredictionBottomSheetProps> = ({ isOpen, onOpenChange }) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
  const { hasEntry, poolId, vantaBalance } = useGatekeeper();
  const [predictionAmount, setPredictionAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset prediction amount when a new game is selected or drawer opens/closes
  useEffect(() => {
    if (!isOpen || !selectedGame) {
      setPredictionAmount('');
    }
  }, [selectedGame, isOpen]);

  const handlePredict = async () => {
    if (!selectedGame) {
      toast.error("Please select a match to predict.");
      return;
    }
    if (!selectedOutcome) {
      toast.error("Please select an outcome to predict.");
      return;
    }

    // Validation
    const stake = Number(predictionAmount);
    if (stake < 50 || stake > 200) {
      toast.error("Stake must be 50-200 Vanta");
      return;
    }

    if (!poolId) {
      toast.error("No active pool found. Please join a pool.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parsing logic from BetSlip
      const parts = selectedOutcome.split('_');
      // Format assumption: questionId_optionId_odds
      // BetSlip used parts[1] as outcomeId. 
      // If selectedOutcome is "q_opt_odds", then parts[1] is optionId.
      const outcomeId = parts[1];
      const odds = parseFloat(parts[2]);

      const outcomeLabel = outcomeId.includes('home') ? selectedGame.team1.name : (outcomeId.includes('away') ? selectedGame.team2.name : outcomeId);

      const result = await placeBet(
        selectedGame.id,
        poolId,
        outcomeLabel,
        stake,
        odds,
        selectedGame
      );

      toast.success(`Bet Placed! New Balance: ${result.new_balance} Vanta`);
      setPredictionAmount('');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedMatch(null, null);
        onOpenChange(false);
      }, 2000);

    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAddAmountButtons = [100, 200, 500, 1000];

  let currentSelectedOdd = 0;
  if (selectedOutcome) {
    const parts = selectedOutcome.split('_');
    if (parts.length >= 3) {
      currentSelectedOdd = parseFloat(parts[parts.length - 1]);
    } else if (parts.length === 1 && selectedGame) {
      const winMatchQuestion = selectedGame.questions.find(q => q.type === 'win_match');
      if (winMatchQuestion && (winMatchQuestion as any).odds) {
        const odds = (winMatchQuestion as any).odds;
        if (selectedOutcome === 'team1') currentSelectedOdd = odds.team1 || 0;
        else if (selectedOutcome === 'draw') currentSelectedOdd = odds.draw || 0;
        else if (selectedOutcome === 'team2') currentSelectedOdd = odds.team2 || 0;
      }
    }
  }
  const potentialWinXP = (typeof predictionAmount === 'number' && predictionAmount > 0) ? (predictionAmount * currentSelectedOdd) : 0;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-vanta-blue-medium text-vanta-text-light border-t border-gray-700 rounded-t-[27px] h-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="text-center pt-4 pb-2">
          <DrawerTitle className="text-2xl font-bold text-vanta-neon-blue">Make Your Prediction</DrawerTitle>
          <DrawerDescription className="text-gray-400 text-sm">
            {selectedGame ? `${selectedGame.team1.name} vs ${selectedGame.team2.name}` : 'Select a game and outcome'}
          </DrawerDescription>
        </DrawerHeader>

        {selectedGame ? (
          showSuccess ? (
            <div className="flex flex-col items-center justify-center p-10 space-y-4 h-64">
              <div className="h-20 w-20 bg-vanta-neon-green/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-vanta-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Bet Placed!</h3>
              <p className="text-gray-400 text-sm">Good luck!</p>
            </div>
          ) : (
            <div className="flex flex-col flex-grow p-4 overflow-y-auto">
              {/* Logo and Match Code */}
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center mb-1">
                  <TeamLogo
                    teamName={selectedGame.team1.name}
                    alt={`${selectedGame.team1.name} Logo`}
                    className="w-12 h-12 object-contain mr-4"
                  />
                  <span className="text-base font-bold text-vanta-text-light">{selectedGame.team1.name.substring(0, 3).toUpperCase()} vs {selectedGame.team2.name.substring(0, 3).toUpperCase()}</span>
                  <TeamLogo
                    teamName={selectedGame.team2.name}
                    alt={`${selectedGame.team2.name} Logo`}
                    className="w-12 h-12 object-contain ml-4"
                  />
                </div>
                <div className="flex items-center">
                  <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team1.name.substring(0, 3).toUpperCase()}</span>
                  <span className="bg-vanta-blue-dark text-vanta-text-dark text-[0.6rem] px-1.5 py-0.5 rounded-sm mx-1">{selectedGame.isLive ? 'Live' : 'FT'}</span>
                  <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team2.name.substring(0, 3).toUpperCase()}</span>
                </div>
              </div>

              {/* Selected Outcome Display */}
              <div className="mb-4 text-center">
                {currentSelectedOdd > 0 && (
                  <span className="text-sm text-gray-400">Odds: {currentSelectedOdd.toFixed(2)}</span>
                )}
              </div>

              {/* Amount Selection */}
              <div className="mb-4">
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-white">Amount</h4>
                    <span className="text-xs text-vanta-neon-blue font-mono">
                      Bal: {vantaBalance?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#00EEEE]">Min: 50 | Max: 200</span>
                    <button
                      onClick={() => setPredictionAmount('')}
                      className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center bg-[#0B1E3D] rounded-lg px-4 py-3 border border-[#1a3a5c]">
                    <span className="text-[#00EEEE] text-2xl font-bold mr-2">₦</span>
                    <Input
                      type="number"
                      value={predictionAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setPredictionAmount('');
                        } else {
                          const newValue = Number(value);
                          setPredictionAmount(newValue < 0 ? 0 : newValue);
                        }
                      }}
                      className="flex-1 text-right bg-transparent border-none text-[#00EEEE] text-2xl font-bold p-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-1 justify-end">
                  {quickAddAmountButtons.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light text-[0.6rem] px-1.5 py-0.5 h-8 flex-1 min-w-[0]"
                      onClick={() => setPredictionAmount(prevAmount => {
                        const currentAmount = typeof prevAmount === 'number' ? prevAmount : 0;
                        return currentAmount + amount;
                      })}
                    >
                      +{amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Points Multiplier Section */}
              <div className="mb-3 flex justify-between items-center">
                <h4 className="text-base font-semibold">Points Multiplier</h4>
                <span className="text-vanta-neon-blue text-base font-bold">1.2x</span> {/* Placeholder value */}
              </div>

              {/* Potential Win Section */}
              <div className="mb-6 flex justify-between items-center">
                <h4 className="text-base font-semibold">Potential Win</h4>
                <span className="text-yellow-400 text-xl font-bold">{potentialWinXP.toFixed(2)} XP</span>
              </div>

              <DrawerFooter className="p-0 mt-auto">
                <Button
                  className="w-full py-3 text-lg font-bold bg-[#00EEEE] hover:bg-[#00CCCC] text-[#081028] rounded-[12px]"
                  onClick={hasEntry ? handlePredict : () => {
                    window.location.href = '/pools';
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (hasEntry ? "Predict Now" : "Join Pool")}
                </Button>
              </DrawerFooter>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400 p-6">
            <p className="text-lg font-semibold mb-2">No game selected</p>
            <p className="text-sm">Click on any game to start predicting!</p>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default PredictionBottomSheet;