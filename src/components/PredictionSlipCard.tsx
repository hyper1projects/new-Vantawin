"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { showSuccess, showError } from "@/utils/toast"; // Import from your existing toast utility

const PredictionSlipCard = () => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [potentialWin, setPotentialWin] = useState(0);
  const [multiplier, setMultiplier] = useState(2.0); // Default multiplier

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setSelectedAmount(value);
      calculatePotentialWin(value, multiplier);
    } else if (e.target.value === "") {
      setSelectedAmount(0);
      calculatePotentialWin(0, multiplier);
    }
  };

  const handleQuickAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    calculatePotentialWin(amount, multiplier);
  };

  const handleMultiplierChange = (value: number[]) => {
    const newMultiplier = value[0];
    setMultiplier(newMultiplier);
    calculatePotentialWin(selectedAmount, newMultiplier);
  };

  const calculatePotentialWin = (amount: number, currentMultiplier: number) => {
    setPotentialWin(amount * currentMultiplier);
  };

  const handlePlaceBet = () => {
    if (selectedAmount <= 0) {
      showError("Please enter a valid bet amount."); // Using showError from utility
      return;
    }
    showSuccess( // Using showSuccess from utility
      `Bet placed: ₦${selectedAmount} at ${multiplier.toFixed(
        2
      )}x multiplier. Potential win: ₦${potentialWin.toFixed(2)}`
    );
    // Here you would typically send the bet to a backend service
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Prediction Slip</h2>

      <div className="mb-4">
        <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Bet Amount
        </label>
        <div className="flex items-center border rounded-md overflow-hidden">
          <span className="px-3 text-gray-500">₦</span>
          <Input
            id="betAmount"
            type="number"
            value={selectedAmount}
            onChange={handleAmountChange}
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter amount"
            min="0"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">Quick Amounts</p>
        {/* Quick Amount Buttons - now beneath the amount */}
        <div className="flex gap-2 justify-start">
          {[100, 200, 500].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAmountClick(amount)}
              className="text-xs px-2 py-1"
            >
              ₦{amount}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="multiplier" className="block text-sm font-medium text-gray-700 mb-1">
          Multiplier: {multiplier.toFixed(2)}x
        </label>
        <Slider
          id="multiplier"
          min={1.0}
          max={10.0}
          step={0.1}
          value={[multiplier]}
          onValueChange={handleMultiplierChange}
          className="w-full"
        />
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <p className="text-sm font-medium text-gray-700">Potential Win</p>
        <p className="text-xl font-bold text-green-600">₦{potentialWin.toFixed(2)}</p>
      </div>

      <Button onClick={handlePlaceBet} className="w-full">
        Place Bet
      </Button>
    </div>
  );
};

export default PredictionSlipCard;