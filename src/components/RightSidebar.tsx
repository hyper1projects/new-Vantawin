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
import { ChevronRight, Loader2, X, Trophy } from 'lucide-react';

const RightSidebar = () => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
  const { hasEntry, poolId, vantaBalance, checkEntryStatus } = useGatekeeper();
  const navigate = useNavigate();
  const [predictionAmount, setPredictionAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile(); // Check if it's a mobile screen

  if (isMobile) {
    return null;
  }

  useEffect(() => {
    if (selectedGame) {
      checkEntryStatus(); // Refresh status when a game is selected to ensure pool info is current
    }
    setPredictionAmount('');
  }, [selectedGame, checkEntryStatus]);

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

  const renderSelectedOutcome = () => {
    if (!selectedOutcome || !selectedGame) return null;

    if (selectedGame.questions) {
      for (const q of selectedGame.questions) {
        if (!q.options) continue;
        for (const o of q.options) {
          const compositeKey = `${q.id}_${o.id}_${o.odds.toFixed(2)}`;
          // Debug logs
          if (compositeKey === selectedOutcome) {
            console.log('Selected Outcome Match Found:', {
              questionType: q.type,
              questionText: q.text,
              optionLabel: o.label,
              team1: selectedGame.team1.name,
              team2: selectedGame.team2.name
            });
          }
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
              teamName = label; // Fallback or Draw
            }

            const isWinMatch = q.type === 'win_match' ||
              (q.text && q.text.toLowerCase().includes('win')) ||
              q.text === 'Full Time Result';

            if (isWinMatch && side) {
              return (
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-[#93B5EF]/20 blur-xl animate-pulse"></div>
                  <div className="relative text-[#93B5EF] text-sm font-medium text-center px-6 py-3 border-2 border-[#93B5EF]/40 rounded-xl bg-gradient-to-br from-[#016F8A]/30 to-[#016F8A]/10 backdrop-blur-sm flex items-center justify-center gap-2 shadow-lg shadow-[#93B5EF]/10">
                    <span className="text-lg">⚽</span>
                    <span className="font-bold">{teamName}</span>
                  </div>
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
        </div>
      );
    }

    return (
      <div className="bg-[#016F8A] rounded-md px-4 py-2 text-[#93B5EF] font-bold text-lg flex items-center justify-center gap-2 shadow-sm border border-[#93B5EF]/20">
        {selectedOutcome.split('_').slice(0, -1).join(' ').replace(/_/g, ' ')}
      </div>
    );
  };

  const isLow = typeof predictionAmount === 'number' && predictionAmount > 0 && predictionAmount < 50;
  const isHigh = typeof predictionAmount === 'number' && predictionAmount > 200;
  const hasError = isLow || isHigh;

  return (
    <div className="h-full w-full bg-vanta-blue-medium text-vanta-text-light flex flex-col z-40 font-outfit p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-vanta-neon-blue rounded-full"></span>
          Vanta Slip
        </h2>
      </div>

      {selectedGame ? (
        <>
          <div className="flex flex-col items-center mb-4 w-full">
            <div className="flex items-center justify-center mb-2 w-full">
              <TeamLogo
                teamName={selectedGame.team1.name}
                alt={`${selectedGame.team1.name} Logo`}
                className="w-12 h-12 object-contain mr-6"
              />
              <span className="text-base font-bold text-vanta-text-light">{selectedGame.team1.name.substring(0, 3).toUpperCase()} vs {selectedGame.team2.name.substring(0, 3).toUpperCase()}</span>
              <TeamLogo
                teamName={selectedGame.team2.name}
                alt={`${selectedGame.team2.name} Logo`}
                className="w-12 h-12 object-contain ml-6"
              />
            </div>
          </div>

          {!showSuccess ? (
            <div className="flex flex-col flex-grow">
              <div className="mb-4 text-center">
                {renderSelectedOutcome()}
              </div>
              {/* Odds display removed */}

              <div className="mb-4">
                <div className="flex flex-col mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-semibold text-vanta-text-light">Amount</h4>
                    <div className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-yellow-500/20 border border-yellow-500/50 rounded-lg shadow-md hover:shadow-lg hover:shadow-yellow-500/20 transition-all">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-md animate-pulse"></div>
                        <img src="/images/vanta-coin.png" alt="Bal" className="relative w-5 h-5 mr-2 object-contain" />
                      </div>
                      <span className="text-sm text-yellow-400 font-bold font-mono">
                        {vantaBalance?.toLocaleString()}
                      </span>
                      <span className="ml-1 text-yellow-400 text-xs">✨</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    {/* Min/Max label removed */}
                  </div>
                  <div className={`flex items-center bg-[#0B1E3D] rounded-lg px-4 py-3 border transition-all duration-300
                    ${isFocused ? 'border-vanta-neon-blue shadow-[0_0_20px_rgba(0,238,238,0.3)] scale-[1.02]' : ''}
                    ${hasError ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-shake' : !isFocused ? 'border-[#1a3a5c]' : ''}`}>
                    <img
                      src="/images/vanta-coin.png"
                      alt="Vanta"
                      className={`w-10 h-10 mr-2 object-contain transition-transform duration-300 ${isFocused ? 'rotate-[360deg] scale-110' : ''}`}
                    />
                    <Input
                      type="number"
                      value={predictionAmount}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
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
                      className="relative overflow-hidden group bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light text-[0.6rem] px-1.5 py-0.5 h-8 flex-1 min-w-[0] transition-all duration-200 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-vanta-neon-blue/30 hover:bg-[#016F8A] hover:border-vanta-neon-blue hover:text-white active:scale-95"
                      onClick={() => setPredictionAmount(prevAmount => {
                        const currentAmount = typeof prevAmount === 'number' ? prevAmount : 0;
                        return currentAmount + amount;
                      })}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-vanta-neon-blue/0 via-vanta-neon-blue/20 to-vanta-neon-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                      <span className="relative">+{amount}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-base font-semibold">Points Multiplier</h4>
                  <span className="text-vanta-neon-blue text-base font-bold">{currentSelectedOdd.toFixed(2)}x</span>
                </div>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-yellow-500/10 via-transparent to-purple-500/10 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    Potential Win
                  </h4>
                  <div className="relative">
                    {potentialWinXP > 0 && (
                      <div className="absolute inset-0 bg-yellow-400/20 blur-lg animate-pulse"></div>
                    )}
                    <span className={`relative text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 ${potentialWinXP > 0 ? 'scale-110' : 'scale-100'}`}>
                      {potentialWinXP.toFixed(2)} XP
                    </span>
                  </div>
                </div>
                {potentialWinXP > 0 && (
                  <div className="mt-2 relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-vanta-neon-blue to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((Number(predictionAmount) / 200) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <Button
                className={`w-full py-3 text-lg font-bold rounded-xl relative overflow-hidden group transition-all duration-300 mt-auto ${!isSubmitting && hasEntry && typeof predictionAmount === 'number' && predictionAmount >= 50 && predictionAmount <= 200
                  ? 'bg-gradient-to-r from-vanta-neon-blue via-cyan-400 to-vanta-neon-blue bg-[length:200%_100%] hover:bg-right-bottom shadow-lg shadow-vanta-neon-blue/50 hover:shadow-xl hover:shadow-vanta-neon-blue/80 hover:scale-[1.02] active:scale-95'
                  : 'bg-gray-600'
                  }`}
                onClick={hasEntry ? handlePredict : () => navigate('/pools')}
                disabled={isSubmitting || (hasEntry && (typeof predictionAmount !== 'number' || predictionAmount < 50 || predictionAmount > 200))}
              >
                {!isSubmitting && hasEntry && typeof predictionAmount === 'number' && predictionAmount >= 50 && predictionAmount <= 200 && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : hasEntry ? (
                    <>
                      <span>Predict Now</span>
                      <span className="text-xl">🎯</span>
                    </>
                  ) : (
                    "Join Pool"
                  )}
                </span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow space-y-4 relative">
              {/* Confetti particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      backgroundColor: ['#00EEEE', '#FFD700', '#FF1493', '#00FF00'][Math.floor(Math.random() * 4)],
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${2 + Math.random()}s`
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce-in">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" className="animate-draw-check" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-vanta-neon-blue to-green-400">Prediction Placed! 🎉</h3>
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
                  className="w-full bg-transparent border-[#0B2C63] text-gray-300 hover:text-vanta-neon-blue hover:bg-[#0B2C63]/50 hover:border-[#0B2C63]"
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
      )
      }
    </div >
  );
};

export default RightSidebar;