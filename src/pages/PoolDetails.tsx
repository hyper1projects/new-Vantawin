import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DollarSign, Users, Wallet, Clock, Loader2, PlayCircle, Trophy, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '../types/pool';
import PoolHeader from '../components/PoolHeader';
import PoolInfoCard from '../components/PoolInfoCard';
import PoolPrizesSection from '../components/PoolPrizesSection';
import PoolStatsCard from '../components/PoolStatsCard';
import { formatDistanceToNowStrict } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const PoolDetails: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pool, setPool] = useState<Pool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchPoolDetails = async () => {
      if (!poolId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // 1. Fetch User Data to check if joined
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: entry } = await supabase
            .from('tournament_entries')
            .select('id')
            .eq('pool_id', poolId)
            .eq('user_id', user.id)
            .maybeSingle();
          if (entry) setHasJoined(true);
        }

        // 2. Fetch Pool Data
        const { data, error } = await supabase
          .from('pools')
          .select('*, tournament_entries(count)')
          .eq('id', poolId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          console.log("Pool Data Fetched:", data);
          console.log("Guaranteed Pot:", data.guaranteed_pot);

          // Calculate effective prize pool (Max of collected vs guaranteed)
          const collectedPot = data.total_pot || 0;
          const guaranteedPot = data.guaranteed_pot || 0;
          const effectivePrizePool = Math.max(collectedPot, guaranteedPot);

          const mappedPool: Pool = {
            id: data.id,
            name: data.name,
            description: data.description,
            status: data.status,
            prizePool: effectivePrizePool,
            guaranteedPot: guaranteedPot,
            entryFee: data.entry_fee,
            participants: data.tournament_entries[0]?.count ?? 0,
            maxParticipants: data.max_participants,
            startTime: data.start_time,
            endTime: data.end_time,
            image: data.image_url,
            tier: data.tier,
            rules: data.rules,
            prizeDistribution: data.prize_distribution || [],
          };
          setPool(mappedPool);
        }
      } catch (error) {
        console.error("Error fetching pool details:", error);
        setPool(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolDetails();
  }, [poolId]);

  const handleJoinPool = async () => {
    try {
      setIsJoining(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to join a pool.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.rpc('join_pool', {
        p_pool_id: poolId,
        p_user_id: user.id
      });

      if (error) {
        throw error;
      }

      // Success!
      setHasJoined(true);
      setShowSuccessModal(true);

    } catch (error: any) {
      console.error('Join Error:', error);
      toast({
        title: "Join Failed",
        description: error.message || "Could not join pool.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-vanta-dark">
        <Loader2 className="w-10 h-10 text-vanta-neon-blue animate-spin" />
      </div>
    );
  }

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

  // Calculate time left
  const endTime = new Date(pool.endTime);
  const now = new Date();
  let timeLeftText = '';
  if (pool.status === 'ongoing' || pool.status === 'upcoming') {
    if (endTime > now) {
      timeLeftText = formatDistanceToNowStrict(endTime, { addSuffix: true });
    } else {
      timeLeftText = 'Ended';
    }
  } else {
    timeLeftText = 'Ended';
  }

  const slotsLeft = pool.maxParticipants ? pool.maxParticipants - pool.participants : 0;

  return (
    <div className="p-0 text-vanta-text-light w-full relative">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-vanta-neon-blue hover:bg-vanta-accent-dark-blue flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Back to Pools
        </Button>
      </div>

      {/* Pool Header with Image and Title */}
      <PoolHeader pool={pool} />

      <div className="max-w-7xl mx-auto px-8 mt-6">
        {pool.status === 'ongoing' && (
          hasJoined ? (
            <Button
              onClick={() => navigate('/games')}
              className="w-full md:w-auto bg-green-500 text-white hover:bg-green-600 rounded-[14px] px-8 py-6 text-xl font-bold shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all flex items-center gap-2"
            >
              <PlayCircle size={24} />
              Enter Pool
            </Button>
          ) : (
            <Button
              onClick={handleJoinPool}
              disabled={isJoining}
              className="w-full md:w-auto bg-vanta-neon-blue text-vanta-blue-dark hover:bg-vanta-neon-blue/90 rounded-[14px] px-8 py-6 text-xl font-bold shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Joining...
                </>
              ) : (
                "Join Now"
              )}
            </Button>
          )
        )}
      </div>

      <div className="p-8 max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-8"> {/* Main content wrapper with flex for desktop */}
        {/* Left Column (for Info and Rules) */}
        <div className="flex-1 lg:w-2/3">
          {/* Info Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">INFO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {/* Changed to lg:grid-cols-2 for 2x2 layout */}
              <PoolInfoCard
                icon={DollarSign}
                title="PRIZE POOL"
                value={`$${pool.prizePool.toLocaleString()}`}
                tooltipText={pool.guaranteedPot ? "This amount is Guaranteed by VantaWin!" : "Total prize money to be distributed among winners."}
                variant={pool.guaranteedPot ? "featured" : "default"}
              />
              <PoolInfoCard
                icon={Users}
                title="PARTICIPANTS"
                value={`${pool.participants} Joined`}
                tooltipText="Number of players currently participating in this pool."
              />
              <PoolInfoCard
                icon={Wallet}
                title="ENTRY FEE"
                value={`$${pool.entryFee}`}
                tooltipText="Cost to join this prediction pool."
              />
              <PoolInfoCard
                icon={Clock}
                title="TIME LEFT"
                value={timeLeftText}
                tooltipText="Remaining time until the pool closes for new entries or ends."
              />
            </div>
          </div>

          {/* Pool Rules & Regulations */}
          <div className="bg-[#011B47] rounded-[18px] p-6 mb-12 lg:mb-0"> {/* Added mb-12 for mobile, mb-0 for desktop */}
            <h2 className="text-2xl font-bold text-white mb-4">POOL RULES & REGULATIONS</h2>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">General Rules:</h3>
            <div className="text-gray-400 leading-relaxed space-y-4">
              {pool.rules ? (
                <p>{pool.rules}</p>
              ) : (
                <ol className="list-decimal list-inside space-y-2">
                  <li><strong>Vanta Allocation:</strong> Upon entry, each participant is allocated <span className="text-vanta-neon-blue">1,000 Vanta Points</span> to strategically distribute across available match predictions.</li>
                  <li><strong>Scoring & Leaderboard:</strong> Successful predictions yield XP based on odds and accuracy. Accumulate XP to climb the leaderboard and secure your position in the prize bracket.</li>
                  <li><strong>Fairness Policy:</strong> To ensure competitive integrity and fair play, users are restricted to participating in only one active pool concurrently.</li>
                </ol>
              )}

              <div className="bg-vanta-dark/50 p-4 rounded-lg border border-white/5">
                <h4 className="text-white font-semibold mb-1">⚠️ Important: Consolidation Policy</h4>
                <p className="text-sm">
                  To ensure the best experience and prize pool stability, <strong>this pool may be consolidated</strong> with other similar pools if the minimum participant count is not reached by the start time. Your entry and potential winnings will simply move to the new, larger "Super Pool" automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (for Prizes and Pool Stats) */}
        <div className="lg:w-1/3 flex flex-col space-y-6">
          <PoolStatsCard players={pool.participants} slotsLeft={slotsLeft} />
          <PoolPrizesSection pool={pool} />
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-vanta-blue-dark border-vanta-neon-blue/20 text-center max-w-md p-8">
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
    </div>
  );
};

export default PoolDetails;