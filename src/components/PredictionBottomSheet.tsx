"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { getLogoSrc } from '../utils/logoMap';
import { useMatchSelection } from '../context/MatchSelectionContext';
import { useIsMobile } from '../hooks/use-mobile'; // Import the useIsMobile hook
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'; // Using shadcn/ui drawer

interface PredictionBottomSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const PredictionBottomSheet: React.FC<PredictionBottomSheetProps> = ({ isOpen, onOpenChange }) => {
  const { selectedGame, selectedOutcome, setSelectedMatch } = useMatchSelection();
  const [predictionAmount, setPredictionAmount] = useState<number | ''>('');

  // Reset prediction amount when a new game is selected or drawer opens/closes
  useEffect(() => {
    if (!isOpen || !selectedGame) {
      setPredictionAmount('');
    }
  }, [selectedGame, isOpen]);

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

    if (selectedOutcome) {
      const parts = selectedOutcome.split('_');
      if (parts.length === 3) {
        const questionId = parts[0];
        const choice = parts[1];
        selectedOdd = parseFloat(parts[2]);

        let questionText = '';
        switch (questionId) {
          case 'full_time_result':
            if (choice === 'team1') questionText = selectedGame.team1.name;
            else if (choice === 'draw') questionText = 'Draw';
            else if (choice === 'team2') questionText = selectedGame.team2.name;
            break;
          case 'over_1_5_goals_q': questionText = 'Over 1.5 Goals'; break;
          case 'over_2_5_goals_q': questionText = 'Over 2.5 Goals'; break;
          case 'over_3_5_goals_q': questionText = 'Over 3.5 Goals'; break;
          case 'btts_q': questionText = 'Both Teams To Score'; break;
          case 'total_goals_even_q': questionText = 'Total Goals Even'; break;
          case 'is_draw_q_1':
          case 'is_draw_q_2':
          case 'is_draw_q_3':
          case 'is_draw_q_4':
          case 'is_draw_q_5':
            questionText = 'Game will be a Draw';
            break;
          case 'score_goals_man_utd': questionText = `Man Utd score > 2 goals`; break;
          case 'score_goals_real_madrid': questionText = `Real Madrid score > 2 goals`; break;
          default: questionText = questionId;
        }
        outcomeDisplay = `${questionText}: ${choice.charAt(0).toUpperCase() + choice.slice(1)}`;
      } else if (parts.length === 1) {
        if (selectedOutcome === 'team1') outcomeDisplay = selectedGame.team1.name;
        else if (selectedOutcome === 'team2') outcomeDisplay = selectedGame.team2.name;
        else if (selectedOutcome === 'draw') outcomeDisplay = 'Draw';
        
        if (selectedOutcome === 'team1') selectedOdd = selectedGame.questions.find(q => q.type === 'win_match')?.odds.team1 || 0;
        else if (selectedOutcome === 'draw') selectedOdd = selectedGame.questions.find(q => q.type === 'win_match')?.odds.draw || 0;
        else if (selectedOutcome === 'team2') selectedOdd = selectedGame.questions.find(q => q.type === 'win_match')?.odds.team2 || 0;
      }
    }

    toast.success(`Predicted ${predictionAmount} on ${outcomeDisplay} for ${selectedGame.team1.name} vs ${selectedGame.team2.name}`);
    onOpenChange(false); // Close the drawer after prediction
    setSelectedMatch(null, null); // Clear selected match
  };

  const quickAddAmountButtons = [100, 200, 500, 1000];

  let currentSelectedOdd = 0;
  if (selectedOutcome) {
    const parts = selectedOutcome.split('_');
    if (parts.length === 3) {
      currentSelectedOdd = parseFloat(parts[2]);
    } else if (parts.length === 1 && selectedGame) {
      const winMatchQuestion = selectedGame.questions.find(q => q.type === 'win_match');
      if (winMatchQuestion && winMatchQuestion.odds) {
        if (selectedOutcome === 'team1') currentSelectedOdd = winMatchQuestion.odds.team1 || 0;
        else if (selectedOutcome === 'draw') currentSelectedOdd = winMatchQuestion.odds.draw || 0;
        else if (selectedOutcome === 'team2') currentSelectedOdd = winMatchQuestion.odds.team2 || 0;
      }
    }
  }
  const potentialWinXP = (typeof predictionAmount === 'number' && predictionAmount > 0) ? (predictionAmount * currentSelectedOdd) : 0;

  const getSelectedOutcomeDisplayText = () => {
    if (!selectedOutcome || !selectedGame) return '';

    const parts = selectedOutcome.split('_');
    if (parts.length === 3) {
      const questionId = parts[0];
      const choice = parts[1];
      let questionText = '';
      switch (questionId) {
        case 'full_time_result':
          if (choice === 'team1') return selectedGame.team1.name;
          if (choice === 'draw') return 'Draw';
          if (choice === 'team2') return selectedGame.team2.name;
          break;
        case 'over_1_5_goals_q': questionText = 'Over 1.5 Goals'; break;
        case 'over_2_5_goals_q': questionText = 'Over 2.5 Goals'; break;
        case 'over_3_5_goals_q': questionText = 'Over 3.5 Goals'; break;
        case 'btts_q': questionText = 'Both Teams To Score'; break;
        case 'total_goals_even_q': questionText = 'Total Goals Even'; break;
        case 'is_draw_q_1':
        case 'is_draw_q_2':
        case 'is_draw_q_3':
        case 'is_draw_q_4':
        case 'is_draw_q_5':
          questionText = 'Game will be a Draw';
          break;
        case 'score_goals_man_utd': questionText = `Man Utd score > 2 goals`; break;
        case 'score_goals_real_madrid': questionText = `Real Madrid score > 2 goals`; break;
        default: questionText = questionId;
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
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-vanta-blue-medium text-vanta-text-light border-t border-gray-700 rounded-t-[27px] h-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="text-center pt-4 pb-2">
          <DrawerTitle className="text-2xl font-bold text-vanta-neon-blue">Make Your Prediction</DrawerTitle>
          <DrawerDescription className="text-gray-400 text-sm">
            {selectedGame ? `${selectedGame.team1.name} vs ${selectedGame.team2.name}` : 'Select a game and outcome'}
          </DrawerDescription>
        </DrawerHeader>
        
        {selectedGame ? (
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            {/* Logo and Match Code */}
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center mb-1">
                <img
                  src={getLogoSrc(selectedGame.team1.logoIdentifier)}
                  alt={`${selectedGame.team1.name} Logo`}
                  className="w-12 h-12 object-contain mr-4"
                />
                <span className="text-base font-bold text-vanta-text-light">{selectedGame.team1.name.substring(0,2).toUpperCase()} vs {selectedGame.team2.name.substring(0,2).toUpperCase()}</span>
                <img
                  src={getLogoSrc(selectedGame.team2.logoIdentifier)}
                  alt={`${selectedGame.team2.name} Logo`}
                  className="w-12 h-12 object-contain ml-4"
                />
              </div>
              <div className="flex items-center">
                <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team1.name.substring(0,2).toUpperCase()}</span>
                <span className="bg-vanta-blue-dark text-vanta-text-dark text-[0.6rem] px-1.5 py-0.5 rounded-sm mx-1">{selectedGame.isLive ? 'Live' : 'FT'}</span>
                <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-[0.6rem] px-1.5 py-0.5 rounded-sm">{selectedGame.team2.name.substring(0,2).toUpperCase()}</span>
              </div>
            </div>

            {/* Selected Outcome Display */}
            <div className="mb-4 text-center">
              <h4 className="text-lg font-semibold text-vanta-neon-blue">{getSelectedOutcomeDisplayText()}</h4>
              {currentSelectedOdd > 0 && (
                <span className="text-sm text-gray-400">Odds: {currentSelectedOdd.toFixed(2)}</span>
              )}
            </div>

            {/* Amount Selection */}
            <div className="mb-4">
              <div className="flex flex-col mb-2">
                <h4 className="text-sm font-semibold text-white mb-1">Amount</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#00EEEE]">Enter an amount</span>
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
                onClick={handlePredict}
              >
                Predict Now
              </Button>
            </DrawerFooter>
          </div>
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