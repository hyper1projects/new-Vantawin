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

  const formattedDateRange = `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM yyyy')}`;

  return (
    <div
      className="relative w-full h-[250px] bg-cover bg-center rounded-t-[27px] flex flex-col justify-end p-8 overflow-hidden"
      style={{ backgroundImage: `url(${pool.image || '/images/placeholder.svg'})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-vanta-blue-dark to-transparent opacity-90"></div>

      <div className="relative z-10 text-white">
        <h1 className="text-4xl font-bold mb-2">{pool.name.toUpperCase()}</h1>
        <div className="flex items-center text-lg font-medium text-gray-300 mb-4">
          <CalendarDays size={20} className="mr-2" />
          <span>{formattedDateRange}</span>
        </div>
        {pool.status === 'ongoing' && (
          <Button className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] px-8 py-3 text-lg font-bold">
            Join Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default PoolHeader;