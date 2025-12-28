import { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import LiveLeaderboard from '../components/LiveLeaderboard';
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, Trophy, Coins, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
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
}

const Leaderboard = () => {
  const [userPools, setUserPools] = useState<UserPool[]>([]);
  const [activePoolId, setActivePoolId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const activePoolName = userPools.find(p => p.pool_id === activePoolId)?.pool_name || 'Leaderboard';

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        // 0. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);

        let targetPoolId: string | null = null;
        let fetchedUserPools: UserPool[] = [];

        // 1. If User is logged in, fetch ALL pools they are participating in
        if (user) {
          const { data: myEntries } = await supabase
            .from('tournament_entries')
            .select('pool_id, pools(name, tier)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (myEntries && myEntries.length > 0) {
            fetchedUserPools = myEntries.map((e: any) => ({
              pool_id: e.pool_id,
              pool_name: e.pools?.name || 'Unknown Pool',
              tier: e.pools?.tier || 'Bronze'
            }));
            setUserPools(fetchedUserPools);
            targetPoolId = fetchedUserPools[0].pool_id; // Default to most recent
          }
        }

        // 2. Removed Global Fallback - we want to show CTA if no user pool found
        // Logic intentionally removed to keep targetPoolId as null if user has no entries

        setActivePoolId(targetPoolId);

      } catch (error) {
        console.error("Error fetching active pool:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-vanta-dark">
        <Loader2 className="w-10 h-10 text-vanta-neon-blue animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <SectionHeader title={activePoolName} textColor="text-vanta-text-light" className="mb-0" />

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
                  <span className="ml-auto text-xs text-gray-500 border border-gray-700 rounded px-1">{pool.tier}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {activePoolId ? (
        <LiveLeaderboard poolId={activePoolId} currentUserId={currentUserId} />
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;