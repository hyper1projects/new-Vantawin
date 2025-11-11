"use client";

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '../lib/utils';

const sportsCategories = ['Football', 'Basketball', 'Tennis', 'A.Football', 'Golf']; // No 'All' for mobile sub-navbar

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
    <div className="fixed top-16 left-0 right-0 h-12 bg-vanta-blue-dark border-b border-gray-700 z-40 flex items-center px-4 md:hidden">
      <div className="flex items-center space-x-4 overflow-x-auto [-webkit-scrollbar:none] [scrollbar-width:none] flex-grow">
        {sportsCategories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            onClick={() => handleSelectCategory(category)}
            className={cn(
              `relative font-medium text-sm px-2 py-1 h-auto flex-shrink-0`,
              isActive(category)
                ? 'text-vanta-neon-blue after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-vanta-neon-blue'
                : 'text-[#B4B2C0] hover:bg-transparent hover:text-white'
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MobileSportsSubNavbar;