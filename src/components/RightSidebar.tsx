"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import LeicesterCityLogo from '@/assets/images/leicester-city-logo.png'; // Import the image

const RightSidebar = () => {
  const [predictionAmount, setPredictionAmount] = useState(0); // Changed initial amount to 0
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1); // New state for multiplier

  // Dynamically determine available multiplier options based on predictionAmount
  const multiplierOptions = useMemo(() => {
    let options = [1, 2, 3]; // Base options
    if (predictionAmount >= 500) {
      options.push(5);
    }
    if (predictionAmount >= 1000) {
      options.push(10);
    }
    // Ensure unique and sorted options, and cap at 10x
    return Array.from(new Set(options)).sort((a, b) => a - b);
  }, [predictionAmount]);

  // Adjust selectedMultiplier if it's no longer available in the options
  useEffect(() => {
    if (!multiplierOptions.includes(selectedMultiplier)) {
      // If the current selected multiplier is no longer valid,
      // reset to the highest available multiplier that is less than or equal to the previous selection,
      // or to 1x if no such multiplier exists.
      const newValidMultiplier = multiplierOptions.reduce((prev, curr) => {
        if (curr <= selectedMultiplier) {
          return curr;
        }
        return prev;
      }, 1); // Default to 1 if no valid option found
      setSelectedMultiplier(newValidMultiplier);
    }
  }, [multiplierOptions, selectedMultiplier]);

  const handlePredict = () => {
    if (!selectedOutcome) {
      toast.error("Please select an outcome to predict.");
      return;
    }
    if (predictionAmount <= 0) {
      toast.error("Prediction amount must be greater than 0.");
      return;
    }
    toast.success(`Predicted ${predictionAmount} on ${selectedOutcome} with ${selectedMultiplier}x multiplier`);
    // Here you would typically send the prediction to a backend
  };

  const quickAddAmountButtons = [100, 200, 500, 1000];

  // Find the index of the current selectedMultiplier in the dynamic options for the slider
  const currentMultiplierIndex = multiplierOptions.indexOf(selectedMultiplier);
  const sliderValue = currentMultiplierIndex !== -1 ? currentMultiplierIndex : 0; // Default to 1x (index 0) if not found

  const handleMultiplierChange = (value: number[]) => {
    const newIndex = value[0];
    if (newIndex >= 0 && newIndex < multiplierOptions.length) {
      setSelectedMultiplier(multiplierOptions[newIndex]);
    }
  };

  // Calculate potential win
  const potentialWinXP = predictionAmount > 0 ? (predictionAmount * selectedMultiplier) + 100 : 0;

  return (
    <div className="fixed right-4 top-20 bottom-4 w-80 bg-vanta-blue-medium text-vanta-text-light flex flex-col z-40 rounded-[27px] font-outfit p-6">
      {/* Logo and Match Code */}
      <div className="flex items-start mb-6 mt-4">
        <img
          src={LeicesterCityLogo}
          alt="Leicester City Logo"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-vanta-text-light">CRY vs ASV</span>
          <div className="flex items-center mt-1">
            <span className="bg-[#017890] text-[#00EEEE] opacity-70 font-semibold text-xs px-2 py-1 rounded-md">ASV</span>
            <span className="bg-vanta-blue-dark text-vanta-text-dark text-xs px-2 py-1 rounded-md ml-2">Full-Time</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Outcome Selection Buttons */}
        <div className="mb-6 flex gap-2">
          <Button
            className={`flex-1 py-3 text-base font-semibold ${selectedOutcome === 'CRY' ? 'bg-[rgba(0,238,238,0.7)]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
            onClick={() => setSelectedOutcome('CRY')}
          >
            CRY
          </Button>
          <Button
            className={`flex-1 py-3 text-base font-semibold ${selectedOutcome === 'DRAW' ? 'bg-[rgba(0,238,238,0.7)]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
            onClick={() => setSelectedOutcome('DRAW')}
          >
            DRAW
          </Button>
          <Button
            className={`flex-1 py-3 text-base font-semibold ${selectedOutcome === 'ASV' ? 'bg-[rgba(0,238,238,0.7)]' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
            onClick={() => setSelectedOutcome('ASV')}
          >
            ASV
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
                onChange={(e) => setPredictionAmount(Number(e.target.value))}
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

        {/* Multiplier Selection */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Multiplier</h4>
            <span className="text-gray-400 text-2xl font-bold">{selectedMultiplier}x</span>
          </div>
          <Slider
            min={0}
            max={multiplierOptions.length - 1}
            step={1}
            value={[sliderValue]}
            onValueChange={handleMultiplierChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {multiplierOptions.map((option, index) => (
              <span key={option} className={index === sliderValue ? "font-bold text-vanta-text-light" : ""}>
                {option}x
              </span>
            ))}
          </div>
        </div>

        {/* Potential Win Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold">Potential Win</h4>
            <div className="flex items-center bg-vanta-blue-dark rounded-md px-3 py-2">
              <span className="text-vanta-accent-blue text-2xl font-bold">{potentialWinXP} XP</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full py-3 text-lg font-bold bg-vanta-accent-blue hover:bg-vanta-accent-blue-dark mt-auto"
          onClick={handlePredict}
        >
          Predict Now
        </Button>
      </div>
    </div>
  );
};

export default RightSidebar;