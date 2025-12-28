"use client";

import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PoolInfoCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  tooltipText?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'hot';
}

const PoolInfoCard: React.FC<PoolInfoCardProps> = ({ icon: Icon, title, value, tooltipText, className, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'featured':
        return 'border border-yellow-500/50 bg-yellow-500/10';
      case 'hot':
        return 'border border-red-500/50 bg-red-500/10';
      default:
        return 'bg-[#011B47]';
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case 'featured':
        return 'text-yellow-400';
      case 'hot':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className={`rounded-[18px] p-4 flex flex-col justify-between ${getVariantStyles()} ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className={`p-2 rounded-full ${variant === 'default' ? 'bg-[#0D2C60]' : 'bg-black/20'}`}>
          <Icon size={20} className={variant === 'default' ? "text-vanta-neon-blue" : getValueColor()} />
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
      <span className={`text-2xl font-bold ${getValueColor()}`}>{value}</span>
    </div>
  );
};

export default PoolInfoCard;