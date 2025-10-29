"use client";

import React from 'react';
import { cn } from '../lib/utils';

interface SectionHeaderProps {
  title: string;
  className?: string;
  textColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, className, textColor = "text-gray-800" }) => {
  return (
    <div className={cn("flex items-center justify-between p-4", className)}>
      <h2 className={cn("text-2xl font-semibold", textColor)}>{title}</h2>
    </div>
  );
};

export default SectionHeader;