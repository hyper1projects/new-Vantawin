"use client";

import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn Button is available
import { ChevronRight } from 'lucide-react'; // Import ChevronRight icon

interface LivePredictionsHeaderProps {
  liveCount: number;
}

const LivePredictionsHeader: React.FC<LivePredictionsHeaderProps> = ({ liveCount }) => {
  return (
    <div className="bg-vanta-blue-medium rounded-[14px] p-4 flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
       
        <h2 className="text-xl font-semibold text-white">Live Predictions</h2>
        <span className="bg-[#01112D] text-vanta-neon-blue text-sm font-bold px-3 py-1 rounded-full">
          {liveCount}
        </span>
      </div>
      <Button
        variant="ghost"
        className="text-vanta-neon-blue hover:text-vanta-neon-blue/80 text-sm font-semibold p-0 h-auto"
        onClick={() => console.log('View All Live Predictions')}
      >
        All Live <ChevronRight size={16} className="inline-block ml-1" />
      </Button>
    </div>
  );
};

export default LivePredictionsHeader;