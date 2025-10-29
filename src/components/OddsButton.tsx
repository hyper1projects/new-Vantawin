"use client";

import React from 'react';
import { cn } from '../lib/utils';
import { Button as ShadcnButton } from '@/components/ui/button'; // Use shadcn Button as base

interface OddsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
  isViewGameButton?: boolean; // New prop to differentiate styling for the "View Game" button
}

const OddsButton: React.FC<OddsButtonProps> = ({
  children,
  isSelected = false,
  isViewGameButton = false,
  className,
  ...props
}) => {
  const gradientClasses = "p-[2px] rounded-[14px] bg-gradient-to-t from-[#9A3FFE] to-[#00EEEE]";
  const innerButtonClasses = cn(
    "h-full w-full flex items-center justify-center transition-colors duration-300",
    isViewGameButton
      ? "bg-[#011B47] text-vanta-neon-blue hover:bg-[#011B47]/80 rounded-[12px] py-2 text-sm font-semibold"
      : isSelected
        ? "bg-vanta-neon-blue text-vanta-blue-dark rounded-[12px] py-1.5 px-3 text-xs font-semibold"
        : "bg-[#01112D] text-gray-300 hover:bg-[#012A5E] rounded-[12px] py-1.5 px-3 text-xs font-semibold"
  );

  return (
    <div className={cn(gradientClasses, isViewGameButton ? "w-full" : "flex-1", className)}>
      <ShadcnButton className={innerButtonClasses} {...props}>
        {children}
      </ShadcnButton>
    </div>
  );
};

export default OddsButton;