"use client";

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PoolDetailCard from '../components/PoolDetailCard';
import { allPoolsData } from '../data/pools'; // Import centralized pool data

const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();

  const pool = allPoolsData.find(p => p.id === poolId);

  if (!pool) {
    return (
      <div className="p-4 text-vanta-text-light text-center">
        <h1 className="text-2xl font-bold mb-4">Pool Not Found</h1>
        <p className="mb-4">The pool you are looking for does not exist.</p>
        <Button onClick={() => navigate('/pools')} className="bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[12px]">
          Go to Pools
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 text-vanta-text-light max-w-3xl mx-auto">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="mb-6 text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back to Pools
      </Button>

      <PoolDetailCard pool={pool} />
    </div>
  );
};

export default PoolDetails;