"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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

import { Loader2, Trophy, XCircle, Clock, X } from 'lucide-react';

interface PredictionBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PredictionBottomSheet: React.FC<PredictionBottomSheetProps> = ({ isOpen, onOpenChange }) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
  const { hasEntry, poolId, vantaBalance, checkEntryStatus } = useGatekeeper();
  const [predictionAmount, setPredictionAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // Reset prediction amount and refresh entry status when drawer opens
  useEffect(() => {
    if (isOpen) {
      checkEntryStatus(); // Refresh status to ensure we know if user joined a pool
    }
    if (!isOpen || !selectedGame) {
      setPredictionAmount('');
    }
  }, [selectedGame, isOpen, checkEntryStatus]);

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
      // Robust parsing by checking against actual game data
      let questionId = '';
      let optionId = '';
      let odds = 0;
      let outcomeLabel = '';

      if (selectedGame && selectedGame.questions) {
        // Iterate through questions and options to find the matching composite ID
        // Composite key format from Oddscard: `${question.id}_${option.id}_${option.odds.toFixed(2)}`
        for (const q of selectedGame.questions) {
          if (!q.options) continue;
          for (const o of q.options) {
            const compositeKey = `${q.id}_${o.id}_${o.odds.toFixed(2)}`;
            if (compositeKey === selectedOutcome) {
              questionId = q.id;
              optionId = o.id;
              odds = o.odds;
              outcomeLabel = o.label;
              break;
            }
          }
          if (questionId) break;
        }
      }

      // Fallback (Legacy)
      if (!questionId) {
        console.warn("Strict match failed for selectedOutcome:", selectedOutcome);
        const parts = selectedOutcome.split('_');
        odds = parseFloat(parts[parts.length - 1]);
        optionId = parts.length > 2 ? parts[parts.length - 2] : parts[1];
        questionId = parts.slice(0, parts.length - 2).join('_');
        outcomeLabel = optionId;
      }

      const result = await placeBet(
        selectedGame.id,
        poolId,
        questionId,
        optionId,
        stake,
        odds,
        selectedGame
      );

      toast.success(`Bet Placed! New Balance: ${result.new_balance} Vanta`);
      await checkEntryStatus(); // Refresh balance
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

  const quickAddAmountButtons = [10, 20, 50, 100];

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

  const isLow = typeof predictionAmount === 'number' && predictionAmount > 0 && predictionAmount < 50;
  const isHigh = typeof predictionAmount === 'number' && predictionAmount > 200;
  const hasError = isLow || isHigh;

  const renderSelectedOutcome = () => {
    if (!selectedOutcome || !selectedGame) return null;

    if (selectedGame.questions) {
      for (const q of selectedGame.questions) {
        if (!q.options) continue;
        for (const o of q.options) {
          const compositeKey = `${q.id}_${o.id}_${o.odds.toFixed(2)}`;
          if (compositeKey === selectedOutcome) {
            let label = o.label;
            let side = '';
            let teamName = '';

            if (label === 'Home' || label === '1' || o.id === 'home' || o.id === 'team1') {
              teamName = selectedGame.team1.name;
              side = 'Home';
            } else if (label === 'Away' || label === '2' || o.id === 'away' || o.id === 'team2') {
              teamName = selectedGame.team2.name;
              side = 'Away';
            } else {
              teamName = label;
            }

            const isWinMatch = q.type === 'win_match' ||
              (q.text && q.text.toLowerCase().includes('win')) ||
              q.text === 'Full Time Result';

            if (isWinMatch && side) {
              return (
                <div className="text-[#93B5EF] text-sm font-medium text-center px-4 py-2 border border-[#93B5EF]/20 rounded-md bg-[#016F8A]/20 flex items-center justify-center gap-2">
                  <span>{teamName}</span>
                  <span className="text-xs opacity-80 uppercase tracking-wider">[{side}]</span>
                </div>
              );
            } else {
              return (
                <div className="text-[#93B5EF] text-sm font-medium text-center px-4 py-2 border border-[#93B5EF]/20 rounded-md bg-[#016F8A]/20">
                  {(q.text || q.type)}: {label}
                </div>
              );
            }
          }
        }
      }
    }

    // Fallback
    // Fallback: Parse manually and force style
    console.warn("Falling back to manual parse for:", selectedOutcome);

    let sideGuess = '';
    let teamNameGuess = '';

    // Attempt to parse side from string if loop failed
    const lower = selectedOutcome.toLowerCase();
    if (lower.includes('home') || lower.includes('team1') || lower.includes('_1_')) {
      sideGuess = 'HOME';
      teamNameGuess = selectedGame?.team1?.name || 'Home';
    } else if (lower.includes('away') || lower.includes('team2') || lower.includes('_2_')) {
      sideGuess = 'AWAY';
      teamNameGuess = selectedGame?.team2?.name || 'Away';
    }

    if (sideGuess && (lower.includes('win') || lower.includes('match') || selectedGame)) {
      return (
        <div className="bg-[#016F8A] rounded-md px-4 py-2 text-[#93B5EF] font-bold text-lg flex items-center justify-center gap-2 shadow-sm border border-[#93B5EF]/20">
          <span>{teamNameGuess}</span>
          <span className="text-sm opacity-80 uppercase tracking-wider">[{sideGuess}]</span>
        </div>
      );
    }

    return (
      <div className="bg-[#016F8A] rounded-md px-4 py-2 text-[#93B5EF] font-bold text-lg flex items-center justify-center gap-2 shadow-sm border border-[#93B5EF]/20">
        {selectedOutcome.split('_').slice(0, -1).join(' ').replace(/_/g, ' ')}
      </div>
    );
  };

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
            <div className="flex flex-col items-center justify-center p-10 space-y-4 h-auto min-h-[16rem]">
              <div className="h-20 w-20 bg-vanta-neon-green/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-vanta-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-vanta-neon-blue">Prediction Placed!</h3>
              <p className="text-gray-400 text-sm mb-4">Good luck!</p>

              <div className="flex flex-col w-full px-4 gap-3 mt-2">
                <Button
                  className="w-full bg-[#00EEEE] hover:bg-[#00CCCC] text-[#081028] font-bold"
                  onClick={() => {
                    setShowSuccess(false);
                    setSelectedMatch(null, null);
                    onOpenChange(false);
                    navigate('/users');
                  }}
                >
                  View My Games
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[#0B2C63] text-gray-300 hover:text-vanta-neon-blue hover:bg-[#0B2C63]/50 hover:border-[#0B2C63]"
                  onClick={() => {
                    setShowSuccess(false);
                    setSelectedMatch(null, null);
                    onOpenChange(false);
                  }}
                >
                  Make Another Prediction
                </Button>
              </div>
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
                {renderSelectedOutcome()}
              </div>

              {/* Amount Selection */}
              <div className="mb-4">
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-vanta-text-light">Amount</h4>
                    <div className="flex items-center px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-md shadow-sm">
                      <img src="/images/vanta-coin.png" alt="Bal" className="w-4 h-4 mr-1.5 object-contain" />
                      <span className="text-xs text-yellow-500 font-bold font-mono">
                        {vantaBalance?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    {/* Min/Max label removed */}
                  </div>
                  <div className={`flex items-center bg-[#0B1E3D] rounded-lg px-4 py-3 border transition-colors ${hasError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-[#1a3a5c]'}`}>
                    <img src="/images/vanta-coin.png" alt="Vanta" className="w-10 h-10 mr-2 object-contain" />
                    <Input
                      type="number"
                      value={predictionAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setPredictionAmount('');
                        } else {
                          const newValue = Number(value);
                          setPredictionAmount(newValue);
                        }
                      }}
                      disabled={isSubmitting}
                      className="flex-1 text-right bg-transparent border-none text-[#00EEEE] text-2xl font-bold p-0 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="50-200"
                    />
                    {predictionAmount !== '' && (
                      <button onClick={() => setPredictionAmount('')} className="ml-2 text-gray-500 hover:text-white transition-colors">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {hasError && (
                    <div className="text-red-500 text-xs mt-1 font-medium">
                      {isLow ? "This amount is too low" : "This amount is too high"}
                    </div>
                  )}
                </div>
                <div className="flex gap-1 justify-end">
                  {quickAddAmountButtons.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light text-[0.6rem] px-1.5 py-0.5 h-8 flex-1 min-w-[0] hover:bg-[#016F8A] hover:border-[#016F8A] hover:text-white"
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
                <span className="text-vanta-neon-blue text-base font-bold">{currentSelectedOdd.toFixed(2)}x</span>
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
                  disabled={isSubmitting || (hasEntry && (typeof predictionAmount !== 'number' || predictionAmount < 50 || predictionAmount > 200))}
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