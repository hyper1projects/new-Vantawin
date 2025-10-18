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
    <div className="fixed right-4 top-20 h-[calc(100vh-5rem)] min-h-[600px] w-80 bg-vanta-blue-medium text-vanta-text-light flex flex-col z-40 rounded-l-2xl font-outfit p-6"> {/* Changed right-0 to right-4 and added min-h-[600px] */}
      {/* Logo and Match Code */}
      <div className="flex items-start mb-6 mt-4">
        <img
          src={LeicesterCityLogo}
          alt="Leicester City Logo"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-vanta-text-light">CRY vs ASV</span>
          <div className="bg-[#00EEEE] bg-opacity-30 px-2 py-1 rounded mt-1 inline-block">
            <span className="text-[#00EEEE] opacity-60 font-semibold text-sm">ASV</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Match Details */}
        <div className="mb-6">
          <p className="text-sm text-vanta-text-dark text-center">Team A vs Team B</p>
          <p className="text-xs text-vanta-text-dark text-center">Starts in: 01:23:45</p>
        </div>

        {/* Prediction Buttons */}
        <div className="mb-6 space-y-2">
          <Button
            className={`w-full py-3 text-base font-semibold ${selectedOutcome === 'Team A Win' ? 'bg-vanta-accent-blue' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
            onClick={() => setSelectedOutcome('Team A Win')}
          >
            Team A Win (1.8x)
          </Button>
          <Button
            className={`w-full py-3 text-base font-semibold ${selectedOutcome === 'Draw' ? 'bg-vanta-accent-blue' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
            onClick={() => setSelectedOutcome('Draw')}
          >
            Draw (3.5x)
          </Button>
          <Button
            className={`w-full py-3 text-base font-semibold ${selectedOutcome === 'Team B Win' ? 'bg-vanta-accent-blue' : 'bg-vanta-blue-dark hover:bg-vanta-blue-darker'}`}
            onClick={() => setSelectedOutcome('Team B Win')}
          >
            Team B Win (2.2x)
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