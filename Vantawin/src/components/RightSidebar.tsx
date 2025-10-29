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
            {/* Outcome Selection Buttons */}
            <div className="mb-4">
              <div className="flex gap-1">
                <Button
                  className={`flex-1 py-2 text-xs font-semibold ${selectedOutcome === 'team1' ? 'bg-[#015071]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
                  onClick={() => setSelectedMatch(selectedGame, 'team1')}
                >
                  {selectedGame.team1.name.substring(0,3).toUpperCase()}<br/>({selectedGame.odds.team1.toFixed(2)})
                </Button>
                <Button
                  className={`flex-1 py-2 text-xs font-semibold ${selectedOutcome === 'draw' ? 'bg-[#015071]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
                  onClick={() => setSelectedMatch(selectedGame, 'draw')}
                >
                  DRAW<br/>({selectedGame.odds.draw.toFixed(2)})
                </Button>
                <Button
                  className={`flex-1 py-2 text-xs font-semibold ${selectedOutcome === 'team2' ? 'bg-[#015071]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
                  onClick={() => setSelectedMatch(selectedGame, 'team2')}
                >
                  {selectedGame.team2.name.substring(0,3).toUpperCase()}<br/>({selectedGame.odds.team2.toFixed(2)})
                </Button>
              </div>
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
                <span className="text-yellow-400 text-xl font-bold">{potentialWinXP} XP</span>
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