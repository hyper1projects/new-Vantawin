"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook
import { useIsMobile } from '../hooks/use-mobile'; // Import useIsMobile
import { useGatekeeper } from '../hooks/useGatekeeper';
import { useNavigate } from 'react-router-dom';
import { placeBet } from '@/services/bettingService';
import TeamLogo from './TeamLogo'; // Import the new TeamLogo component

import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

const RightSidebar = () => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
  const { hasEntry, poolId, vantaBalance, checkEntryStatus } = useGatekeeper();
  const navigate = useNavigate();
  const [predictionAmount, setPredictionAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const isMobile = useIsMobile(); // Check if it's a mobile screen

  if (isMobile) {
    return null;
  }

  useEffect(() => {
    setPredictionAmount('');
  }, [selectedGame]);

  const handlePredict = async () => {
    if (!selectedGame) {
      toast.error("Please select a match to predict.");
      return;
    }
    if (!selectedOutcome) {
      toast.error("Please select an outcome to predict.");
      return;
    }

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

      // Fallback (Legacy) - if strict matching fails (rare)
      if (!questionId) {
        console.warn("Strict match failed for selectedOutcome:", selectedOutcome);
        const parts = selectedOutcome.split('_');
        odds = parseFloat(parts[parts.length - 1]);
        // Best guess implementation
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

      toast.success(`Prediction Placed! New Balance: ${result.new_balance} Vanta`);
      await checkEntryStatus(); // Refresh balance
      setPredictionAmount('');
      setShowSuccess(true);
      // Timeout removed to allow user choice via buttons

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

  const getSelectedOutcomeDisplayText = () => {
    if (!selectedOutcome || !selectedGame) return '';

    const parts = selectedOutcome.split('_');
    if (parts.length >= 3) {
      const choice = parts[parts.length - 2];
      const qId = parts.slice(0, parts.length - 2).join('_');
      return `${qId.replace(/_/g, ' ')}: ${choice}`;
    }
    return selectedOutcome;
  };

  return (
    <div className="h-full w-full bg-vanta-blue-medium text-vanta-text-light flex flex-col z-40 font-outfit p-4">
      {selectedGame ? (
        <>
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center mb-1">
              <TeamLogo
                teamName={selectedGame.team1.name}
                alt={`${selectedGame.team1.name} Logo`}
                className="w-16 h-16 object-contain mr-6"
              />
              <span className="text-base font-bold text-vanta-text-light">{selectedGame.team1.name.substring(0, 3).toUpperCase()} vs {selectedGame.team2.name.substring(0, 3).toUpperCase()}</span>
              <TeamLogo
                teamName={selectedGame.team2.name}
                alt={`${selectedGame.team2.name} Logo`}
                className="w-16 h-16 object-contain ml-6"
              />
            </div>
            <div className="flex items-center">
              <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team1.name.substring(0, 3).toUpperCase()}</span>
              <span className="bg-vanta-blue-dark text-vanta-text-dark text-[0.6rem] px-1.5 py-0.5 rounded-sm mx-1">{selectedGame.isLive ? 'Live' : 'FT'}</span>
              <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team2.name.substring(0, 3).toUpperCase()}</span>
            </div>
          </div>

          {!showSuccess ? (
            <div className="flex flex-col flex-grow">
              <div className="mb-4 text-center">
                <h4 className="text-lg font-semibold text-vanta-neon-blue uppercase">{getSelectedOutcomeDisplayText()}</h4>
                {currentSelectedOdd > 0 && (
                  <span className="text-sm text-gray-400">Odds: {currentSelectedOdd.toFixed(2)}</span>
                )}
              </div>

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
                          if (newValue > 200) {
                            setPredictionAmount(200);
                            toast.info("Maximum bet is 200 Vanta");
                          } else {
                            setPredictionAmount(newValue < 0 ? 0 : newValue);
                          }
                        }
                      }}
                      disabled={isSubmitting}
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

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-semibold">Points Multiplier</h4>
                  <span className="text-vanta-neon-blue text-base font-bold">1.2x</span> {/* Placeholder value */}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-semibold">Potential Win</h4>
                  <span className="text-yellow-400 text-xl font-bold">{potentialWinXP.toFixed(2)} XP</span>
                </div>
              </div>

              <Button
                className="w-full py-3 text-lg font-bold bg-[#00EEEE] hover:bg-[#00CCCC] text-[#081028] rounded-[12px] mt-auto"
                onClick={hasEntry ? handlePredict : () => navigate('/pools')}
                disabled={isSubmitting || typeof predictionAmount !== 'number' || predictionAmount < 50 || predictionAmount > 200}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (hasEntry ? "Predict Now" : "Join Pool")}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow space-y-4">
              <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Prediction Placed!</h3>
              <p className="text-gray-400 text-sm mb-4">Good luck!</p>

              <div className="flex flex-col w-full px-8 gap-3 mt-4">
                <Button
                  className="w-full bg-[#00EEEE] hover:bg-[#00CCCC] text-[#081028] font-bold"
                  onClick={() => {
                    setShowSuccess(false);
                    setSelectedMatch(null, null);
                    navigate('/users');
                  }}
                >
                  View My Games
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[#0B2C63] text-gray-300 hover:text-white hover:bg-[#0B2C63]/50 hover:border-[#0B2C63]"
                  onClick={() => {
                    setShowSuccess(false);
                    setSelectedMatch(null, null);
                  }}
                >
                  Make Another Prediction
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-6">
          <p className="text-lg font-semibold mb-2">No game selected</p>
          <p className="text-sm">Click on any game to start predicting!</p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;