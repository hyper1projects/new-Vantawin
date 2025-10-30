"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getLogoSrc } from '../utils/logoMap'; // Import getLogoSrc
import { useMatchSelection } from '../context/MatchSelectionContext'; // Import the context hook

const RightSidebar = () => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
  const [predictionAmount, setPredictionAmount] = useState(0);

  // Reset prediction amount when a new game is selected
  useEffect(() => {
    setPredictionAmount(0);
  }, [selectedGame]);

  const handlePredict = () => {
    if (!selectedGame) {
      toast.error("Please select a match to predict.");
      return;
    }
    if (!selectedOutcome) {
      toast.error("Please select an outcome to predict.");
      return;
    }
    if (predictionAmount <= 0) {
      toast.error("Prediction amount must be greater than 0.");
      return;
    }
    
    let outcomeDisplay = '';
    let selectedOdd = 0;

    // Parse the selectedOutcome string
    if (selectedOutcome) {
      const parts = selectedOutcome.split('_');
      if (parts.length === 3) { // Format: questionId_choice_oddValue (e.g., 'over_2_5_goals_yes_1.85')
        const questionId = parts[0];
        const choice = parts[1];
        selectedOdd = parseFloat(parts[2]);

        // Map questionId to a more readable text
        let questionText = '';
        switch (questionId) {
          case 'team1':
            questionText = selectedGame.team1.name;
            break;
          case 'draw':
            questionText = 'Draw';
            break;
          case 'team2':
            questionText = selectedGame.team2.name;
            break;
          case 'over_2_5_goals':
            questionText = 'Over 2.5 Goals';
            break;
          case 'btts':
            questionText = 'Both Teams To Score';
            break;
          case 'total_goals_even':
            questionText = 'Total Goals Even';
            break;
          default:
            questionText = questionId;
        }
        outcomeDisplay = `${questionText}: ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;
      } else if (parts.length === 1) { // Old format: 'team1', 'draw', 'team2'
        if (selectedOutcome === 'team1') outcomeDisplay = selectedGame.team1.name;
        else if (selectedOutcome === 'team2') outcomeDisplay = selectedGame.team2.name;
        else if (selectedOutcome === 'draw') outcomeDisplay = 'Draw';
        
        // Get the odd for the old format
        if (selectedOutcome === 'team1') selectedOdd = selectedGame.odds.team1;
        else if (selectedOutcome === 'draw') selectedOdd = selectedGame.odds.draw;
        else if (selectedOutcome === 'team2') selectedOdd = selectedGame.odds.team2;
      }
    }

    toast.success(`Predicted ${predictionAmount} on ${outcomeDisplay} for ${selectedGame.team1.name} vs ${selectedGame.team2.name}`);
    // Here you would typically send the prediction to a backend
  };

  const quickAddAmountButtons = [100, 200, 500, 1000];

  // Calculate potential win (simple example, could be more complex with actual odds)
  let currentSelectedOdd = 0;
  if (selectedOutcome) {
    const parts = selectedOutcome.split('_');
    if (parts.length === 3) {
      currentSelectedOdd = parseFloat(parts[2]);
    } else if (parts.length === 1 && selectedGame) {
      if (selectedOutcome === 'team1') currentSelectedOdd = selectedGame.odds.team1;
      else if (selectedOutcome === 'draw') currentSelectedOdd = selectedGame.odds.draw;
      else if (selectedOutcome === 'team2') currentSelectedOdd = selectedGame.odds.team2;
    }
  }
  const potentialWinXP = predictionAmount > 0 ? (predictionAmount * currentSelectedOdd) : 0;


  // Helper to determine if a specific outcome is selected for a given question type
  const isOutcomeSelected = (questionId: string, choice: 'yes' | 'no', oddValue: number) => {
    return selectedGame?.id === game.id && selectedOutcome === `${questionId}_${choice}_${oddValue.toFixed(2)}`;
  };

  // Helper to get the display text for the selected outcome in the sidebar
  const getSelectedOutcomeDisplayText = () => {
    if (!selectedOutcome || !selectedGame) return '';

    const parts = selectedOutcome.split('_');
    if (parts.length === 3) {
      const questionId = parts[0];
      const choice = parts[1];
      let questionText = '';
      switch (questionId) {
        case 'over_2_5_goals':
          questionText = 'Over 2.5 Goals';
          break;
        case 'btts':
          questionText = 'Both Teams To Score';
          break;
        case 'total_goals_even':
          questionText = 'Total Goals Even';
          break;
        default:
          questionText = questionId; // Fallback
      }
      return `${questionText}: ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;
    } else if (parts.length === 1) {
      if (selectedOutcome === 'team1') return selectedGame.team1.name;
      if (selectedOutcome === 'draw') return 'Draw';
      if (selectedOutcome === 'team2') return selectedGame.team2.name;
    }
    return '';
  };

  return (
    <div className="h-full w-full bg-vanta-blue-medium text-vanta-text-light flex flex-col z-40 font-outfit p-4">
      {selectedGame ? (
        <>
          {/* Logo and Match Code */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center mb-1">
              <img
                src={getLogoSrc(selectedGame.team1.logoIdentifier)}
                alt={`${selectedGame.team1.name} Logo`}
                className="w-10 h-10  object-cover mr-5"
              />
              <span className="text-xs font-bold text-vanta-text-light">{selectedGame.team1.name.substring(0,2).toUpperCase()} vs {selectedGame.team2.name.substring(0,2).toUpperCase()}</span>
              <img
                src={getLogoSrc(selectedGame.team2.logoIdentifier)}
                alt={`${selectedGame.team2.name} Logo`}
                className="w-10 h-10  object-cover ml-5"
              />
            </div>
            <div className="flex items-center">
              <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team1.name.substring(0,2).toUpperCase()}</span>
              <span className="bg-vanta-blue-dark text-vanta-text-dark text-[0.6rem] px-1.5 py-0.5 rounded-sm mx-1">{selectedGame.isLive ? 'Live' : 'FT'}</span>
              <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team2.name.substring(0,2).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex flex-col flex-grow">
            {/* Selected Outcome Display */}
            <div className="mb-4 text-center">
              <h4 className="text-lg font-semibold text-vanta-neon-blue">{getSelectedOutcomeDisplayText()}</h4>
              {currentSelectedOdd > 0 && (
                <span className="text-sm text-gray-400">Odds: {currentSelectedOdd.toFixed(2)}</span>
              )}
            </div>

            {/* Amount Selection */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold">Amount</h4>
                <div className="flex items-center bg-vanta-blue-dark rounded-md px-2 py-1">
                  <span className="text-gray-400 text-lg font-bold mr-1">₦</span>
                  <Input
                    type="number"
                    value={predictionAmount}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setPredictionAmount(newValue < 0 ? 0 : newValue); // Ensure amount doesn't go below 0
                    }}
                    className="w-16 text-right bg-transparent border-none text-gray-400 text-lg font-bold p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <div className="flex gap-1 justify-end">
                {quickAddAmountButtons.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light text-[0.6rem] px-1.5 py-0.5 h-8 flex-1 min-w-[0]"
                    onClick={() => setPredictionAmount(prevAmount => prevAmount + amount)}
                  >
                    +{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Potential Win Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-base font-semibold">Potential Win</h4>
                <span className="text-yellow-400 text-xl font-bold">{potentialWinXP.toFixed(2)} XP</span>
              </div>
            </div>

            <Button
              className="w-full py-3 text-lg font-bold bg-[#00EEEE] hover:bg-[#00CCCC] text-[#081028] rounded-[12px] mt-auto"
              onClick={handlePredict}
            >
              Predict Now
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-6">
          <p className="text-lg font-semibold mb-2">No match selected</p>
          <p className="text-sm">Click on any odds to start predicting!</p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;