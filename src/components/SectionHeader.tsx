"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  bgColor?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, bgColor, className }) => {
  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-t-xl", // Removed justify-between
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