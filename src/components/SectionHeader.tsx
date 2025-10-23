"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface SectionHeaderProps {
  title: string;
  bgColor?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, bgColor, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start p-4 rounded-t-xl", // Changed to flex-col and items-start
        bgColor ? `bg-[${bgColor}]` : "bg-vanta-blue-medium",
        className
      )}
    >
      <h2 className="text-white text-xl font-semibold mb-3">{title}</h2> {/* Added mb-3 for spacing */}
      
      {/* Buttons for All, Live, Upcoming */}
      <div className="flex space-x-2"> {/* This div now appears below the h2 */}
        <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 bg-transparent h-8 px-3 text-sm">All</Button>
        <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 bg-transparent h-8 px-3 text-sm">Live</Button>
        <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700 bg-transparent h-8 px-3 text-sm">Upcoming</Button>
      </div>
    </div>
  );
};

export default SectionHeader;