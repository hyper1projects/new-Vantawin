"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // For conditional class merging

interface SportCategoryButtonsProps {
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
}

const SportCategoryButtons: React.FC<SportCategoryButtonsProps> = ({ onSelectCategory, selectedCategory }) => {
  const categories = ['Football', 'Basketball', 'Tennis', 'Esports'];

  return (
    <div className="flex justify-start space-x-4 p-4 mb-8"> {/* Changed justify-center to justify-start and removed background/border classes */}
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onSelectCategory && onSelectCategory(category)}
          className={cn(
            "px-6 py-3 rounded-[14px] font-semibold text-base transition-colors duration-200",
            selectedCategory === category
              ? "bg-vanta-neon-blue text-vanta-blue-dark hover:bg-opacity-90"
              : "bg-vanta-blue-dark text-vanta-text-light hover:bg-vanta-accent-dark-blue"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default SportCategoryButtons;