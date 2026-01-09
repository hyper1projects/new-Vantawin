import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import LiveLeaderboard from '../components/LiveLeaderboard';
import FinalLeaderboard from '../components/FinalLeaderboard';
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, Trophy, Coins, Zap, Target } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserPool {
  pool_id: string;
  pool_name: string;
  tier: string;
  status?: string;
  end_time?: string;
  prize_pool?: number;
  prize_distribution?: any[];
}

const Leaderboard = () => {
  const [params] = useSearchParams();
  const [userPools, setUserPools] = useState<UserPool[]>([]);
  const [activePoolId, setActivePoolId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const activePool = userPools.find(p => p.pool_id === activePoolId);
  const activePoolName = activePool?.pool_name || 'Leaderboard';

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        // 0. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);

        // Check for URL param overrides (Admin / Direct Link)
        const urlPoolId = params.get('poolId');

        if (urlPoolId) {
          // Fetch specific pool details for the header
          // FIXED: prize_pool -> total_pot
          const { data: poolData } = await supabase
            .from('pools')
            .select('name, tier, status, end_time, total_pot, prize_distribution')
            .eq('id', urlPoolId)
            .single();

          if (poolData) {
            const fetchedUserPools: UserPool[] = [{
              pool_id: urlPoolId,
              pool_name: poolData.name,
              tier: poolData.tier,
              status: poolData.status,
              end_time: poolData.end_time,
              prize_pool: poolData.total_pot, // Mapped from total_pot
              prize_distribution: poolData.prize_distribution
            }];
            setUserPools(fetchedUserPools);
            setActivePoolId(urlPoolId);
          }
        } else if (user) {
          // 1. If User is logged in (and no URL override), fetch ALL pools they are participating in
          // FIXED: prize_pool -> total_pot
          const { data: myEntries } = await supabase
            .from('tournament_entries')
            .select('pool_id, pools(name, tier, status, end_time, total_pot, prize_distribution)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (myEntries && myEntries.length > 0) {
            const fetchedUserPools: UserPool[] = myEntries.map((e: any) => ({
              pool_id: e.pool_id,
              pool_name: e.pools?.name || 'Unknown Pool',
              tier: e.pools?.tier || 'Bronze',
              status: e.pools?.status || 'ongoing',
              end_time: e.pools?.end_time,
              prize_pool: e.pools?.total_pot, // Mapped from total_pot
              prize_distribution: e.pools?.prize_distribution
            })).filter(pool => {
              // Show ongoing pools OR ended pools within 12 hours
              if (pool.status !== 'ended') return true;
              if (!pool.end_time) return false;
              const endTime = new Date(pool.end_time).getTime();
              const twelveHours = 12 * 60 * 60 * 1000;
              return (Date.now() - endTime) < twelveHours;
            });

            if (fetchedUserPools.length > 0) {
              // Sort: Ongoing/Upcoming first, then by date desc
              fetchedUserPools.sort((a, b) => {
                const statusScore = (s?: string) => s === 'ongoing' || s === 'upcoming' ? 2 : 1;
                const scoreA = statusScore(a.status);
                const scoreB = statusScore(b.status);
                if (scoreA !== scoreB) return scoreB - scoreA;
                // If status same, new ones first (using pool_id is rough proxy if time not avail, but we have end_time? Created_at is better but not in UserPool interface. Assuming myEntries query ordered by created_at desc, sort is stable-ish or we rely on the query order for secondary)
                return 0;
              });

              setUserPools(fetchedUserPools);
              setActivePoolId(fetchedUserPools[0].pool_id);
            } else {
              setUserPools([]);
              setActivePoolId(null);
            }
          }
        } else {
          setActivePoolId(null);
        }

      } catch (error) {
        console.error("Error fetching active pool:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [params]); // Added params dependency

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-vanta-dark">
        <Loader2 className="w-10 h-10 text-vanta-neon-blue animate-spin" />
      </div>
    )
  }

  const formatEndTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-vanta-neon-blue rounded-full"></span>
          Leaderboard
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col">
          {activePool?.end_time && (
            <div className="text-sm text-gray-400 font-mono flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activePool.status === 'ended' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              {activePool.status === 'ended' ? 'Ended: ' : 'Ends: '} {formatEndTime(activePool.end_time)}
            </div>
          )}
        </div>

        {/* Pool Switcher Dropdown */}
        {userPools.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center space-x-2 bg-[#011B47] text-vanta-neon-blue px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                <span className="font-semibold text-sm">Switch Pool</span>
                <ChevronDown size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#011B47] border-white/10 text-gray-200 w-56">
              {userPools.map((pool) => (
                <DropdownMenuItem
                  key={pool.pool_id}
                  className={`cursor-pointer focus:bg-white/10 focus:text-white ${activePoolId === pool.pool_id ? 'text-vanta-neon-blue font-bold' : ''}`}
                  onClick={() => setActivePoolId(pool.pool_id)}
                >
                  <span className="truncate">{pool.pool_name}</span>
                  {pool.status === 'ended' && <span className="ml-auto text-xs text-red-400 border border-red-500/30 px-1 rounded">Ended</span>}
                  {pool.status !== 'ended' && <span className="ml-auto text-xs text-gray-500 border border-gray-700 rounded px-1">{pool.tier}</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {activePoolId ? (
        activePool?.status === 'ended' ? (
          <FinalLeaderboard poolId={activePoolId} />
        ) : (
          <LiveLeaderboard
            poolId={activePoolId}
            poolStatus={activePool?.status || 'ongoing'}
            prizePool={activePool?.prize_pool}
            prizeDistribution={activePool?.prize_distribution}
          />
        )
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#011B47] to-[#001233] rounded-[32px] p-8 border border-vanta-neon-blue/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">

            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-vanta-neon-blue to-transparent opacity-50"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-vanta-neon-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative flex flex-col items-center text-center z-10">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-vanta-neon-blue/20 blur-xl rounded-full"></div>
                <Trophy className="h-20 w-20 text-vanta-neon-blue relative z-10" />
                <Coins className="h-8 w-8 text-yellow-400 absolute -bottom-2 -right-2 animate-bounce" style={{ animationDuration: '2s' }} />
              </div>

              <h2 className="text-3xl font-bold text-white mb-3">
                Compete & <span className="text-transparent bg-clip-text bg-gradient-to-r from-vanta-neon-blue to-purple-400">Win Big</span>
              </h2>

              <p className="text-gray-400 mb-8 leading-relaxed">
                Join a tournament pool, make accurate predictions, and climb the leaderboard to win real cash prizes!
              </p>

              <div className="grid grid-cols-3 gap-2 w-full mb-8">
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <Target className="w-6 h-6 text-emerald-400 mb-2" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Predict</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Rank Up</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <Coins className="w-6 h-6 text-vanta-neon-blue mb-2" />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Get Paid</span>
                </div>
              </div>

              <div className="w-full">
                <Link to={currentUserId ? "/pools" : "/login"}>
                  <button className="w-full bg-gradient-to-r from-vanta-neon-blue to-cyan-400 hover:from-cyan-400 hover:to-vanta-neon-blue text-[#001233] font-black text-lg py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                    PLAY NOW
                  </button>
                </Link>
                <p className="mt-4 text-xs text-gray-500">
                  {currentUserId ? "Find an active pool to join!" : "Login to start your winning streak"}
                </p>
                {currentUserId && userPools.length === 0 && (
                  null
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;