"use client";

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

const sportsCategories = ['Football', 'Basketball', 'Tennis', 'A.Football', 'Esports']; // No 'All' for mobile sub-navbar

const MobileSportsSubNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const activeCategoryParam = queryParams.get('category') || 'football'; // Default to 'football'

  const isActive = (category: string) => {
    const categorySlug = category.toLowerCase().replace('.', '');
    return location.pathname === '/games' && activeCategoryParam === categorySlug;
  };

  const handleSelectCategory = (category: string) => {
    navigate(`/games?category=${category.toLowerCase().replace('.', '')}`);
  };

  return (
    <div className="fixed top-16 left-0 right-0 h-12 bg-vanta-blue-dark border-b border-gray-700 z-40 flex items-center px-4 lg:hidden">
      <div className="flex items-center space-x-4 overflow-x-auto [-webkit-scrollbar:none] [scrollbar-width:none] flex-grow">
        {sportsCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleSelectCategory(category)}
            className={cn(
              "relative font-medium text-sm px-2 py-1 flex-shrink-0 transition-colors duration-200",
              "bg-transparent border-0 outline-none cursor-pointer",
              "focus:outline-none focus-visible:outline-none",
              "[-webkit-tap-highlight-color:transparent]",
              isActive(category)
                ? "text-[#00EEEE]"
                : "text-[#B4B2C0] hover:text-[#00EEEE] hover:drop-shadow-[0_0_5px_#00EEEE]"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileSportsSubNavbar;