"use client";

import React from 'react';
import { Pool } from '../types/pool';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, Loader2, PlayCircle, Trophy, Wallet, Users, Award } from 'lucide-react';
import { useState } from 'react';

interface PoolCardProps {
  pool: Pool;
  isJoined: boolean;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, isJoined }) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const progress = (pool.participants / pool.maxParticipants) * 100;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const getTierClasses = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-yellow-700 text-white';
      case 'Silver':
        return 'bg-gray-400 text-gray-800';
      case 'Gold':
        return 'bg-yellow-500 text-gray-800';
      case 'Platinum':
        return 'bg-blue-100 text-blue-900 border border-blue-300 shadow-[0_0_10px_rgba(255,255,255,0.5)]';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  };

  const formatPrizePool = (amount: number) => {
    if (!amount) return '0';
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    try {
      setIsJoining(true);
      const { data: { user } } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());

      if (!user) {
        navigate('/login');
        return;
      }

      // Call join_pool RPC
      const { error: joinError } = await import('@/integrations/supabase/client').then(m => m.supabase.rpc('join_pool', {
        p_pool_id: pool.id,
        p_user_id: user.id
      }));

      if (joinError) {
        throw joinError;
      }

      // Success! Open modal
      setShowSuccessModal(true);

    } catch (err: any) {
      console.error("Join Error:", err);
      // alert(`Failed to join: ${err.message}`); 
      // Use toast ideally, but simple alert fallback for now if error
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <Link to={`/pools/${pool.id}`} className="relative bg-[#011B47] rounded-[27px] p-4 shadow-sm flex flex-col text-vanta-text-light w-[300px] h-full flex-shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200">
        <img
          src={pool.image}
          alt={pool.name}
          className="w-full h-32 object-cover rounded-t-[27px] absolute top-0 left-0 right-0"
        />
        <div className="pt-36 flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-vanta-neon-blue">{pool.name}</h3>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", getStatusClasses(pool.status))}>
            {pool.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-vanta-text-light mb-6">
          <div className="flex items-center">
            <Trophy className="w-4 h-4 text-yellow-400 mr-1.5" />
            <span className="font-semibold text-vanta-neon-blue">${formatPrizePool(pool.prizePool)}</span>
          </div>
          <div className="flex items-center">
            <Wallet className="w-4 h-4 text-green-400 mr-1.5" />
            <span className="font-semibold text-vanta-neon-blue">${pool.entryFee}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 text-purple-400 mr-1.5" />
            <span className="font-semibold">{pool.participants}/{pool.maxParticipants}</span>
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 text-cyan-400 mr-1.5" />
            <span className={cn("text-xs font-semibold px-2 py-1 rounded-md", getTierClasses(pool.tier))}>
              {pool.tier}
            </span>
          </div>
        </div>

        {pool.status === 'ended' ? (
          <Button
            className="w-full mt-auto bg-gray-700/50 text-gray-400 font-bold z-10 relative cursor-not-allowed hover:bg-gray-700/50"
            disabled
          >
            Ended
          </Button>
        ) : isJoined ? (
          <Button
            className="w-full mt-auto bg-green-500/20 text-green-400 hover:bg-green-500/30 font-bold z-10 relative border border-green-500/30"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/pools/${pool.id}`);
            }}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Joined
          </Button>
        ) : (
          <Button
            className="w-full mt-auto bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 font-bold z-10 relative"
            onClick={handleJoin}
            disabled={isJoining}
          >
            {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Now"}
          </Button>
        )}
      </Link>

      <Dialog open={showSuccessModal} onOpenChange={(open) => {
        if (!open) window.location.reload(); // Refresh on close to update counts
        setShowSuccessModal(open);
      }}>
        <DialogContent className="bg-vanta-blue-dark border-vanta-neon-blue/20 text-center max-w-md p-8 z-50">
          <DialogHeader>
            <div className="mx-auto bg-yellow-500/20 p-4 rounded-full mb-4 animate-bounce">
              <Sparkles size={48} className="text-yellow-400" />
            </div>
            <DialogTitle className="text-3xl font-bold text-white mb-2">You're In! 🎉</DialogTitle>
            <DialogDescription className="text-gray-300 text-lg">
              You've successfully joined the <span className="text-vanta-neon-blue font-bold">{pool.name}</span> pool.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-gray-400 text-sm">
              <span className="text-white font-bold block text-2xl mb-1">1,000 VP</span>
              have been added to your prediction balance.
            </p>
            <p className="text-sm text-yellow-500/80 italic">Good luck and may the odds be in your favor!</p>
          </div>
          <DialogFooter className="flex-col !space-x-0">
            <Button
              onClick={() => navigate('/games')}
              className="w-full bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 text-lg py-6 font-bold rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all"
            >
              Start Predicting 🚀
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PoolCard;