"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const RightSidebar = () => {
  const [betAmount, setBetAmount] = React.useState(10);
  const [selectedMultiplier, setSelectedMultiplier] = React.useState(2.0);

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(Number(e.target.value));
  };

  const handleMultiplierChange = (value: number[]) => {
    setSelectedMultiplier(value[0]);
  };

  const handlePlaceBet = () => {
    console.log(`Bet Placed: Amount = ${betAmount}, Multiplier = ${selectedMultiplier}x`);
    // Here you would typically integrate with your betting logic
  };

  return (
    <div className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Place Your Bet</h3>

      {/* Bet Amount Input */}
      <div className="mb-6">
        <Label htmlFor="bet-amount" className="text-white text-lg mb-2 block">Bet Amount</Label>
        <Input
          id="bet-amount"
          type="number"
          value={betAmount}
          onChange={handleBetAmountChange}
          min="1"
          className="bg-gray-700 border-gray-600 text-white text-lg p-3"
        />
      </div>

      {/* Multiplier Slider */}
      <div className="mb-8">
        <Label htmlFor="multiplier-slider" className="text-white text-lg mb-4 block">Select Multiplier</Label>
        <Slider
          id="multiplier-slider"
          min={1.0}
          max={10.0}
          step={0.1}
          value={[selectedMultiplier]}
          onValueChange={handleMultiplierChange}
          className="w-full"
        />
        <div className="text-center text-gray-300 mt-2 text-sm">
          Current Multiplier: <span className="font-bold text-white">{selectedMultiplier.toFixed(1)}x</span>
        </div>
      </div>

      {/* Place Bet Button */}
      <Button
        onClick={handlePlaceBet}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg rounded-md transition-colors"
      >
        Place Bet
      </Button>
    </div>
  );
};

export default RightSidebar;