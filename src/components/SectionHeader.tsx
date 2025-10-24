"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button

interface SectionHeaderProps {
  title: string;
  bgColor?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, bgColor, className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-t-xl", // Re-added justify-between
        bgColor ? `bg-[${bgColor}]` : "bg-vanta-blue-medium",
        className
      )}
    >
      <h2 className="text-white text-xl font-semibold">{title}</h2>
      
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" className="text-white hover:bg-vanta-blue-light">All</Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-vanta-blue-light">Live</Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-vanta-blue-light">Upcoming</Button>
      </div>
    </div>
  );
};

export default SectionHeader;