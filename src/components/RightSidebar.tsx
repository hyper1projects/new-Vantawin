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
    
    let outcomeText = '';
    if (selectedOutcome === 'team1') outcomeText = selectedGame.team1.name;
    else if (selectedOutcome === 'team2') outcomeText = selectedGame.team2.name;
    else if (selectedOutcome === 'draw') outcomeText = 'Draw';

    toast.success(`Predicted ${predictionAmount} on ${outcomeText} for ${selectedGame.team1.name} vs ${selectedGame.team2.name}`);
    // Here you would typically send the prediction to a backend
  };

  const quickAddAmountButtons = [100, 200, 500, 1000];

  // Calculate potential win (simple example, could be more complex with actual odds)
  const potentialWinXP = predictionAmount > 0 ? predictionAmount : 0;

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-vanta-blue-medium text-vanta-text-light flex flex-col z-40 rounded-[27px] font-outfit p-6">
      {selectedGame ? (
        <>
          {/* Logo and Match Code */}
          <div className="flex items-start mb-6 mt-4">
            <img
              src={getLogoSrc(selectedGame.team1.logoIdentifier)}
              alt={`${selectedGame.team1.name} Logo`}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-vanta-text-light">{selectedGame.team1.name.substring(0,3).toUpperCase()} vs {selectedGame.team2.name.substring(0,3).toUpperCase()}</span>
              <div className="flex items-center mt-1">
                <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-xs px-2 py-1 rounded-md">{selectedGame.team1.name.substring(0,3).toUpperCase()}</span>
                <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md ml-2">{selectedGame.isLive ? 'Live' : 'Full-Time'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-grow">
            {/* Outcome Selection Buttons */}
            <div className="mb-6 flex gap-2">
              <Button
                className={`flex-1 py-3 text-base font-semibold ${selectedOutcome === 'team1' ? 'bg-[#015071]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
                onClick={() => setSelectedMatch(selectedGame, 'team1')}
              >
                {selectedGame.team1.name.substring(0,3).toUpperCase()} ({selectedGame.odds.team1.toFixed(2)})
              </Button>
              <Button
                className={`flex-1 py-3 text-base font-semibold ${selectedOutcome === 'draw' ? 'bg-[#015071]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
                onClick={() => setSelectedMatch(selectedGame, 'draw')}
              >
                DRAW ({selectedGame.odds.draw.toFixed(2)})
              </Button>
              <Button
                className={`flex-1 py-3 text-base font-semibold ${selectedOutcome === 'team2' ? 'bg-[#015071]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
                onClick={() => setSelectedMatch(selectedGame, 'team2')}
              >
                {selectedGame.team2.name.substring(0,3).toUpperCase()} ({selectedGame.odds.team2.toFixed(2)})
              </Button>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Amount</h4>
                <div className="flex items-center bg-vanta-blue-dark rounded-md px-3 py-2">
                  <span className="text-gray-400 text-2xl font-bold mr-1">₦</span>
                  <Input
                    type="number"
                    value={predictionAmount}
                    onChange={(e) => {
                      const newValue = Number(e.target.value);
                      setPredictionAmount(newValue < 0 ? 0 : newValue); // Ensure amount doesn't go below 0
                    }}
                    className="w-24 text-right bg-transparent border-none text-gray-400 text-2xl font-bold p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {quickAddAmountButtons.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light text-xs px-3 py-1 h-auto"
                    onClick={() => setPredictionAmount(prevAmount => prevAmount + amount)}
                  >
                    +{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Potential Win Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Potential Win</h4>
                <span className="text-yellow-400 text-2xl font-bold">{potentialWinXP} XP</span>
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
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
          <p className="text-lg font-semibold mb-2">No match selected</p>
          <p className="text-sm">Click on any odds to start predicting!</p>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;