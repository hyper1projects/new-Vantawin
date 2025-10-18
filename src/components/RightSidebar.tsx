"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import LeicesterCityLogo from '@/assets/images/leicester-city-logo.png'; // Import the image

const RightSidebar = () => {
  const [predictionAmount, setPredictionAmount] = useState(10);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);

  const handlePredict = () => {
    if (!selectedOutcome) {
      toast.error("Please select an outcome to predict.");
      return;
    }
    if (predictionAmount <= 0) {
      toast.error("Prediction amount must be greater than 0.");
      return;
    }
    toast.success(`Predicted ${predictionAmount} on ${selectedOutcome}`);
    // Here you would typically send the prediction to a backend
  };

  const quickAmountButtons = [10, 25, 50, 100, 250, 500];

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
            <span className="bg-vanta-blue-dark text-[#00EEEE] opacity-60 font-semibold text-xs px-2 py-1 rounded-md">ASV</span>
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
          <h4 className="text-lg font-semibold mb-2">Amount</h4>
          <Input
            type="number"
            value={predictionAmount}
            onChange={(e) => setPredictionAmount(Number(e.target.value))}
            className="w-full bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light mb-2"
          />
          <div className="flex flex-wrap gap-2 justify-start">
            {quickAmountButtons.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="bg-vanta-blue-dark border-vanta-accent-dark-blue text-vanta-text-light text-xs px-3 py-1 h-auto"
                onClick={() => setPredictionAmount(amount)}
              >
                {amount}
              </Button>
            ))}
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