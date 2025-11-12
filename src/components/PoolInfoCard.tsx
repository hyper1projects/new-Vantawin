"use client";

import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PoolInfoCardProps {
  icon: React.ElementType; // Lucide icon component
  title: string;
  value: string | number;
  tooltipText?: string;
  className?: string;
}

const PoolInfoCard: React.FC<PoolInfoCardProps> = ({ icon: Icon, title, value, tooltipText, className }) => {
  return (
    <div className={`bg-[#011B47] rounded-[18px] p-4 flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="bg-[#0D2C60] p-2 rounded-full">
          <Icon size={20} className="text-vanta-neon-blue" />
        </div>
        {tooltipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={16} className="text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-vanta-blue-dark text-vanta-text-light border-vanta-accent-dark-blue">
                <p>{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className="text-sm font-medium text-gray-400 mb-1">{title}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  );
};

export default PoolInfoCard;