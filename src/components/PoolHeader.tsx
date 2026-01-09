"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface PoolHeaderProps {
  pool: Pool;
}

const PoolHeader: React.FC<PoolHeaderProps> = ({ pool }) => {
  const startDate = new Date(pool.startTime);
  const endDate = new Date(pool.endTime);

  const formattedDateRange = `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`;

  return (
    <div
      className="relative w-full h-[250px] bg-cover bg-center rounded-t-[27px] flex flex-col justify-end p-8 overflow-hidden"
      style={{ backgroundImage: `url(${pool.image || '/images/placeholder.svg'})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-vanta-blue-dark to-transparent opacity-90"></div>

      <div className="relative z-10 text-white w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">{pool.name.toUpperCase()}</h1>
              {pool.guaranteedPot && pool.guaranteedPot > 0 && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse border-2 border-yellow-300">
                  GUARANTEED
                </span>
              )}
            </div>
            <div className="flex items-center text-lg font-medium text-gray-300">
              <CalendarDays size={20} className="mr-2" />
              <span>{formattedDateRange}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PoolHeader;