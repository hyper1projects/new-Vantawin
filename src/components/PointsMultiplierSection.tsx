"use client";

import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider'; // Import the Slider component

const PointsMultiplierSection: React.FC = () => {
  const [multiplier, setMultiplier] = useState<number>(1.5); // State for the slider value

  const handleSliderChange = (value: number[]) => {
    setMultiplier(value[0]);
  };

  return (
    <div className="flex flex-col items-center space-y-6 bg-vanta-blue-medium rounded-[27px] shadow-sm pb-12">
      <div className="w-full bg-[#0D2C60] rounded-t-[27px]">
        <SectionHeader title="Points Multiplier" className="w-full" textColor="text-white" />
      </div>

      <div className="w-full px-4 flex flex-col items-center space-y-4">
        <div className="text-white text-4xl font-bold">
          {multiplier.toFixed(1)}x {/* Display the current multiplier value */}
        </div>
        
        <Slider
          defaultValue={[multiplier]}
          max={3}
          min={1}
          step={0.1}
          onValueChange={handleSliderChange}
          className="w-full max-w-xs" // Adjust width as needed
        />

        <Button className="bg-[#00EEEE] text-[#081028] hover:bg-[#00EEEE] hover:text-[#081028] rounded-[12px] px-6 py-2">
          Apply Multiplier
        </Button>
      </div>
    </div>
  );
};

export default PointsMultiplierSection;