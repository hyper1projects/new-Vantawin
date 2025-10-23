"use client";

import React from 'react';
import { cn } from '@/lib/utils';
// No longer need to import Button here as it's being moved out

interface SectionHeaderProps {
  title: string;
  bgColor?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, bgColor, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-t-xl", // Reverted to original flex layout
        bgColor ? `bg-[${bgColor}]` : "bg-vanta-blue-medium",
        className
      )}
    >
      <h2 className="text-white text-xl font-semibold">{title}</h2>
      
      {/* Buttons for All, Live, Upcoming removed from here */}
    </div>
  );
};

export default SectionHeader;