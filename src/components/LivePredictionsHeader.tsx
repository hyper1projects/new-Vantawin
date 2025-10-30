"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'; // Import DropdownMenu components

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
      
      {/* Dropdown Menu for "All Live" */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-vanta-neon-blue hover:text-vanta-neon-blue/80 text-sm font-semibold p-0 h-auto"
          >
            All Live <ChevronRight size={16} className="inline-block ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-vanta-blue-medium border-vanta-accent-dark-blue text-vanta-text-light">
          <DropdownMenuItem onClick={() => console.log('View All Live')}>
            View All
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-vanta-accent-dark-blue" />
          <DropdownMenuItem onClick={() => console.log('Filter by Football')}>
            Football
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Filter by Basketball')}>
            Basketball
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Filter by Tennis')}>
            Tennis
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('Filter by Esports')}>
            Esports
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LivePredictionsHeader;